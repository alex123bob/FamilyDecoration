<?php
class StatementBillItemRemarkSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		if(!isset($q['@commiter']))
			$q['@commiter'] = $_SESSION['name'];
		return parent::add($q);
	}

	public function get($q){
		$res = parent::get($q);
		$svc = BaseSvc::getSvc('User');
		$svc->appendRealName($res['data'],'committer');
		return $res;
	}
}

?>