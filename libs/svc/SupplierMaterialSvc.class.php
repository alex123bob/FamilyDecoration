<?php
class SupplierMaterialSvc extends BaseSvc
{
	public function add($q){
		// notNullCheck($q,'@name','材料名不能为空!');
		// notNullCheck($q,'@unit','单位不能为空!');
		// notNullCheck($q,'@price','价格不能为空!');
		// notNullCheck($q,'@professionType','工种不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function get($q){
		$this->appendSelect = ', a.id as auditId, a.name as auditName, a.unit as auditUnit,a.isDeleted as auditDeleted,'
			.' a.price as auditPrice, a.operation as auditOperation, a.professionType as auditProfessionType,'
			.' a.createTime as auditCreateTime, a.creator as auditCreator, u.realname as auditCreatorRealName, a.approved as auditApproved';
		$this->appendJoin = 'left join supplier_material_audit a on a.materialId = supplier_material.id  and ( a.isDeleted = \'false\' or a.isDeleted is null) '
			.' left join user u on u.name = a.creator ';
		$this->appendWhere = " and ( u.isDeleted = 'false' or u.isDeleted is null) ";
		$q['orderby'] = ' auditId desc , supplier_material.id desc ';
		$res = parent::get($q);
		foreach ($res['data'] as $key => &$value) {
			if($value['auditOperation'] === 'add'){
				unset($value['unit']);
				unset($value['name']);
				unset($value['price']);
				unset($value['professionType']);
				unset($value['createTime']);
				unset($value['deleted']);
			}
		}
		return $res;
	}
}

?>