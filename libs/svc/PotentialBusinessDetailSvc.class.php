<?php
class PotentialBusinessDetailSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['@id'] = $this->getUUID();
		return parent::add($qryParams);
	}
	public function get($q){
		$res = parent::get($q);
		$svc = BaseSvc::getSvc('User');
		$svc->appendRealName($res['data'],'committer');
		return $res;
	}
}
?>