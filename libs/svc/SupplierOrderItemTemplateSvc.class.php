<?php
class SupplierOrderItemTemplateSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		if(!isset($q['@templateId']))
			throw new BaseException('模板id不能为空@templateId');
		if(!isset($q['@materialId']))
			throw new BaseException('材料id不能为空@materialId');
		if(!isset($q['@supplierId']))
			throw new BaseException('供应商id不能为空:@supplierId');
		return parent::add($q);
	}

	public function update($q){
		if(isset($q['@templateId']) && trim($q['@templateId']) == '')
			throw new BaseException('模板id不能为空!');
		if(isset($q['@materialId']) && trim($q['@materialId']) == '')
			throw new BaseException('材料id不能为空!');
		return parent::update($q);
	}

	public function get($q){
		$this->appendSelect = ', m.name as billItemName, m.unit, m.price, m.professionType,p.cname as professionTypeName ';
		$this->appendJoin = 'left join supplier_material m on m.id = supplier_order_item_template.materialId '
			.' left join profession_type p on p.value = m.professionType ';
		$this->appendWhere = " and m.isDeleted = 'false' ";
		$res = parent::get($q);
		$sql = 'select s.name,s.id from supplier_order_template t left join supplier s on s.id = t.supplierId where t.id = \'?\'';
		global $mysql;
		$supplier = $mysql->DBGetAsOneArray($sql,$q['templateId']);
		$res['supplierName'] = $supplier[0];
		$res['supplierId'] = $supplier[1];
		return $res;
	}
}

?>