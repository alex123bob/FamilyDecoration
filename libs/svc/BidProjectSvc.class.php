<?php
class BidProjectSvc extends BaseSvc
{
	public function add($q){
        notNullCheck($q,'@name','投标名称不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
    }
}
?>