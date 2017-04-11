<?php
class StatementBillItemSvc extends BaseSvc
{
	public function updateAndAddCheck(&$q){
		if(isset($q['@amount'])){
			if(is_numeric($q['@amount'])){
				$q['@amount'] = round($q['@amount'],3);
			}else{
				throw new BaseException('数量必须为数字:'.$q['@amount']);
			}
		}
		if(isset($q['@unitPrice'])){
			if(!is_numeric($q['@unitPrice'])){
				throw new BaseException('单价必须为数字:'.$q['@amount']);
			}else{
				$q['@unitPrice'] = round($q['@unitPrice'],3);
			}
		}
		if(!isset($q['@checkedNumber']) || $q['@checkedNumber'] == ''){
			$q['@checkedNumber'] = 0;
		}
	}

	public function add($q){
		$q['@id'] = $this->getUUID();
		notNullCheck($q,'@billId');
		$this->updateAndAddCheck($q);
		return parent::add($q);
	}

	public function update($q){
		global $mysql;	
		$this->updateAndAddCheck($q);
		$res = parent::update($q);
		if(isset($q['@amount']) || isset($q['@unitPrice'])){
			$billItem = $this->get(array('id'=>$q['id']));
			$billSvc = parent::getSvc('StatementBill');
			$billSvc->syncTotalFee(array('id'=>$billItem['data'][0]['billId']));
		}
		return $res;
	}
	public function get($q){
		$res = parent::get($q);
		$i = 1;
		$billItemIds = array();
		foreach($res['data'] as &$v){
			$v['referenceNumber'] = $v['referenceItems'] == null || $v['referenceItems'] == "" ? 0 : substr_count($v['referenceItems'],',')+1;
			$v['serialNumber'] = $i++;
			try{
				$v['subtotal'] = round($v['amount']*$v['unitPrice'],3);
			}catch(Exception $e){

			}
			array_push($billItemIds,$v['id']);
		}
		$billMarkMapping = array();
		if(count($billItemIds) > 0){
			$ids = join($billItemIds,',');
			global $mysql;
			$data = $mysql->DBGetAsMap("select committer,id,content,createTime,refId from statement_bill_item_remark where refId in ($ids) and isDeleted = 'false'; ");
			BaseSvc::getSvc('User')->appendRealName($data,'committer');
			foreach ($data as &$value) {
				$billItemId = $value['refId'];
				if(!isset($billMarkMapping[$billItemId])){
					$billMarkMapping[$billItemId] = array();
				}
				unset($value['refId']);
				array_push($billMarkMapping[$billItemId], $value);
			}
		}
		foreach($res['data'] as &$v){
			$v['remarks'] = isset($billMarkMapping[$v['id']]) ? $billMarkMapping[$v['id']] : array();
		}
		return $res;
	}
}
?>