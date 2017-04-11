<?php
class StatementBillSvc extends BaseSvc
{
	//账单类型  dsdpst:设计定金，pjtf:工程款，贷款(loan表)，other:其他四个是入账。其他都是出账
	public static $BILLTYPE = array('ppd'=>'预付款','reg'=>'工人工资','dsdpst'=>'设计定金','qgd'=>'质量保证金','fdf'=>'财务费用(TODO)','pjtf'=>'工程款','mtf'=>'材料付款','rbm'=>'报销','wlf'=>'福利','tax'=>'公司税务','other'=>'其他');
	public static $ALL_STATUS = array('applied'=>'已申请付款','new'=>'未提交','rdyck'=>'待审核','rdyck1'=>'待一审','rdyck2'=>'待二审','rdyck3'=>'待三审','rdyck4'=>'待四审','rdyck5'=>'待五审','chk'=>'审核通过','paid'=>'已付款','accepted'=>'已收款','arch'=>'已归档');

	//账单状态变化
	public static $STATUSMAPPING = array(
		'ppd'=> array('new','rdyck1','rdyck2','rdyck3','rdyck4','chk','paid','arch'),
		'mtf'=>array('rdyck1','rdyck2','chk','paid','arch'),
		'reg'=> array('new','rdyck1','rdyck2','rdyck3','rdyck4','chk','paid','arch'),
		'qgd'=> array('new','rdyck','chk','paid','arch'),
		'rbm'=> array('new','rdyck','chk','paid','arch'),
		'wlf'=> array('new','rdyck','chk','paid','arch'),
		'tax'=> array('new','rdyck','chk','paid','arch')
	);

	public function get($q){
		$res = parent::get($q);
		foreach ($res['data'] as &$value) {
			$value['statusName'] = self::$ALL_STATUS[$value['status']];
			$value['billTypeName'] = self::$BILLTYPE[$value['billType']];
			$value['totalFeeUppercase'] = cny($value['totalFee']);
		}
		BaseSvc::getSvc('User')->appendRealName($res['data'],'payer');
		BaseSvc::getSvc('User')->appendRealName($res['data'],'creator');
		BaseSvc::getSvc('User')->appendRealName($res['data'],'checker');
		return $res;
	}

	public function getStatusTransferChain($billType,$currentStatus,$offSet){
		$count = count(self::$STATUSMAPPING[$billType]);
		for($i = 0;$i<$count;$i++) {
			if(self::$STATUSMAPPING[$billType][$i] == $currentStatus && $i + $offSet < $count && $i + $offSet >= 0)
				return self::$STATUSMAPPING[$billType][$i+$offSet];
		}
		throw new BaseException(self::$ALL_STATUS[$currentStatus].'账单不可操作！');
	}

	public function add($q){
		$q['@id'] = $this->getUUID();
		$q['@creator'] = isset($q["@creator"]) ? $q["@creator"] : $_SESSION['name'];
		if(!isset($q['@status']))
			$q['@status'] = 'new';
		notNullCheck($q,'@billType','审批单类型不能为空!');
		if($q['@billType'] != 'qgd' && $q['@billType'] != 'mtf' && $q['@billType'] != 'pjtf'  && $q['@billType'] != 'dsdpst' )
			notNullCheck($q,'@payee','领款人不能为空!');
		// 是否完工标志位用来判断，当前工程是否要进行监理意见检测。如果完工的工程，是不需要判断当前监理意见是否填写的。
		if($q['@billType'] == 'reg' && $q["@isFrozen"] == "0")
			parent::getSvc('ProjectProgressAudit')->checkAuditPassed($q['@professionType'],$q['@projectId']);
		if(isset($q['@projectId'])){
			$res = BaseSvc::getSvc('Project')->get(array('projectId'=>$q['@projectId']));
			if(count($res['data'] <= 0)){
				throw new BaseException("找不到id为".$q['@projectId'].'的工程项目');
			}
			if(count($res['data'][0]['settled'] != 0)){
				throw new BaseException($res['data'][0]['projectName'].'已被标记为结算完成,无法添加单据!');
			}
		}
		$res = parent::add($q);
		return $res;
	}

