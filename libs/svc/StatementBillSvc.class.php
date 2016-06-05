<?php
class StatementBillSvc extends BaseSvc
{
	private $statusMapping = array('new'=>'新创建','chk'=>'已审核','rbk'=>'打回');
	public function add($qryParams){
		$qryParams['id'] = $this->getUUID();
		$qryParams['creator'] = $_SESSION['name'];
		$qryParams['status'] = 'new';
		/*new: 新创建,未审核
		  chk : 已审核
		  rbk: return back 打回*/
		return parent::add($qryParams);
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
		foreach ($bills as $bill) {
			//只有被打回或者新创建的账单才能申请审核
			if($bill['status'] != 'new' && $bill['status'] != 'rbk')
				throw new Exception($bill['billName']."状态为".$this->statusMapping[$bill['status']]."不能提交审核!");
			$auditRecord = array();
			$auditRecord['operator'] = $_SESSION['name'];
			$auditRecord['billId'] = $q['id'];
			$auditRecord['orignalStatus'] = $bill['status'];
			$auditRecord['newStatus'] = $q['@status'];
			$auditRecord['comments'] = $q['@comments'];
			$auditSvc.add($auditRecord);
			parent::update($q);
		}
	}
	public function get($q){
		$data = parent::get($q);
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