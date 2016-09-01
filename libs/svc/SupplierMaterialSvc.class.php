<?php
class SupplierMaterialSvc extends BaseSvc
{
	public function add($q){
		notNullCheck($q,'@name','材料名不能为空!');
		notNullCheck($q,'@professionType','工种不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}
}

?>