	public function update($q){
		if(isset($q['@billType']) && isset($q['@totalFee']) && $q['@billType'] == 'ppd'){
			//预付款 总金额就是领取金额
			$q['@claimAmount'] = $q['@totalFee'];
		}
		if(isset($q['@status']) && $q['@status'] == 'paid'){
			if(!isset($q['@payer']))
				$q['@payer'] = $_SESSION['name'];
			if(!isset($q['@paidTime']))
				$q['@paidTime'] = 'now()';
			notNullCheck($q,'@paidAmount','付款金额不能为空!');
			if((int)$q['@paidAmount'] <= 0)
				throw new BaseException("付款金额错误！".$q['@fee']);
		}
		return parent::update($q);
	}
	//获取限制信息,是否需要短信验证码或者安全密码验证
	public function getLimit($q){
		global $mysql;
		$data = parent::get($q);
		$bills = $data['data'];
		if(count($bills) > 1)
			throw new Exception("查到多条记录:".count($bills));
		if(count($bills) == 0)
			throw new Exception("查不到记录");
		$bill = $bills[0];
		if($bill['status'] == 'paid')
			throw new Exception("已付款,无法更改状态.");
		if(isset($_SESSION['secureChecked']) && strtotime(date('Y-m-d H:i:s')) - $_SESSION['secureChecked'] < 60*60*2 ){
 			//两小时内不用重复校验.
 			return array('status'=>'successful','type' =>'checked','errMsg' => '','hint' => '您已校验过手机验证码,2小时内无需重复校验.');
		}
		$limit = $mysql->DBGetAsOneArray("select paramValue*10000 from system where paramName = 'msg_notice_value_limit' ");
		if($limit[0] <= $bill['totalFee']){
			if(!isset($_SESSION['phone']) || strlen($_SESSION['phone']) != 11){
				throw new BaseException('手机号不对,请联系管理员修改!');
			}
			//需要短信验证
			$rand = rand(1000,9999);
			$_SESSION['validateCode'] = $rand;
			$msgLogSvc = $this->getSvc('MsgLog');
			$msgLogSvc->addAndSend(array(
				'@reciever'=>$_SESSION['name'],
				'@recieverPhone'=>$_SESSION['phone'],
				'@content'=>'您的短信验证码是:'.$rand,
			));
			return array('status'=>'successful', 'type' => 'sms', 'errMsg' => '', 'hint' => '本次操作需要提供短信验证码，<br />验证码已发送到'.$_SESSION['phone'].'，请输入收到的验证码。<br />如果手机号更改或丢失而无法输入验证码，请联系管理员。');
		}else{
			return array('status'=>'successful', 'type' => 'securePass', 'errMsg' => ''.$limit[0].' '.$bill['totalFee'], 'hint' => '本次操作需要提供安全码，<br />请输入您当前账号的安全码进行下一步操作。<br />如果您未初始化安全码，请前往账户管理进行设置，或联系管理员。');
		}
	}
	//检查是否通过短信验证码或者安全密码验证
	public function checkLimit($q,$bill){
		//目前所有状态转换需要校验,但是参数带过来,方便以后某些状态转换不需要校验,直接返回
		if(isset($_SESSION['secureChecked']) && strtotime(date('Y-m-d H:i:s')) - $_SESSION['secureChecked'] < 60*60*2 ){
 			//两小时内不用重复校验.
 			return;
		}
		global $mysql;
		$limit = $mysql->DBGetAsOneArray("select paramValue*10000 from system where paramName = 'msg_notice_value_limit' ");
		if($limit[0] <= $bill['totalFee']){
			//需要短信验证
			if($q['validateCode'] !=  $_SESSION['validateCode']){
				throw new BaseException('短信校验码错误!');
			}
			unset($_SESSION['validateCode']);
		}else{
			//需要安全密码验证
			$res = $mysql->DBGetAsMap("select * from user where name = '?' and securePass = '?' ",$_SESSION['name'],$q['validateCode']);
			if(count($res) < 1){
				throw new BaseException('安全密码验证失败!');
			}
		}
		$_SESSION['secureChecked'] = strtotime(date('Y-m-d H:i:s'));  // 当前时间秒数
	}


