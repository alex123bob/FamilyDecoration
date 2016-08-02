<?php
class StatementBillAuditSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		if(isset($q['@operator'])){
			$q['@operator'] = $_SESSION['name'];
		}
		return parent::add($q);
	}
	public function get($q){
		require_once __ROOT__."/libs/svc/StatementBillSvc.class.php";
		$res = parent::get($q);
		$billSvc = $this->getSvc('StatementBill');
		foreach ($res['data'] as &$v) {
			if(isset($v['orignalStatus']))
				$v['orignalStatusName'] = StatementBillSvc::$ALL_STATUS[$v['orignalStatus']];
			if(isset($v['newStatus']))
				$v['newStatusName'] = StatementBillSvc::$ALL_STATUS[$v['newStatus']];
		}
		$u = $this->getSvc('User');
		$u->appendRealName($res['data'],'operator');
		return $res;
	}
}
?>