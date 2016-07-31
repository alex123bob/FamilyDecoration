<?php

class EntryNExitSvc{
	
	//loan:贷款入账(loan表),financialFee:财务费用(贷款还账,loan表),staffSalary:员工工资(salary表)
	//其他都是statement_bill 表
	public function get($q){
		//$pageNumber 
		switch($q['type']){
			case 'companyBonus': return $this->companyBonus($q);
			case 'qualityGuaranteeDeposit': return $this->qualityGuaranteeDeposit($q);
			case 'workerSalary': return $this->workerSalary($q);
			case 'staffSalary': return $this->staffSalary($q);
			case 'materialPayment': return $this->materialPayment($q);
			case 'reimbursementItems': return $this->reimbursementItems($q);
			case 'tax': return $this->tax($q);
			case 'designDeposit': return $this->designDeposit($q);
			case 'projectFee': return $this->projectFee($q);
			case 'loan': return $this->loan($q);  //贷款入账
			case 'financialFee': return $this->financialFee($q); //贷款出账
			case 'other': return $this->other($q);
			default:throw new Exception("unknown type: ".$q['type']);
		}
	}

	public function getpayheader($q){
		$i = rand(1,10);
		$res = array();
		for($a = 0;$a<$i;$a++){
			array_push($res, array('k'=>'xxx','v'=>'123'));
		}
		return $res;
	}
	public function pay($q){

	}