	public function changeStatus($q){
		$data = parent::get($q);
		$bills = $data['data'];
		if(count($bills) > 1) throw new BaseException("查到".count($bills)."条记录");
		if(count($bills) == 0) throw new BaseException("查不到记录");
		if($bills[0]['status'] == 'paid') throw new BaseException("已付款,无法更改状态.");
	
		$bill = $bills[0];
		if($bill['status'] != $q['currentStatus'])
			throw new Exception("出错啦!请联系管理员.");
		$q['@status'] = (int)$q['@status'];
		$targetStatus = $this->getStatusTransferChain($bill['billType'],$bill['status'],$q['@status']);
		// 1:forward -1:backward
		//检查额度,检查安全密码,如果超过一定额度要检查短信  质保金暂不检查
		if($bill['billType'] != 'qgd')
			$this->checkLimit($q,$bill);

		$auditRecord = array();
		$auditRecord['@operator'] = $_SESSION['name'];
		$auditRecord['@billId'] = $q['id'];
		$auditRecord['@orignalStatus'] = $bill['status'];
		$auditRecord['@newStatus'] = $targetStatus;
		$auditRecord['@comments'] = isset($q['@comments']) ? $q['@comments'] : "无";
		$auditRecord['@drt'] = $q['@status'];
		$auditSvc = parent::getSvc('StatementBillAudit');
		global $mysql;
		$mysql->begin();
		$auditSvc->add($auditRecord);
		$q['@status']=$targetStatus;
		if($q['@status'] == "chk"){
			$q['@checker'] = $_SESSION['name'];
		}
		if($q['@status'] == "paid") {
			$q['@payer'] = $_SESSION['name'];
			$q['@paidTime'] = 'now()';
		}else{
			unset($q['@paidAmount']);
			unset($q['@paidTime']);
		}		
		$res = parent::update($q);
		$mysql->commit();
		//通知
		$this->noticeAfterStatusChange($q,$bill);
		return $res;
	}

