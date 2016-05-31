<?php
class StatementBillItemSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['id'] = $this->getUUID();
		return parent::add($qryParams);
	}
	public function get($q){
		$res = parent::get($q);
		foreach($res['data'] as &$v)
			$v['referenceNumber'] = substr_count($v['referenceItems'],',');
		return $res;
	}
}
?>