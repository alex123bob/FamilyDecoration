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
	
	public function update($q){
		notNullCheck($q,'id','id不能为空!');
		notNullCheck($q,'version','version不能为空!');
		notNullCheck($q,'@name','名称不能为空!');
		notNullCheck($q,'@unit','单位不能为空!');
		notNullCheck($q,'@professionType','工种不能为空!');
		$q['@version'] = intval($q['version']) + 1;
		$q['@id'] = intval($q['id']);
		return parent::add($q);
	}
}
