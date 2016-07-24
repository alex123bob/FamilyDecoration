<?php

class EntryNExitSvc{
	
	public function get($q){
		switch($q['type']){
			case 'financialFee': return $this->financialFee($q);
			case 'companyBonus': return $this->companyBonus($q);
			case 'qualityGuaranteeDeposit': return $this->qualityGuaranteeDeposit($q);
			case 'workerSalary': return $this->workerSalary($q);
			case 'staffSalary': return $this->staffSalary($q);
			case 'materialPayment': return $this->materialPayment($q);
			case 'reimbursementItems': return $this->reimbursementItems($q);
			case 'tax': return $this->tax($q);
			case 'designDeposit': return $this->designDeposit($q);
			case 'projectFee': return $this->projectFee($q);
			case 'loan': return $this->loan($q);
			case 'other': return $this->other($q);
			default:throw new Exception("unknown type: ".$q['type']);
		}
	}

	private function financialFee($q){
		return array();
	}

	private function companyBonus($q){
		return array();
	}

	private function tax($q){
		return array();
	}

	private function qualityGuaranteeDeposit($q){
		global $mysql;
		$sql = 'select b.id as c0,'.
					'\'TODO\' as c1,'.
					'\'TODO\' as c2,'.
					'b.reimbursementReason as c2,'.
					'b.phoneNumber as c3,'.
					'b.totalFee as c4,'.
					'b.paidAmount as c5,'.
					'\'TODO\' as c6,'.
					'b.paidTime as c7,'.
					'u.realName as c8,'.
					'\'TODO\' as c9 '.
					'from statement_bill b left join user u on u.name = b.payer '.
					'where b.billType = \'fdf\' and b.isDeleted = \'false\' and b.isPaid = \'true\';';
		$data = $mysql->DBGetAsMap($sql);
		return $data;
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
					'TODO' as c8,
					'TODO' as c9,
					paidTime as c10,
					payer as c11 from statement_bill b left join profession_type t on b.professionType = t.value where b.isDeleted = 'false' and b.isPaid = 'true';";
		return $mysql->DBGetAsMap($sql);
	}

	private function staffSalary($q){
		global $mysql;
		$sql = 'select s.id as c0,'.
					'u.level as c1,'.
					'u.realName as c2,'.
					's.basicSalary as c3,'.
					's.positionSalary as c4,'.
					's.meritSalary as c5,'.
					's.socialTax as c6,'.
					's.balance as c7,'.
					's.paid as c8,'.
					'\'TODO\' as c9,'.
					's.paidTime as c10,'.
					'u2.realName as c11 '.
					'from salary s left join user u on u.name = s.user left join user u2 on u2.name = s.payee where s.isDeleted = \'false\';';
		$data = $mysql->DBGetAsMap($sql);
		$userSvc = BaseSvc::getSvc('User');
		foreach ($data as &$item) {
			$item['c1'] = $userSvc->getDepartementByLevel($item['c1']);
		}
		return $data;		
	}

	private function materialPayment($q){
		global $mysql;
		$sql = 'select b.id as c0,'.
					's.name as c1,'.
					'b.projectName as c2,'.
					'b.payee as c4,'.
					'b.phoneNumber as c3,'.
					'\'xxx\' as c5,'.
					'b.totalFee as c6,'.
					'b.claimAmount as c7,'.
					'b.paidAmount as c8,'.
					'\'TODO\' as c9,'.
					'\'TODO\' as c10,'.
					'b.paidTime as c11,'.
					'u.realName as c12 '.
					'from statement_bill b left join supplier s on b.supplierId = s.id '.
					'left join user u on u.name = b.payer where b.billType = \'mtf\' and b.isDeleted = \'false\' and b.isPaid = \'true\';';
		$data = $mysql->DBGetAsMap($sql);
		return $data;
	}

	private function reimbursementItems($q){
		global $mysql;
		$sql = 'select b.id as c0,'.
					'b.payee as c1,'.
					'b.reimbursementReason as c2,'.
					'b.phoneNumber as c3,'.
					'b.totalFee as c4,'.
					'b.paidAmount as c5,'.
					'\'TODO\' as c6,'.
					'b.paidTime as c7,'.
					'u.realName as c8,'.
					'\'TODO\' as c9 '.
					'from statement_bill b left join user u on u.name = b.payer '.
					'where b.billType = \'rbm\' and b.isDeleted = \'false\' and b.isPaid = \'true\';';
		$data = $mysql->DBGetAsMap($sql);
		return $data;
	}

	private function designDeposit($q){
		return array();
	}

	private function projectFee($q){
		return array();
	}

	private function loan($q){
		return array();
	}

	private function other($q){
		return array();
	}

}

?>