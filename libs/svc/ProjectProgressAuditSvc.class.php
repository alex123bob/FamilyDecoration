<?php
class ProjectProgressAuditSvc extends BaseSvc{
	public function add($q){
		$content = $q['@content'];
		if(!isset($q['@auditor'])){
			$q['@auditor'] = $_SESSION['name'];
		}
		$itemId = $q['@itemId'];
		$temp = explode("-",$itemId); 
		$q['@projectId'] = $temp[0]; 
		$q['@columnName'] = $temp[1];
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function get($q){
		$data = parent::get($q);
		$userSvc = parent::getSvc('User');
		$userSvc->appendRealName($data['data'],'auditor');
		return $data;
	}
}

?>