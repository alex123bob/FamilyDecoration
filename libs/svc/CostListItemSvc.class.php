<?php
class CostListItemSvc extends BaseSvc
{
	public function add($q)
	{
		notNullCheck($q, '@name', '名称不能为空!');
		notNullCheck($q, '@isLabour', 'isLabour不能为空!');
		notNullCheck($q, '@unit', '单位不能为空!');
		notNullCheck($q, '@professionType', '工种不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function parentGet($q)
	{
		return parent::get($q);
	}
	/**
	 * Remove duplicate records
	 */
	public function get($q)
	{
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

	public function update($q)
	{
		notNullCheck($q, 'id', 'id不能为空!');
		notNullCheck($q, 'version', 'version不能为空!');
		notNullCheck($q, '@name', '名称不能为空!');
		notNullCheck($q, '@unit', '单位不能为空!');
		notNullCheck($q, '@isLabour', 'isLabour不能为空!');
		notNullCheck($q, '@professionType', '工种不能为空!');
		$q['@version'] = intval($q['version']) + 1;
		$q['@id'] = $q['id'];


		$res = $this->get(array('id' => $q['id']));
		if ($res['total'] == 0) {
			throw new Exception('找不到id为' . $q['id'] . '的基础小项。');
		}
		$oldData = $res['data'][0];
		if ($res['total'] == 1 && $oldData['version'] != $q['version']) {
			throw new Exception('数据不同步，请刷新后尝试。(version should be ' . $oldData['version'] . ' but get ' . $q['version'] . ')');
		}

		if (
			$q['@name'] == $oldData['name']
			&& $q['@unit'] == $oldData['unit']
			&& $q['@isLabour'] == $oldData['isLabour']
			&& $q['@professionType'] == $oldData['professionType']
			&& $q['@remark'] == $oldData['remark']
		) {
			//throw new Exception('没有修改。');
			return $res;
		}

		return parent::add($q);
	}
}
