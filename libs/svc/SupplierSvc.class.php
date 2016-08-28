<?php
class SupplierSvc extends BaseSvc
{
	public function add($q){
		notNullCheck($q,'@name','供应商名不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}
}

?>