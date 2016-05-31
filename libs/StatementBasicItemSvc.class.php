<?php
class StatementBasicItemSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['id'] = $this->getUUID();
		return parent::add($qryParams);
	}
	public function get($q){
		$res = parent::get($q);
		foreach($res['data'] as &$v)
			$v['referenceNumber'] = $v['referenceItems'] != "" && $v['referenceItems'] != null ? substr_count($v['referenceItems'],',')+1: 0;
		return $res;
	}
}
?>