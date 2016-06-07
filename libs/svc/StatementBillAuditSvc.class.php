<?php
class StatementBillAuditSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}
	public function get($q){
		$res = parent::get($q);
		$billSvc = $this->getSvc('StatementBill');
		foreach ($res['data'] as &$v) {
			if(isset($v['orignalStatus']))
				$v['orignalStatusName'] = StatementBillSvc::$statusMapping[$v['orignalStatus']];
			if(isset($v['newStatus']))
				$v['newStatusName'] = StatementBillSvc::$statusMapping[$v['newStatus']];
		}
		return $res;
	}
}
?>