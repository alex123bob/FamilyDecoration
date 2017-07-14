<?php
class SupplierOrderTemplateSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		if(!isset($q['@templateName']))
			throw new BaseException('模板名称必填:@templateName');
		$template = $this->get(array('templateName'=>$q['@templateName']));
		if($template['total'] != 0){
			//throw new BaseException('已存在名为'.$q['@templateName'].'的模板!');
		}
		return parent::add($q);
	}

	public function update($q){
		if(isset($q['@templateName']) && trim($q['@templateName']) == '')
			throw new BaseException('模板名称必填:@templateName');
		return parent::update($q);
	}

	public function template2Order($q){
		if(!isset($q['templateId']))
			throw new BaseException('缺少模板ID:templateId');
		if(!isset($q['@projectId']))
			throw new BaseException('缺少项目ID:@projectId');
		if(!isset($q['@projectId'])){
			//throw new BaseException('缺少申购次数:@payedTimes');
		}
		if(!isset($q['@projectProgress'])){
			//throw new BaseException('缺少工程进度:@projectProgress');
		}
		$template = $this->get(array('id'=>$q['templateId']));
		if($template['total'] == 0){
			throw new BaseException('未找到id为'.$q['templateId'].'的模板!');
		}
		$template = $template['data'][0];
		$supplierOrderSvc = parent::getSvc('SupplierOrder');
		$supplierOrderItemSvc = parent::getSvc('SupplierOrderItem');

		global $mysql;
		$sql = 'select m.*,t.referenceNumber,t.materialId from supplier_order_item_template t left join supplier_material m on t.materialId = m.id ';
		$sql .= 'where t.templateId = \''.$q['templateId'].'\' and t.isDeleted = \'false\' and m.isDeleted = \'false\'';
		$templateItems = $mysql->DBGetAsMap($sql);
		$mysql->begin();
		$order = $supplierOrderSvc->add(array(
			'@supplierId'=>$template['supplierId'],
			'@projectId'=>$q['@projectId'],
			'@payedTimes'=>isset($q['@payedTimes']) ? $q['@payedTimes'] : '',
			'@projectProgress'=>isset($q['@projectProgress']) ? $q['@projectProgress'] : '',
			));
		$order = $order['data'];
		foreach ($templateItems as $key => $item) {
			$supplierOrderItemSvc->add(array(
					'@billId' => $order['id'],
					'@supplierId' => $item['supplierId'],
					'@materialId' => $item['materialId'],
					'@billItemName' => $item['name'],
					'@referenceNumber' => $item['referenceNumber'],
					'@unit' => $item['unit'],
					'@unitPrice' => $item['price'],
					'@professionType' => $item['professionType']
				));
		}
		$mysql->commit();
		return $order;
	}

	public function supplierOrder2template($q){
		if(!isset($q['supplierOrderId']))
			throw new BaseException('缺少订购单ID:supplierOrderId');
		if(!isset($q['@templateName']))
			throw new BaseException('缺少模板名称:@templateName');
		$supplierOrderSvc = parent::getSvc('SupplierOrder');
		$supplierOrderItemSvc = parent::getSvc('SupplierOrderItem');
		$supplierOrderItemTemplateSvc = parent::getSvc('SupplierOrderItemTemplate');
		$supplierOrder = $supplierOrderSvc->get(array('id'=>$q['supplierOrderId']));
		if($supplierOrder['total'] != 1){
			throw new BaseException('没有找到对应ID的订购单! '.$q['supplierOrderId']);
		}
		$supplierOrder = $supplierOrder['data'][0];
		global $mysql;
		$mysql->begin();
		$template = $this->add(array('@templateName'=>$q['@templateName'],'@supplierId'=>$supplierOrder['supplierId']));
		$items = $supplierOrderItemSvc->get(array('billId'=>$q['supplierOrderId']));
		foreach ($items['data'] as $key => $item) {
			$supplierOrderItemTemplateSvc->add(array(
					'@templateId'=>$template['data']['id'],
					'@materialId'=>$item['materialId'],
					'@supplierId'=>$item['supplierId'],
					'@referenceNumber'=>$item['referenceNumber']
				));
		}
		$mysql->commit();
		return $template;
	}
}

?>