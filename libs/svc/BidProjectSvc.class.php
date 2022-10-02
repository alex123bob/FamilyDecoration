<?php
class BidProjectSvc extends BaseSvc
{
	public function add($q){
        notNullCheck($q,'@name','投标名称不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
    }

	public function get($q){
		if (isset($q['regionId'])) {
			$this->appendWhere = " and bid_project.regionId = '".$q['regionId']."' ";
		}
		$this->appendSelect = ', b.status as billStatus';
		$this->appendJoin = " left join statement_bill b on bid_project.id = b.refId and b.billType = 'bidbond'";
		return parent::get($q);
	}
}
?>