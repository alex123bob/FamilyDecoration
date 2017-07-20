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
		$this->appendSelect = ', a.id as auditId, a.name as auditName, a.unit as auditUnit,a.isDeleted as auditDeleted,'
			.' a.price as auditPrice, a.operation as auditOperation, a.professionType as auditProfessionType,'
			.' a.createTime as auditCreateTime, a.creator as auditCreator, u.realname as auditCreatorRealName';
		$this->appendJoin = 'left join supplier_material_audit a on a.materialId = supplier_material.id'
			.' left join user u on u.name = a.creator ';
		$this->appendWhere = " and ( u.isDeleted = 'false' or u.isDeleted is null)";
		$res = parent::get($q);
		foreach ($res['data'] as $key => &$value) {
			if($value['auditDeleted'] === 'true'){
				unset($value['auditId']);
				unset($value['auditUnit']);
				unset($value['auditName']);
				unset($value['auditPrice']);
				unset($value['auditOperation']);
				unset($value['auditProfessionType']);
				unset($value['auditCreateTime']);
				unset($value['auditCreator']);
				unset($value['auditCreatorRealName']);
				unset($value['auditDeleted']);
			}
		}
		return $res;
	}
}

?>