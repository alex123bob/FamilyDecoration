<?php
class StatementBillSvc extends BaseSvc
{
	//账单类型  dsdpst:设计定金，pjtf:工程款，贷款(loan表)，other:其他四个是入账。其他都是出账
	public static $BILLTYPE = array('ppd'=>'预付款','reg'=>'工人工资','dsdpst'=>'设计定金','qgd'=>'质量保证金','pjtf'=>'工程款','mtf'=>'材料付款','rbm'=>'报销','wlf'=>'福利','tax'=>'公司税务','other'=>'其他');
	public static $ALL_STATUS = array('new'=>'未提交','rdyck'=>'待一审','rdyck2'=>'待二审','rdyck3'=>'待三审','rdyck4'=>'待终审','chk'=>'审核通过','paid'=>'已付款','accepted'=>'已收款','arch'=>'已归档');

	//账单状态变化
	public static $STATUSMAPPING = array(
		'ppd'=> array('new','rdyck','rdyck2','rdyck3','rdyck4','chk','paid'),
		'reg'=> array('new','rdyck','rdyck2','rdyck3','rdyck4','chk','paid'),
		'qgd'=> array('new','rdyck','rdyck2','rdyck3','rdyck4','chk','paid'),
		'mtf'=> array('new','rdyck','rdyck2','rdyck3','rdyck4','chk','paid'),
		'rbm'=> array('new','rdyck','chk','paid'),
		'wlf'=> array('new','rdyck','chk','paid'),
		'tax'=> array('new','rdyck','rdyck2','rdyck3','rdyck4','chk','paid')
	);

	public function get($q){
		$res = parent::get($q);
		foreach ($res['data'] as &$value) {
			$value['statusName'] = self::$ALL_STATUS[$value['status']];
			$value['billTypeName'] = self::$BILLTYPE[$value['billType']];
		}
		return $res;
	}
	public function getStatusTransferChain($billType,$currentStatus,$offSet){
		$count = count(self::$STATUSMAPPING[$billType]);
		for($i = 0;$i<$count;$i++) {
			if(self::$STATUSMAPPING[$billType][$i] == $currentStatus && $i + $offSet < $count && $i + $offSet >= 0)
				return self::$STATUSMAPPING[$billType][$i+$offSet];
		}
		throw new Exception(self::$ALL_STATUS[$currentStatus].'账单不可操作！');
	}

