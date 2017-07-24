<?php
class StatementBasicItemSvc extends BaseSvc
{
	public function updateAndAddCheck(&$q){
		if(isset($q['@amount'])){
			if(is_numeric($q['@amount'])){
				$q['@amount'] = round($q['@amount'],3);
			}else{
				throw new Exception('数量必须为数字:'.$q['@amount']);
			}
		}
		if(isset($q['@unitPrice'])){
			if(!is_numeric($q['@unitPrice'])){
				throw new Exception('单价必须为数字:'.$q['@unitPrice']);
			}else{
				$q['@unitPrice'] = round($q['@unitPrice'],3);
			}
		}
	}
	public function add($q){
		$this->updateAndAddCheck($q);
		$q['@id'] = $this->getUUID();
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