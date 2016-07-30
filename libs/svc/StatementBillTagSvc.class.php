<?php
class StatementBillTagSvc extends BaseSvc
{
	public function add($q){
		throw new Exception("请使用addTag");
	}

	public function addTag($q){
		$q['@id'] = $this->getUUID();
		notNullCheck($q,'@billType','审批单类型不能为空!');
		if(!isset($q['committer'])){
			$q['committer'] = $_SESSION['name'];
		}
		return parent::add($q);
	}

	public function isTagged($q){
		return count($this->get($q)) > 0 ? 1 : 0;
	}

}
?>