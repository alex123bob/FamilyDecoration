<?php
class SupplierSvc extends BaseSvc
{
	public static $TYPES = array('material'=> '材料供应商', 'device'=> '设备供应商');

	public function add($q)
	{
		notNullCheck($q, '@name', '供应商名不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function getSupplierTypes()
	{
		$res = array('status' => 'successful', 'data' => array());

		foreach(self::$TYPES as $key => $value){
			array_push($res['data'], array('value' => $key, 'name' => $value));
		}
		return $res;	
	}

	public function get($q)
	{
		$res = parent::get($q);
		if (isset($_SESSION["supplierId"])) {
			$supplierId = $_SESSION["supplierId"];
			foreach ($res["data"] as $key => $obj) {
				if ($obj["id"] != $supplierId) {
					unset($res["data"][$key]);
				}
			}
			$res["data"] = array_values($res["data"]);
		}
		return $res;
	}
}
