<?php
class StatementBillSvc extends BaseSvc
{
	public static $billType = array('ppd'=>'预付款','reg'=>'普通账单','qgd'=>'质量保证金');
	public static $statusMapping = array('new'=>'未提交','rdyck'=>'待审核','chk'=>'已审核','rbk'=>'打回','paid'=>'已付款');
	public static $statusChangingMapping = array(
			'new->rdyck'=>1, //新创建->待审核
			'rdyck->chk'=>1, //待审核->已审核
			'rdyck->rbk'=>1, //待审核->打回
			'rbk->rdyck'=>1, //打回->待审核
			'chk->paid'=>1  //已审核->已付款
		);
	public function add($q){
		$q['@id'] = $this->getUUID();
		$q['@creator'] = $_SESSION['name'];
		$q['@status'] = 'new';
		notNullCheck($q,'@billType','审批单类型不能为空!');
		return parent::add($q);
	}

	public function update($q){
		if(isset($q['@status']) && !isset(self::$statusMapping[$q['@status']])){
			throw new Exception("无效状态:".$q['@status']);
		}
		if(isset($q['@billType']) && isset($q['@totalFee']) && $q['@billType'] == 'ppd'){
			//预付款 总金额就是领取金额
			$q['@claimAmount'] = $q['@totalFee'];
		}
		//   notNullCheck($q,'@payee','领款人不能为空!');
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
		$limit = $mysql->DBGetAsOneArray("select paramValue*10000 from system where id = 10 ");
		if($limit[0] <= $bill['totalFee']){
			if(!isset($_SESSION['phone']) || strlen($_SESSION['phone']) != 11){
				throw new Exception('手机号不对,请联系管理员修改!');
			}
			//需要短信验证
			$rand = rand(1000,9999);
			$_SESSION['validateCode'] = $rand;
			include_once __ROOT__."/libs/msgLogDB.php";
			sendMsg($_SESSION['realname'].'-BillStateChange',$_SESSION['name'],$_SESSION['phone'],'您的短信验证码是:'.$rand,null,'sendSMS');
			return array('status'=>'successful', 'type' => 'sms', 'errMsg' => '', 'hint' => '本次操作需要提供短信验证码，<br />验证码已发送，请输入收到的验证码。<br />如果手机号更改或丢失而无法输入验证码，请联系管理员。');
		}else{
			return array('status'=>'successful', 'type' => 'securePass', 'errMsg' => '', 'hint' => '本次操作需要提供安全码，<br />请输入您当前账号的安全码进行下一步操作。<br />如果您未初始化安全码，请前往账户管理进行设置，或联系管理员。');
		}
	}
	//检查是否通过短信验证码或者安全密码验证
	private function checkLimit($q,$bill,$statusChange){
		//目前所有状态转换需要校验,但是参数带过来,方便以后某些状态转换不需要校验,直接返回
		global $mysql;
		$limit = $mysql->DBGetAsOneArray("select paramValue*10000 from system where id = 10 ");
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
	}


	public function changeStatus($q){
		if(!isset(self::$statusMapping[$q['@status']])){
			throw new Exception("未知状态:".$q['@status']);
		}
		$data = parent::get($q);
		$bills = $data['data'];
		$auditSvc = parent::getSvc('StatementBillAudit');
		if(count($bills) > 1)
			throw new Exception("查到多条记录:".count($bills));
		if(count($bills) == 0)
			throw new Exception("查不到记录");
		$bill = $bills[0];
		if($bill['status'] == 'paid')
			throw new Exception("已付款,无法更改状态.");
		$statusChange = $bill['status']."->".$q['@status'];
		if(!isset(self::$statusChangingMapping[$statusChange]))
			throw new Exception("不能由".self::$statusMapping[$bill['status']]."转为".self::$statusMapping[$q['@status']]);
		//检查额度,检查安全密码,如果超过一定额度要检查短信
		$this->checkLimit($q,$bill,$statusChange);
		$auditRecord = array();
		$auditRecord['@operator'] = $_SESSION['name'];
		$auditRecord['@billId'] = $q['id'];
		$auditRecord['@orignalStatus'] = $bill['status'];
		$auditRecord['@newStatus'] = $q['@status'];
		$auditRecord['@comments'] = isset($q['@comments']) ? $q['@comments'] : "没有评论";
		$auditSvc->add($auditRecord);
		$res = parent::update($q);
		if($q['@status'] == "chk" || $q['@status'] == 'rbk'){
			parent::update(array('id'=>$q['id'],'@checker'=>$_SESSION['name']));
		}
		if($q['@status'] == "paid") {
			parent::update(array('id'=>$q['id'],'@checker'=>$_SESSION['name'],'@isPaid'=>'true'));
		}
		//通知
		try{
			$this->noticeAfterStatusChange($q,$bill);
		}catch(Exception $e){
			//通知失败不能影响原有业务逻辑
		}
		
		return $res;
	}

