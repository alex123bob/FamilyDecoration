<?php
class SupplierOrderSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		if(!isset($q['@creator'])){
			$q['@creator'] = $_SESSION['name'];
		}
		return parent::add($q);
	}

	public function getStatusTransferChain($currentStatus,$offSet){
		$count = count(StatementBillSvc::$STATUSMAPPING['splo']);
		for($i = 0;$i<$count;$i++) {
			if(StatementBillSvc::$STATUSMAPPING['splo'][$i] == $currentStatus && $i + $offSet < $count && $i + $offSet >= 0)
				return StatementBillSvc::$STATUSMAPPING['splo'][$i+$offSet];
		}
		throw new BaseException(StatementBillSvc::$ALL_STATUS[$currentStatus].'账单不可操作！');
	}
	
	public function applyPayment($q){
		notNullCheck($q,'@orderIds','单号不能为空(orderIds)!');
		$orderIds = $q['@orderIds'];
		global $mysql;
		$orders = $mysql->DBGetAsMap("select * from supplier_order where status != 'applied' and isDeleted = 'false' and id in ( $orderIds ) ");
		if(count($orders) != substr_count($orderIds,',')+1 || count($orders) == 0)
			throw new BaseException('订单数量不一致！');

		$projectNames = array();
		foreach ($orders as $order) {
			if(!in_array($order['projectName'], $projectNames))
				array_push($projectNames,$order['projectName']);
		}

		$mysql->begin();
		$statementBillSvc = parent::getSvc('StatementBill');	
		$auditSvc = parent::getSvc('SupplierOrderAudit');
		$supplierId = $orders[0]['supplierId'];
		$order = $orders[0];
		$statementBill = $statementBillSvc->add(array(
				'@projectId'=>$order['projectId'],
				'@billValue'=>$order['totalFee'],
				'@supplierId'=>$supplierId,
				'@totalFee'=>$q['@totalFee'],
				'@claimAmount'=>$q['@claimAmount'],
				'@status'=>StatementBillSvc::$STATUSMAPPING['mtf'][0],
				'@billType'=>'mtf',
				'@projectName'=>join(',',$projectNames),
				'@refId'=>$orderIds
			));
		$statementBill = $statementBill['data'];
		$newStatus = $this->getStatusTransferChain($order['status'], +1);
		//记录日志
		foreach ($orders as $order) {
			$auditRecord = array();
			if($order['supplierId'] != $supplierId){
				throw new BaseException('不能同时选中多个供应商！');
			}
			$auditRecord['@operator'] = $_SESSION['name'];
			$auditRecord['@billId'] = $order['id'];
			$auditRecord['@orignalStatus'] = $order['status'];
			$auditRecord['@newStatus'] = $newStatus;
			$auditRecord['@comments'] = "申请付款(单号".$statementBill['id'].')';
			$auditRecord['@drt'] = '1';

			$auditSvc->add($auditRecord);
		}
		$orders = $mysql->DBExecute("update supplier_order set status = '".$newStatus."',paymentId = '".$statementBill['id']."' where status != '".$newStatus."' and isDeleted = 'false' and id in ($orderIds) ");
		
		$mysql->commit();
		return array('status'=>'successful', 'data' => $statementBill);
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
		$StatementBillSvc = BaseSvc::getSvc('StatementBill');
		$targetStatus = $this->getStatusTransferChain($bill['status'],$q['@status']);
		// 1:forward -1:backward
		//检查额度,检查安全密码,如果超过一定额度要检查短信  质保金暂不检查
		$StatementBillSvc->checkLimit($q,$bill);

		$auditRecord = array();
		$auditRecord['@operator'] = $_SESSION['name'];
		$auditRecord['@billId'] = $q['id'];
		$auditRecord['@orignalStatus'] = $bill['status'];
		$auditRecord['@newStatus'] = $targetStatus;
		$auditRecord['@comments'] = (isset($q['@comments']) ? $q['@comments'] : "无");
		$auditRecord['@drt'] = $q['@status'];
		$auditSvc = parent::getSvc('SupplierOrderAudit');
		global $mysql;
		$mysql->begin();
		$auditSvc->add($auditRecord);
		$q['@status']=$targetStatus;
		if($q['@status'] == "chk"){
			$q['@checker'] = $_SESSION['name'];
		}
		unset($q['@paidAmount']);
		unset($q['@paidTime']);
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
		$StatementBillSvc = BaseSvc::getSvc('StatementBill');
		$newStatusCh = StatementBillSvc::$ALL_STATUS[$newStatus];
		$text = "您{项目}项目的材料订购单{单号}已被{操作人}变更为{现状态},总金额：{总金额}!";
		$text = str_replace('{单号}',$bill['id'],$text);
		$text = str_replace('{操作人}',$_SESSION['realname'],$text);
		$text = str_replace('{项目}',$bill['projectName'],$text);
		$text = str_replace('{现状态}',$newStatusCh,$text);
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
		$limit = $mysql->DBGetAsOneArray("select paramValue*10000 from `system` where paramName = 'msg_notice_value_limit' ");
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

	public function getWithSupplier($q){
		$StatementBillSvc = BaseSvc::getSvc('StatementBill');
		$this->appendSelect = ",sp.name as supplier,sp.email as email,sp.phone as phoneNumber,p.projectName,p.captain as creatorRealName";
		$this->appendJoin = "left join supplier sp on sp.id = supplier_order.supplierId left join project p on p.projectId = supplier_order.projectId";
		//$this->appendWhere = " and sp.isDeleted = 'false' and p.isDeleted = 'false'";
		$data = $this->get($q);
		foreach ($data['data'] as &$item ) {
			$item['totalFee'] = round($item['totalFee'],3);
			$item['totalFeeUppercase'] = cny($item['totalFee']);
			if($item['status'] != null)
				$item['statusName'] = StatementBillSvc::$ALL_STATUS[$item['status']];
		}		
		return $data;
	}

	public function getToPayTotalFee($q){
		global $mysql;
		notNullCheck($q,'supplierId','供应商不能为空(supplierId)!');
		$res = $mysql->DBGetAsMap("select sum(totalFee) as totalFee from supplier_order where status = 'rdyck3' and isDeleted = 'false' and supplierId = '".$q['supplierId']."' ");
		return array('status'=>'successful', 'totalFee' => $res[0]['totalFee'] == null ? 0 : $res[0]['totalFee']);
	}

	public function getTotalFee($q){
		notNullCheck($q,'id');
		global $mysql;
		$sql = "select IFNULL(sum(amount*unitPrice),0) as totalFee from supplier_order_item where billId = ? and isDeleted='false' ";
		$res = $mysql->DBGetAsMap($sql,array($q['id']));
		$res[0]['id'] = $q['id'];
		$res = $res[0];
		$res['totalFee'] = round($res['totalFee'],3);
		$res['totalFeeUppercase'] = cny($res['totalFee']);
		parent::update(array('id'=>$res['id'],'@totalFee' => $res['totalFee']));
		return $res;
	}
}

?>