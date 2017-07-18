<?php
class SupplierSvc extends BaseSvc
{
	public function add($q){
		notNullCheck($q,'@name','供应商名不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function get($q) {
		global $mysql;
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

?>