	public function noticeAfterStatusChange($q,$bill){
		//递交审核和审核通过,付款发邮件,短信.
		if($q['@status'] != 'rdyck' && $q['@status'] != 'chk' && $q['@status'] != 'paid'){
			return ;
		}
		global $mysql;
		$newStatus = $q['@status'];
		$newStatusCh = StatementBillSvc::$ALL_STATUS[$newStatus];
		//获取短信模板,及需要提前几天提醒的天数
		$text = $mysql->DBGetAsOneArray("select paramValue from system where paramName = 'msg_notice_bill_status_change'");
		$text = $text[0];
		//您好,{申请人}的财务订单{单号}已被{某人}变更文{现状态}!
		$text = str_replace('{申请人}',$bill['payee'],$text);
		$text = str_replace('{单号}',$bill['id'],$text);
		$text = str_replace('{操作人}',$_SESSION['realname'],$text);
		$text = str_replace('{项目}',$bill['projectName'],$text);
		$text = str_replace('{现状态}',$newStatusCh,$text);
		$text = str_replace('{申领金额}',$bill['claimAmount'],$text);
		$text = str_replace('{总金额}',$bill['totalFee'],$text);
		//组装需要通知到的用户
		$sql = "select name,realname,phone,mail,level from user where isDeleted = 'false' and (
			level like '001-%' or level like '008-%' or level = '003-001' or name in (select captain from project where projectId = '?')
			or name = '?' )";
		$users = $mysql->DBGetAsMap($sql,$bill['projectId'],$_SESSION['name']);
		//所有人都发邮件
		//003-001:工程部总经理
		//001-% :管理员
		//008-% :财务
		//其他:当值项目经理
		//发邮件
		$mailSvc = BaseSvc::getSvc('Mail');
		$msgLogSvc = BaseSvc::getSvc('MsgLog');
		foreach ($users as $user) {
			$mailSvc->add(array('@mailSubject'=>"财务单$newStatusCh",'@mailContent'=>$text,'@mailSender'=>'系统提醒','@mailReceiver'=>$user['name']));
		}
		//递交审核后发短信给工程部总经理，邮件给管理员
		//审核通过后发邮件给财务部，发短信给当值项目经理和管理员
		//付款后发邮件给当值项目经理和管理员
		//发短信通知
		foreach ($users as $user) {
			if(startWith($user['level'],'008-')) //财务不用发短信
				continue;
			if($q['@status']=='rdyck' && !startWith($user['level'],'003-001')) //审核通过只给工程部总经理发短信
				continue;
			if($q['@status']=='chk' && startWith($user['level'],'003-001'))
				continue;
			if(startWith($user['level'],'001-')) // 总经办不用发送短信
				continue;
			$msgLogSvc->add(array('@reciever'=>$user['name'],'@content'=>$text));
		}
	}

	public function getLaborAndPrePaid($q){
		$q['billType'] = 'reg';
		$this->appendSelect = ",tp.cname as professionTypeName ";
		$this->appendJoin = "left join profession_type tp on tp.value = $this->tableName.professionType";
		$data = $this->get($q);

		$userSvc = parent::getSvc('User');
		$userSvc->appendRealName($data['data'],'checker');

		//查预付款
		global $TableMapping;
		global $mysql;
		$sql = 'select count(1) as count,sum(totalFee) as totalPreFee,projectId,payee,professionType from statement_bill where billType = \'ppd\' and isDeleted = \'false\' group by projectId,payee,professionType;';
		$rows = $mysql->DBGetAsMap($sql);
		$map2 = array();
		foreach ($rows as $item) {
			$combinedkey = $item['projectId'].'-'.$item['payee'].'-'.$item['professionType'];
			$map2[$combinedkey] = $item;
		}

		foreach ($data['data'] as &$item) {
			if($item['billType']!='reg'){
				$item['billName'] = $item['billName']."(".self::$BILLTYPE[$item['billType']].")";
				continue;
			}
			$key = $item['projectId'].'-'.$item['payee'].'-'.$item['professionType'];
			if(isset($map2[$key])){
				$item['hasPrePaidBill'] = 'true';
				$item['remainingTotalFee'] = $item['totalFee'] - $map2[$key]['totalPreFee'];
				$item['prePaidFee'] = $map2[$key]['totalPreFee'];
			}else{
				$item['hasPrePaidBill'] = 'false';
				$item['remainingTotalFee'] = '';
				$item['prePaidFee'] = '';
			}
		}
		$projectSvc = parent::getSvc('Project');
		$projectSvc->appendCaptain($data['data']);
		
		//追加预付款单子
		$q['billType'] = 'ppd';
		$this->appendSelect = ",tp.cname as professionTypeName ";
		$this->appendJoin = "left join profession_type tp on tp.value = $this->tableName.professionType";
		$data2 = $this->get($q);
		$userSvc->appendRealName($data2['data'],'checker');
		$projectSvc->appendCaptain($data2['data']);
		foreach ($data2['data'] as $key => $value) {
			array_push($data['data'], $value);
		}
		return $data;
	}

	public function getByStatus($q){
		$sql = "select pt.cname as professionTypeName,p.captain,p.captainName,b.* from statement_bill b 
				left join project p on b.projectId = p.projectId and p.isDeleted = 'false' left join profession_type pt on pt.value = b.professionType where b.isDeleted = 'false' and b.status = '?' ";
		if (isset($q["createTime"])) {
			$sql .= " and b.createTime ".$q["createTime"];
		}
		if (isset($q["captain"])) {
			$sql .= " and p.captain like '%".$q["captain"]."%'";
		}
		if (isset($q["id"])) {
			$sql .= " and b.id like '%".$q["id"]."%'";
		}
		if (isset($q["projectName"])) {
			$sql .= " and p.projectName like '%".$q["projectName"]."%'";
		}
		if (isset($q["billType"])) {
			$sql .= " and b.billType = '".$q["billType"]."'";
		}else{
			$sql .= " and (b.billType = 'ppd' or b.billType = 'reg')";
		}
		$sqlCount = "select count(1) as cnt from ( $sql ) as temp limit 0,1";
		global $mysql;
		$count = $mysql->DBGetAsOneArray($sqlCount,array($q['status']));
		$limit = $this->parseLimitSql($q);
		$orderBy = $this->parseOrderBySql($q);
		$row = $mysql->DBGetAsMap($sql.$limit.$orderBy,array($q['status']));
		$userSvc = parent::getSvc('User');
		$userSvc->appendRealName($row,'checker');
		return array('total'=>(int)$count[0],'data'=>$row);
	}

	public function syncTotalFee($q){
		return $this->getTotalFee($q);
	}

	public function getTotalFee($q){
		notNullCheck($q,'id');
		global $mysql;
		$sql = "select IFNULL(sum(amount*unitPrice),0) as totalFee from statement_bill_item where billId = ? and isDeleted='false' ";
		$res = $mysql->DBGetAsMap($sql,array($q['id']));
		$res[0]['id'] = $q['id'];
		$res = $res[0];
		$res['totalFee'] = round($res['totalFee'],3);
		$res['totalFeeUppercase'] = cny($res['totalFee']);
		parent::update(array('id'=>$res['id'],'@totalFee' => $res['totalFee']));
		return $res;
	}

	public function modifyQgd($q){
		global $mysql;
		if($q['id'] == ""){
			$orignalBill = parent::get(array('id'=>$q['@refId']));
			$orignalBill = $orignalBill['data'][0];
			$q['@claimAmount'] = $q['@qgd'];
			$q['@totalFee'] = $q['@qgd'];
			$q['@payee'] = $orignalBill['payee'];
			$q['@billName'] = '质保金单';
			$q['@projectName'] = $orignalBill['projectName'];
			$q['@projectId'] = $orignalBill['projectId'];
			$q['@phoneNumber'] = $orignalBill['phoneNumber'];
			$q['@professionType'] = $orignalBill['professionType'];
			$q['@billType'] = 'qgd';
			return $this->add($q);
		}else{
			return parent::update($q);
		}
	}

	public function qualityGuaranteeDeposit($q){
		global $mysql;
		$sql = "select o.id as refId,b.id,o.projectId,".
						"b.billName,".
						"o.payee,".
						"o.projectName,".
						"o.phoneNumber,".
						"b.totalFee,". //质保金单子的totalFee就是质保金金额，有可能是抹平/调整后的
						"o.totalFee as total,".
						"o.paidAmount as paid,".
						"o.professionType,".
						"prof.cname as professionTypeName,".
						"b.status,".
						"b.descpt,".
						"b.deadline";
		$where = " from statement_bill o ".
				" left join statement_bill b ".
				" on o.id = b.refId and b.isDeleted = 'false' and b.billType = 'qgd'".
				" left join project pro on o.projectId = pro.projectId".
				" left join profession_type prof on prof.value = o.professionType".
				" where pro.captainName = '?' and (o.status = 'paid' or o.status = 'arch') and o.paidAmount != o.totalFee and o.billType = 'reg' and o.isDeleted = 'false'";
		$count = $mysql->DBGetAsOneArray("select count(1) ".$where,$q['captainName'])[0];
		$data = $count > 0 ? $mysql->DBGetAsMap($sql.$where.BaseSvc::parseLimitSql($q),$q['captainName']) : array();
		foreach ($data as &$value) {
			$value['qgd'] = round($value['total'] - $value['paid']);
			if($value['status'] != null)
				$value['statusName'] = self::$ALL_STATUS[$value['status']];
		}
		$res = array('status'=>'successful','data'=>$data,'total'=>$count);
		return $res;
	}
}
?>