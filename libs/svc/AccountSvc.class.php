<?php
class AccountSvc extends BaseSvc
{

	public static $ACCOUNT_TYPE = array('CASH'=>'现金','CYBER'=>'网银账户','ALI'=>'支付宝账户','OTHER'=>'其他种类','WECHAT'=>'微信');

	public function add($qryParams){
		$qryParams['@id'] = $this->getUUID();
		return parent::add($qryParams);
	}

	public function get($q){
		$res = parent::get($q);
		foreach ($res['data'] as &$value) {
			$value['accountType'] = self::$ACCOUNT_TYPE[$value['accountType']];
		}
		return $res;
	}

	public function getAccountType(){
		return $ACCOUNT_TYPE;
	}

	public function pay($q){
		global $mysql;
		$accountId = $q['accountId'];
		//开始事务
		$mysql->begin();
		//上行锁
		$account = $mysql->DBGetAsMap("select * from account where id = '".$accountId."' for update;");
		$account = $account[0];
		//检查余额
		$newBalance = (int)$account['balance'] - ((float)$q['@fee'])*1000;
		if($newBalance < 0)
			throw new Exception("余额不足！");
		$affect = 0;
		//更新单据状态
		switch($q['type']){
			case 'companyBonus':
			case 'qualityGuaranteeDeposit':
			case 'workerSalary':
			case 'materialPayment':
			case 'reimbursementItems':
			case 'tax':
				$affect = parent::getSvc('StatementBill')->update(array('@paidAmount'=>$q['@fee'],'@status'=>'paid','id'=>$q['id'],'status'=>'chk'))['affect'];
				break;
			case 'financialFee':
				$affect = parent::getSvc('loan')->update(array('@amount'=>$q['@fee'],'@status'=>'paid','id'=>$q['id'],'status'=>'!paid'))['affect'];
				break;
			case 'staffSalary':
				$affect = parent::getSvc('salary')->update(array('@paid'=>$q['@fee'],'@status'=>'paid','id'=>$q['id'],'status'=>'chk'))['affect'];
				break;
			//入账 case 'designDeposit': return $this->designDeposit($q);
			//入账 case 'projectFee': return $this->projectFee($q);
			//入账 case 'loan': return $this->loan($q);  //贷款入账
			//入账 case 'other': return $this->other($q);
			default:throw new Exception("unknown type: ".$q['type']);
		}
		if($affect !== 1)
			throw new Exception("没有找到id为".$q['id']."的已审核账单，请确认订单存在并且已通过审核！");

		//更新记录
		parent::getSvc('AccountLog')->add(array('@accountId'=>$accountId,'@amount'=>$q['@fee'],'@type'=>'out','@refId'=>$q['id'],'@refType'=>$q['type'],'@balance'=>$newBalance));
		//更新余额
		$mysql->DBExecute("update account set balance = $newBalance where id = '".$accountId."';");
		
		$mysql->commit();
		return array('status'=>'successful','d'=>$account);
	}
}

?>