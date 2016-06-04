<?php
class StatementBillSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['id'] = $this->getUUID();
		$qryParams['creator'] = $_SESSION['name'];
		return parent::add($qryParams);
	}

	public function get($q){
		$data = parent::get($q);
		$userSvc = parent::getSvc('User');
		$userSvc->appendRealName($data['data'],'checker');
		return $data;
	}

	public function getTotalFee($q){
		notNullCheck($q,'id');
		global $mysql;
		$sql = "select IFNULL(sum(amount*unitPrice),0) as totalFee from statement_bill_item where billId = ? ";
		$res = $mysql->DBGetAsMap($sql,array($q['id']));
		$res[0]['id'] = $q['id'];
		return $res[0];
	}
}
?>