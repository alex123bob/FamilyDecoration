<?php
class SupplierOrderItemSvc extends BaseSvc
{
	public function add($q){
		notNullCheck($q,'@billId','单号不能为空:@billId');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function get($q){
		$res = parent::get($q);
		foreach($res['data'] as &$v){
			$v['subtotal'] = round($v['amount']*$v['unitPrice'],3);
		}
		return $res;
	}	
}

?>