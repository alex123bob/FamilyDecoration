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
			$v['referenceNumber'] = $v['referenceItems'] == null || $v['referenceItems'] == "" ? 0 : substr_count($v['referenceItems'],',')+1;
		return $res;
	}
}
?>