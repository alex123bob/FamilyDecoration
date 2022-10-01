<?php
class BidProjectRegionSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		return parent::add($q);
    }
}
?>