	private function companyBonus($q){
		global $mysql;
		$sql = "select b.id as c0,
					b.projectName as c1,
					b.reimbursementReason as c2,
					b.payee as c2,
					b.phoneNumber as c3,
					b.totalFee as c4,
					b.paidAmount as c5,
					u.realName as c6,
					b.paidTime as c7,
					b.descpt as c8,
					b.status
					from statement_bill b left join user u on u.name = b.payer
					where b.billType = 'wlf' and b.isDeleted = 'false' and ( b.status = 'paid' or b.status = 'chk');";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}

	private function tax($q){
		global $mysql;
		$sql = "select b.id as c0,
					b.projectName as c1,
					b.reimbursementReason as c2,
					b.payee as c3,
					b.payee as c4,
					b.phoneNumber as c5,
					b.totalFee as c6,
					b.paidAmount as c7,
					u.realName as c8,
					b.paidTime as c9,
					b.descpt as c10,
					b.status
					from statement_bill b left join user u on u.name = b.payer
					where b.billType = 'tax' and b.isDeleted = 'false' and ( b.status = 'paid' or b.status = 'chk');";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}



	private function qualityGuaranteeDeposit($q){
		global $mysql;
		$sql = "select b.id as c0,
					b.projectName as c1,
					b.reimbursementReason as c2,
					b.payee as c3,
					b.payee as c4,
					b.phoneNumber as c5,
					b.totalFee as c6,
					b.paidAmount as c7,
					u.realName as c8,
					b.paidTime as c9,
					b.descpt as c10,
					b.status
					from statement_bill b left join user u on u.name = b.payer
					where b.billType = 'qgd' and b.isDeleted = 'false' and ( b.status = 'paid' or b.status = 'chk');";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}

	private function workerSalary($q){
		global $mysql;
		$sql = "select b.id as c0,
					payee as c1,
					phoneNumber as c2,
					projectName as c3,
					t.cname as c4,
					totalFee as c5,
					claimAmount as c6,
					paidAmount as c7,
					claimAmount-paidAmount as c8,
					'TODO' as c9,
					paidTime as c10,
					b.status,
					payer as c11 from statement_bill b left join profession_type t on b.professionType = t.value
					where b.isDeleted = 'false' and (b.billType = 'reg' or b.billType = 'ppd') and ( b.status = 'paid' or b.status = 'chk');";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}

	private function staffSalary($q){
		global $mysql;
		$sql = "select s.id as c0,
					u.level as c1,
					u.realName as c2,
					s.basicSalary as c3,
					s.positionSalary as c4,
					s.meritSalary as c5,
					s.socialTax as c6,
					s.balance as c7,
					s.paid as c8,
					'TODO' as c9,
					s.paidTime as c10,
					u2.realName as c11
					from salary s left join user u on u.name = s.user left join user u2 on u2.name = s.payee where s.isDeleted = 'false';";
		$data = $mysql->DBGetAsMap($sql);
		$userSvc = BaseSvc::getSvc('User');
		foreach ($data as &$item) {
			$item['c1'] = $userSvc->getDepartementByLevel($item['c1']);
		}
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}

	private function materialPayment($q){
		global $mysql;
		$sql = "select b.id as c0,
					s.name as c1,
					b.projectName as c2,
					b.payee as c4,
					b.phoneNumber as c3,
					b.reimbursementReason as c5,
					b.totalFee as c6,
					b.claimAmount as c7,
					b.paidAmount as c8,
					b.claimAmount-b.paidAmount as c9,
					'TODO' as c10,
					b.paidTime as c11,
					u.realName as c12 
					from statement_bill b left join supplier s on b.supplierId = s.id 
					left join user u on u.name = b.payer where b.billType = 'mtf' and b.isDeleted = 'false' and ( b.status = 'paid' or b.status = 'chk');";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}

	private function reimbursementItems($q){
		global $mysql;
		$sql = "select b.id as c0,
					b.payee as c1,
					b.reimbursementReason as c2,
					b.phoneNumber as c3,
					b.totalFee as c4,
					b.paidAmount as c5,
					'TODO' as c6,
					b.paidTime as c7,
					u.realName as c8,
					'TODO' as c9 
					from statement_bill b left join user u on u.name = b.payer 
					where b.billType = 'rbm' and b.isDeleted = 'false' and  ( b.status = 'paid' or b.status = 'chk');";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}
	//贷款出账
	private function financialFee($q){
		global $mysql;
		$sql = "select l.id as c0,
					l.id as c1,
					l2.projectName as c2,
					l.bankName as c3,
					u.realName as c4,
					l.interest as c5,
					l.projectName as c6,
					l.amount as c7,
					u2.realName as c8,
					l.createTime as c9,
					l.status
					from loan l 
					left join user u on u.name = l.assignee 
					left join user u2 on u2.name = l.dealer
					left join loan l2 on l2.id = l.relevantId
 					where l.isDeleted = 'false' and l.type = '1' and l.status = 'paid';";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}
 	//贷款入账
	private function loan($q){
		global $mysql;
		$sql = "select l.id as c0,
					l.projectName as c1,
					l.bankName as c2,
					u.realName as c3,
					u.phone as c4,
					l.amount as c5,
					u2.realName as c6,
					l.dealTime as c7,
					l.interest as c8,
					l.period as c9 ,
					l.loanTime as c10 
					from loan l left join user u on u.name = l.assignee left join user u2 on u2.name = l.dealer
 					where l.isDeleted = 'false' and l.type = '0' and l.status = 'accepted';";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}
	//设计定金入账
	private function designDeposit($q){
		global $mysql;
		$sql = "select b.id as c0,
					b.projectName as c1,
					p.salesman as c2,
					p.designer as c3,
					bs.customer as c4,
					bs.custContact as c5,
					b.paidAmount as c6,
					b.payer as c7
					from statement_bill b left join user u on u.name = b.payer left join project p on p.projectId = b.projectId left join business bs on bs.id = p.businessId
					where b.billType = 'dsdpst' and b.isDeleted = 'false' and  b.status = 'accepted';";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}
 	//其他入账
 	private function other($q){
		global $mysql;
		$sql = "select b.id as c0,
					b.projectName as c1,
					b.reimbursementReason as c2,
					b.payee as c2,
					b.phoneNumber as c3,
					b.totalFee as c4,
					b.paidAmount as c5,
					u.realName as c6,
					b.paidTime as c7,
					b.descpt as c8,
					b.status
					from statement_bill b left join user u on u.name = b.payer
					where b.billType = 'other' and b.isDeleted = 'false' and b.status = 'accepted';";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}
	//工程款入账
	private function projectFee($q){
		global $mysql;
		$sql = "select b.id as c0,
					b.projectName as c1,
					p.captain as c2,
					p.designer as c3,
					bs.customer as c4,
					bs.custContact as c5,
					b.totalFee as c6,
					b.paidAmount as c7,
					b.paidTime as c9,
					b.reimbursementReason as c8
					from statement_bill b left join user u on u.name = b.payer left join project p on p.projectId = b.projectId left join business bs on bs.id = p.businessId
					where b.billType = 'pjtf' and b.isDeleted = 'false' and b.status = 'accepted';";
		$data = $mysql->DBGetAsMap($sql);
		return array('status'=>'successful','data'=>$data,'total'=>100);
	}
}

?>