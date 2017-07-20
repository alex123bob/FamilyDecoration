<?php
class SupplierMaterialSvc extends BaseSvc
{
	public function add($q){
		notNullCheck($q,'@name','材料名不能为空!');
		notNullCheck($q,'@professionType','工种不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function get($q){
		$this->appendSelect = ', a.id as auditId, a.name as auditName, a.unit as auditUnit,'
			.' a.price as auditPrice, a.operation as auditOpertaion, a.professionType as auditProfessionType,'
			.' a.createTime as auditCreateTime, a.creator as auditCreator, u.realname as auditCreatorRealName';
		$this->appendJoin = 'left join supplier_material_audit a on a.materialId = supplier_material.id'
			.' left join user u on u.name = a.creator ';
		$this->appendWhere = " and ( a.isDeleted = 'false' or a.isDeleted is null )"
			." and ( u.isDeleted = 'false' or u.isDeleted is null)";
		return parent::get($q);
	}
}

?>