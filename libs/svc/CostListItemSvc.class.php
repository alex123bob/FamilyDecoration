<?php
class CostListItemSvc extends BaseSvc
{
	public function add($q){
		notNullCheck($q,'@name','名称不能为空!');
		notNullCheck($q,'@unit','单位不能为空!');
		notNullCheck($q,'@professionType','工种不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}
}