	public function noticeAfterStatusChange($q,$bill){
		//递交审核和审核通过发邮件,短信.
		if($q['@status'] != 'rdyck' && $q['@status'] != 'chk' && $q['@status'] != 'paid'){
			return ;
		}
		$newStatus = $q['@status'];
		$newStatusCh = StatementBillSvc::$billType[$newStatus];
		//获取短信模板,及需要提前几天提醒的天数
		$text = $mysql->DBGetAsOneArray('select paramValue from system where id = 11');
		//您好,{申请人}的财务订单{单号}已被{某人}变更文{现状态}!
		$text = str_replace('{申请人}',$bill['payee'],$text);
		$text = str_replace('{单号}',$bill['id'],$text);
		$text = str_replace('{某人}',$_SESSION['realname'],$text);
		$text = str_replace('{现状态}',$newStatusCh,$text);
		echo "$text<br />\n";
		//组装需要通知到的用户
		$emailRecievers = array();
		$msgRecievers = array();
		global $mysql;
		$sql = "select name,realname,phone,mail from user where isDelete = false' and ";
		$paramArray = array();
		switch ($newStatus) {
			case 'rdyck': //递交审核后发短信给工程部总经理，邮件给管理员
				//003-001  工程部总经理  //001-% 管理员
				$sql .= "level like '001-%' or level = '003-001' ";
				break;
			case 'chk'://审核通过后发邮件给财务部，发短信给当值项目经理和管理员
				//008-% 财务   //001-% 管理员
				$sql .= "level like '001-%' or level like '008-%' or level = '003-001' or name in (select caption from project where projectId = '?') ";
				array_push($paramArray, $bill['projectId']);
				break;
			case 'paid'://付款后发邮件给当值项目经理和管理员
				//001-% 管理员  // 项目经理
				$sql .= "level like '001-%' or level = '003-001' or name in (select caption from project where projectId = '?') ";
				array_push($paramArray, $bill['projectId']);
				break;
			default:
				return;
		}
		$users = $mysql->DBGetAsMap($sql,$paramArray);
		switch ($newStatus) {
			case 'rdyck': //递交审核后发短信给工程部总经理，邮件给管理员
				//003-001  工程部总经理  //001-% 管理员
				$sql .= "level like '001-%' or level = '003-001' ";
				break;
			case 'chk'://审核通过后发邮件给财务部，发短信给当值项目经理和管理员
				//008-% 财务   //001-% 管理员
				$sql .= "level like '001-%' or level like '008-%' or level = '003-001' or name in (select caption from project where projectId = '?') ";
				array_push($paramArray, $bill['projectId']);
				break;
			case 'paid'://付款后发邮件给当值项目经理和管理员
				//001-% 管理员  // 项目经理
				$sql .= "level like '001-%' or level = '003-001' or name in (select caption from project where projectId = '?') ";
				array_push($paramArray, $bill['projectId']);
				break;
			default:
				return;
		}
		//发邮件
		include_once __ROOT__."/libs/msgLogDB.php";
		include_once __ROOT__."/libs/mailDB.php";
		foreach ($emailRecievers => $user) {
			try{
				if(contains($user['mail'],'@')){ // 有效邮箱
					$mail = $user['mail'];
					echo "send email $text to $mail<br /> \n";
					sendEMail($mail, null, 'sys-notice@dqjczs.com', "[佳诚装饰]财务单$newStatusCh", $text, null);
					insert('sys-notice@dqjczs.com','sys-notice@dqjczs.com',$mail,$mail,"[佳诚装饰]财务单$newStatusCh",$text);
				}
			}catch(Exception $e){
				
			}
			
		}
		//发短信通知
		foreach ($msgRecievers  => $user) {
			try{
				if(strlen($user['phone']) == 11 ){ // 11位有效手机号
					$phoneNumber = $user['phone'];
					echo "send $text to $phoneNumber<br /> \n";
					sendMsg("[佳诚装饰]财务单$newStatusCh",$user['name'],$phoneNumber,$text,null,'sendSMS');
				}
			}catch(Exception $e){
				
			}
		}
	}

	public function get($q){
		$data = parent::get($q);
		foreach($data['data'] as $key => &$value){
			$value['statusName'] = self::$statusMapping[$value['status']];
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
		return $data;
	}

	public function getByStatus($q){
		if(contains($q['status'],',')){
			$this->appendWhere  = " and status in ('".str_replace(",","','",$q['status'])."' ) ";
			unset($q['status']);
		}
		return $this->get($q);
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
}
?>