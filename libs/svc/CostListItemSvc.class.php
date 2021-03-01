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

	/**
	 * Remove duplicate records
	 */
	public function get($q){
		$res = parent::get($q);
		$data = $res["data"];
		$map = array();
		foreach ($data as $item) {
			$itemId = $item["id"];
			if (
				(isset($map[$itemId]) && intval($item["version"]) > intval($map[$itemId]["version"]))
				|| (!isset($map[$itemId]))
			) {
				$map[$itemId] = $item;
			}
		}
		$res["data"] = array_values($map);
		$res["total"] = count($res["data"]);
		return $res;

	}
	
	public function update($q){
		notNullCheck($q,'id','id不能为空!');
		notNullCheck($q,'version','version不能为空!');
		notNullCheck($q,'@name','名称不能为空!');
		notNullCheck($q,'@unit','单位不能为空!');
		notNullCheck($q,'@professionType','工种不能为空!');
		$q['@version'] = intval($q['version']) + 1;
		$q['@id'] = $q['id'];
		return $this->_get(parent::add($q));
	}
}
