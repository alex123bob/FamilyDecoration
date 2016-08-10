<?php
class BusinessGoalSvc extends BaseSvc
{

	public function add($q){
		global $mysql;
		$q['@id'] = $this->getUUID();
		$res = parent::add($q);
		return $res;
	}
}

?>