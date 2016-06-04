<?php
class StatementBillSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['id'] = $this->getUUID();
		$qryParams['creator'] = $_SESSION['name'];
		return parent::add($qryParams);
	}

	public function get($q){
		$data = parent::get($q);
		$userSvc = parent::getSvc('User');
		$userSvc->appendRealName($data['data'],'checker');
		return $data;
	}
}
?>