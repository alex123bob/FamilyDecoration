<?php
class StatementBillItemSvc extends BaseSvc
{
	public function add($q){
		$q['id'] = $this->getUUID();
		notNullCheck($q['billId'],"bill id can not be empty !;");
		$count = parent::getCount(array('billId'=>$q['billId']));
		$q['serialNumber'] = $count['count'] + 1;
		return parent::add($q);
	}
	public function update($q){
		global $mysql;
		notNullCheck($q['_id'],"id can not be empty !;");
		notNullCheck($q['_billId'],"bill id can not be empty !;");
		$data = parent::get(array('id'=>$q['id']));
		return parent::update(array());
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