<?php
class StatementBillAuditSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}
}
?>