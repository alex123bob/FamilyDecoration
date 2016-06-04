<?php
class StatementBillItemSvc extends BaseSvc
{
	public function add($q){
		$q['id'] = $this->getUUID();
		notNullCheck($q,'billId');
		$count = parent::getCount(array('billId'=>$q['billId']));
		$q['serialNumber'] = $count['count'] + 1;
		if(isset($q['amount']) && !is_numeric($q['amount']))
			throw new Exception('amount must be number type:'.$q['amount']);
		if(isset($q['unitPrice']) && !is_numeric($q['unitPrice']))
			throw new Exception('amount must be number type:'.$q['amount']);
		return parent::add($q);
	}
	public function update($q){
		global $mysql;	
		if(isset($q['amount']) && !is_numeric($q['amount']))
			throw new Exception('amount must be number type:'.$q['amount']);
		if(isset($q['unitPrice']) && !is_numeric($q['unitPrice']))
			throw new Exception('amount must be number type:'.$q['amount']);
		return parent::update($q);
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