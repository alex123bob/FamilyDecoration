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
}

?>