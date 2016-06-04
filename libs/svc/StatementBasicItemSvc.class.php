<?php
class StatementBasicItemSvc extends BaseSvc
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
		$this->updateAndAddCheck($q);
		$q['id'] = $this->getUUID();
		return parent::add($q);
	}
	public function update($q){
		$this->updateAndAddCheck($q);
		return parent::update($q);
	}

	public function get($q){
		$res = parent::get($q);
		$i = 1;
		foreach($res['data'] as &$v){
			$v['referenceNumber'] = $v['referenceItems'] == null || $v['referenceItems'] == "" ? 0 : substr_count($v['referenceItems'],',')+1;
			$v['serialNumber'] = $i++;
		}
		return $res;
	}
}
?>