<?php
class StatementBillSvc extends BaseSvc
{
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
		return parent::add($q);
	}

	public function update($q){
		if(isset($q['@status']) && !isset(self::$statusMapping[$q['@status']])){
			throw new Exception("无效状态:".$q['@status']);
		}
		return parent::update($q);
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
		return $res;
	}
	public function get($q){
		$data = parent::get($q);
		foreach($data['data'] as $key => &$value)
			$value['statusName'] = self::$statusMapping[$value['status']];
		$userSvc = parent::getSvc('User');
		$userSvc->appendRealName($data['data'],'checker');
		return $data;
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