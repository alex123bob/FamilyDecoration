<?php
class StatementBillSvc extends BaseSvc
{
	private $statusMapping = array('new'=>'未提交','rdyck'=>'待审核','chk'=>'已审核','rbk'=>'打回');
	private $statusChangingMapping = array(
			'new->rdyck', //新创建->待审核
			'rdyck->chk', //待审核->已审核
			'rdyck->rbk', //待审核->打回
			'rbk->rdyck'  //打回->待审核
		);
	public function add($q){
		$q['@id'] = $this->getUUID();
		$q['@creator'] = $_SESSION['name'];
		$q['@status'] = 'new';
		return parent::add($q);
	}

	public function update($q){
		if(isset($q['@status']) && !isset($this->statusMapping[$q['@status']])){
			throw new Exception("无效状态:".$q['@status']);
		}
		return parent::update($q);
	}

	public function changeStatus($q){
		$data = parent::get($q);
		$bills = $data['data'];
		$auditSvc = parent::getSvc('StatementBillAudit');
		$res = array();
		foreach ($bills as $bill) {
			$statusChange = $bill['status']."->".$q['@status'];
			if(!isset($this->statusChangingMapping[$statusChange]))
				throw new Exception("不能".$statusMapping[$bill['status']]."由转为".$statusMapping[$q['@status']]);
			$auditRecord = array();
			$auditRecord['operator'] = $_SESSION['name'];
			$auditRecord['billId'] = $q['id'];
			$auditRecord['orignalStatus'] = $bill['status'];
			$auditRecord['newStatus'] = $q['@status'];
			$auditRecord['comments'] = $q['@comments'];
			$auditSvc.add($auditRecord);
			$r = parent::update($q);
			array_push($res, $r);
		}
		return $res;
	}
	public function get($q){
		$data = parent::get($q);
		foreach($data['data'] as $key => &$value)
			$value['statusName'] = $this->statusMapping[$value['status']];
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