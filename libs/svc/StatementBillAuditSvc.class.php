<?php
class StatementBillAuditSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}
	public function get($q){
		require_once __ROOT__."/libs/svc/StatementBillStatusConfig.php";
		global $ALL_STATUS;
		$res = parent::get($q);
		$billSvc = $this->getSvc('StatementBill');
		foreach ($res['data'] as &$v) {
			if(isset($v['orignalStatus']))
				$v['orignalStatusName'] = $ALL_STATUS[$v['orignalStatus']];
			if(isset($v['newStatus']))
				$v['newStatusName'] = $ALL_STATUS[$v['newStatus']];
		}
		$u = $this->getSvc('User');
		$u->appendRealName($res['data'],'operator');
		return $res;
	}
}
?>