	public function add($q){
		$q['@id'] = $this->getUUID();
		$q['@creator'] = $_SESSION['name'];
		$q['@status'] = 'new';
		notNullCheck($q,'@billType','审批单类型不能为空!');
		/*notNullCheck($q,'@payee','领款人不能为空!');
		if($q['@billType'] == 'reg' || $q['@billType'] == 'ppd'){
			$obj = array('billType'=>'qgd','projectId'=>$q['@projectId'],'payee'=>$q['@payee'],'professionType'=>$q['@professionType']);
			$qgd = parent::get($obj);
			if($qgd['total'] > 0){
				throw new Exception('项目已经创建保证金，请勿再创建申请单。');
			}
		}*/
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
				throw new Exception("付款金额错误！".$q['@fee']);
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
				throw new Exception('手机号不对,请联系管理员修改!');
			}
			//需要短信验证
			$rand = rand(1000,9999);
			$_SESSION['validateCode'] = $rand;
			include_once __ROOT__."/libs/msgLogDB.php";
			sendMsg($_SESSION['realname'].'-BillStateChange',$_SESSION['name'],$_SESSION['phone'],'您的短信验证码是:'.$rand,null,'sendSMS');
			return array('status'=>'successful', 'type' => 'sms', 'errMsg' => '', 'hint' => '本次操作需要提供短信验证码，<br />验证码已发送到'.$_SESSION['phone'].'，请输入收到的验证码。<br />如果手机号更改或丢失而无法输入验证码，请联系管理员。');
		}else{
			return array('status'=>'successful', 'type' => 'securePass', 'errMsg' => ''.$limit[0].' '.$bill['totalFee'], 'hint' => '本次操作需要提供安全码，<br />请输入您当前账号的安全码进行下一步操作。<br />如果您未初始化安全码，请前往账户管理进行设置，或联系管理员。');
		}
	}
	//检查是否通过短信验证码或者安全密码验证
	private function checkLimit($q,$bill,$statusChange){
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
				throw new Exception('短信校验码错误!');
			}
			unset($_SESSION['validateCode']);
		}else{
			//需要安全密码验证
			$res = $mysql->DBGetAsMap("select * from user where name = '?' and securePass = '?' ",$_SESSION['name'],$q['validateCode']);
			if(count($res) < 1){
				throw new Exception('安全密码验证失败!');
			}
		}
		$_SESSION['secureChecked'] = strtotime(date('Y-m-d H:i:s'));  // 当前时间秒数
	}


	public function changeStatus($q){
		$data = parent::get($q);
		$bills = $data['data'];
		if(count($bills) > 1) throw new Exception("查到".count($bills)."条记录");
		if(count($bills) == 0) throw new Exception("查不到记录");
		if($bills[0]['status'] == 'paid') throw new Exception("已付款,无法更改状态.");

		$bill = $bills[0];
		$q['@status'] = (int)$q['@status'];
		$targetStatus = $this->getStatusTransferChain($bill['billType'],$bill['status'],$q['@status']);
		// 1:forward -1:backward
		//检查额度,检查安全密码,如果超过一定额度要检查短信
		//$this->checkLimit($q,$bill,$statusChange);
		$auditRecord = array();
		$auditRecord['@operator'] = $_SESSION['name'];
		$auditRecord['@billId'] = $q['id'];
		$auditRecord['@orignalStatus'] = $bill['status'];
		$auditRecord['@newStatus'] = $targetStatus;
		$auditRecord['@comments'] = isset($q['@comments']) ? $q['@comments'] : "无";
		$auditRecord['@drt'] = $q['@status'];
		$auditSvc = parent::getSvc('StatementBillAudit');
		$auditSvc->add($auditRecord);
		if($q['@status'] == "chk"){
			$q['@checker'] = $_SESSION['name'];
		}
		if($q['@status'] == "paid") {
			$q['@payer'] = $_SESSION['name'];
		}
		$q['@status']=$targetStatus;
		$res = parent::update($q);
		//通知
		try{
			$this->noticeAfterStatusChange($q,$bill);
		}catch(Exception $e){
			//通知失败不能影响原有业务逻辑
		}
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
		include_once __ROOT__."/libs/msgLogDB.php";
		include_once __ROOT__."/libs/common_mail.php";
		$mailAddresses = array();
		$aliasNames = array();
		foreach ($users as $user) {
			if(contains($user['mail'],'@')){ // 有效邮箱
				array_push($mailAddresses, $user['mail']);
				array_push($aliasNames, $user['realname']);
			}
		}
		if($mailAddresses!= ""){
			sendEmail($mailAddresses, $aliasNames, 'sys-notice@dqjczs.com', "财务单$newStatusCh", $text, null);
		}
		//递交审核后发短信给工程部总经理，邮件给管理员
		//审核通过后发邮件给财务部，发短信给当值项目经理和管理员
		//付款后发邮件给当值项目经理和管理员
		//发短信通知
		$sentPhones = array();
		foreach ($users as $user) {
			try{
				if(startWith($user['level'],'008-')) //财务不用发短信
					continue;
				if($q['@status']=='rdyck' && !startWith($user['level'],'003-001')) //审核通过只给工程部总经理发短信
					continue;
				if($q['@status']=='chk' && startWith($user['level'],'003-001'))
					continue;
				if(startWith($user['level'],'001-')) // 总经办不用发送短信
					continue;
				if(strlen($user['phone']) == 11 && !in_array($user['phone'], $sentPhones)){ // 11位有效手机号
					$phoneNumber = $user['phone'];
					array_push($sentPhones, $user['phone']);
					sendMsg("财务单$newStatusCh",$user['name'],$phoneNumber,$text,null,'sendSMS');
				}
			}catch(Exception $e){
				
			}
		}
	}

	public function getLaborAndPrePaid($q){
		$q['billType'] = 'reg';
		$this->appendSelect = ",tp.cname as professionTypeName ";
		$this->appendJoin = "left join profession_type tp on tp.value = $this->tableName.professionType";
		$data = parent::get($q);
		foreach($data['data'] as $key => &$value){
			$value['statusName'] = self::$ALL_STATUS[$value['status']];
		}
		$userSvc = parent::getSvc('User');
		$userSvc->appendRealName($data['data'],'checker');

		//查预付款
		global $TableMapping;
		global $mysql;
		$sql = 'select count(*) as count,sum(totalFee) as totalPreFee,projectId,payee,professionType from statement_bill where billType = \'ppd\' group by projectId,payee,professionType;';
		$rows = $mysql->DBGetAsMap($sql);
		$map2 = array();
		foreach ($rows as $item) {
			$combinedkey = $item['projectId'].'-'.$item['payee'].'-'.$item['professionType'];
			$map2[$combinedkey] = $item;
		}

		foreach ($data['data'] as &$item) {
			if($item['billType']!='reg'){
				$item['billName'] = $item['billName']."(".self::$billType[$item['billType']].")";
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
		$sqlCount = "select count(1) as cnt from ( $sql ) as temp ";
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
		parent::update(array('id'=>$res['id'],'@totalFee' => $res['totalFee']));
		return $res;
	}

	public function modifyQgd($q){
		global $mysql;
		$obj = array('billType'=>'qgd','projectId'=>$q['projectId'],'payee'=>$q['payee'],'professionType'=>$q['professionType']);
		$qgd = parent::get($obj);
		if($qgd['total'] == 0){
			$array = $mysql->DBGetAsOneArray("select id from statement_bill where (billType = 'reg' or billType = 'ppd') and isDeleted = 'false' and status != 'paid' and status != 'arch' ");
			if(count($array) > 0){
				throw new Exception("以下申请单还未走完全流程：".join('\n',$array));
			}
			$this->add(array('@billType'=>'qgd','@projectId'=>$q['projectId'],'@payee'=>$q['payee'],'@professionType'=>$q['professionType']));
		}
		return parent::update($q);
	}

	public function qualityGuaranteeDeposit($q){
		global $mysql;
		$sql = "select t.projectId,".
						"b.billName,".
						"t.payee,".
						"t.projectName,".
						"t.phone,".
						"t.number,".
						"IFNULL(t.total,0) as total,".
						"IFNULL(p.paid,0) as paid,".
						"t.professionType,".
						"b.deadline as deadline".
				" from (".
					"SELECT count(*) as number,max(phoneNumber) as phone,sum(IFNULL(totalFee, 0)) AS total,projectId,payee,professionType,projectName".
					" FROM statement_bill WHERE isDeleted = 'false' AND (billType = 'reg' OR billType = 'ppd') and payee is not null".
					" GROUP BY projectId,payee,professionType,projectName".
				") t left join (".
					"SELECT sum(IFNULL(paidAmount, 0)) AS paid,projectId,payee,professionType".
					" FROM statement_bill WHERE isDeleted = 'false' AND (billType = 'reg' OR billType = 'ppd') and payee is not null".
					" AND STATUS = 'paid' GROUP BY projectId,payee,professionType,projectName".
				") p on p.projectId = t.projectId and p.payee = t.payee and t.professionType = p.professionType".
				" left join statement_bill b ".
				" on p.projectId = b.projectId and p.payee = b.payee and p.professionType = b.professionType and b.isDeleted = 'false' and b.payee is not null and b.billType = 'qgd'".
				" left join project pro on t.projectId = pro.projectId where pro.captainName = '?' ";
		$count = $mysql->DBGetAsOneArray("select count(*) as cnt from ( $sql ) as temp ",$q['captainName'])[0];
		$data = $count > 0 ? $mysql->DBGetAsMap($sql.BaseSvc::parseLimitSql($q),$q['captainName']) : array();
		foreach ($data as &$value) {
			$value['qgd'] = $value['total'] - $value['paid'];
		}
		$res = array('status'=>'successful','data'=>$data,'total'=>$count);
		return $res;
	}
}
?>