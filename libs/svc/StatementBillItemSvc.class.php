<?php
class StatementBillItemSvc extends BaseSvc
{
	public function updateAndAddCheck($q){
		if(isset($q['amount']) && !is_numeric($q['amount']))
			throw new Exception('数量必须为数字:'.$q['amount']);
		if(isset($q['unitPrice']) && !is_numeric($q['unitPrice']))
			throw new Exception('单价必须为数字:'.$q['amount']);
		if(!isset($q['amount']))
			$q['amount'] = 0;
		if(!isset($q['unitPrice']))
			$q['unitPrice'] = 0;
		$q['unitPrice'] = round($q['unitPrice'],2);
		$q['amount'] = round($q['amount'],2);
	}

	public function add($q){
		$q['id'] = $this->getUUID();
		notNullCheck($q,'billId');
		$this->updateAndAddCheck($q);
		return parent::add($q);
	}

	public function update($q){
		global $mysql;	
		$this->updateAndAddCheck($q);
		$res = parent::update($q);
		if(isset($q['amount']) || isset($q['unitPrice'])){
			$billItem = $this->get(array('id'=>$q['_id']));
			$billSvc = parent::getSvc('StatementBill');
			$billSvc->syncTotalFee(array('id'=>$billItem['data'][0]['billId']));
		}
		return $res;
	}
	public function get($q){
		$res = parent::get($q);
		$i = 1;
		foreach($res['data'] as &$v){
			$v['referenceNumber'] = $v['referenceItems'] == null || $v['referenceItems'] == "" ? 0 : substr_count($v['referenceItems'],',')+1;
			$v['serialNumber'] = $i++;
			try{
				$v['subtotal'] = $v['amount'] * $v['unitPrice'];
			}catch(Exception $e){

			}
		}
		return $res;
	}
}
?>