<?php
class AccountSvc extends BaseSvc
{

	public static $ACCOUNT_TYPE = array('CASH'=>'现金','CYBER'=>'网银账户','ALI'=>'支付宝账户','OTHER'=>'其他种类','WECHAT'=>'微信');

	public function del($q){
		global $mysql;
		$q['@isDeleted'] = 'true';
		$q['@updateTime'] = 'now()';
		$mysql->begin();
		$res = parent::update($q);
		parent::getSvc('AccountLog')->add(array('@accountId'=>$q['id'],'@amount'=>0,'@type'=>'del','@desc'=>'删除账户','@balance'=>0,'@refId'=>'-1','@refType'=>'del'));
		$mysql->commit();
		return $res;
	}

	public function add($q){
		global $mysql;
		$q['@id'] = $this->getUUID();
		$mysql->begin();
		$res = parent::add($q);
		parent::getSvc('AccountLog')->add(array('@accountId'=>$q['@id'],'@amount'=>$q['@balance'],'@type'=>'add','@desc'=>'创建账户','@balance'=>$q['@balance'],'@refId'=>'-1','@refType'=>'add'));
		$mysql->commit();
		return $res;
	}

	public function get($q){
		$res = parent::get($q);
		foreach ($res['data'] as &$value) {
			$value['accountType'] = self::$ACCOUNT_TYPE[$value['accountType']];
		}
		return $res;
	}

	public function getAccountType(){
		$res = array();
		foreach (self::$ACCOUNT_TYPE as $key => $value) {
			array_push($res,array('k'=>$key,'v'=>$value));
		}
		return $res;
	}

	public function update($q){
		global $mysql;
		//开始事务
		$mysql->begin();
		//更新记录
		$account = $this->get(array('id'=>$q['id']));
		$account = $account['data'][0];

		$newBalance = ((float)$q['@balance']);
		$cha = $newBalance - (float)$account['balance'];
		$type = 'no';
		if($cha > 0){
			$type = 'in';
		}else if($cha < 0){
			$type = 'out';
			$cha = 0 - $cha;
		}else{
			$type = 'no';
		}
		parent::getSvc('AccountLog')->add(array('@accountId'=>$q['id'],'@amount'=>$cha,'@type'=>$type,'@desc'=>$q['@desc'],'@balance'=>$q['@balance'],'@refId'=>'-1','@refType'=>'edit'));
		$res = parent::update($q);
		$mysql->commit();
		return $res;
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
		$newBalance = (double)$account['balance'] - ((double)$q['@fee']);
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
				$affect = parent::getSvc('StatementBill')->update(array('@paidAmount'=>$q['@fee'],'@status'=>'paid','id'=>$q['id'],'status'=>'chk','@paidTime'=>'now()'))['affect'];
				parent::getSvc('StatementBillAudit')->add(array('@billId'=>$q['id'],'@newStatus'=>'paid','@orignalStatus'=>'chk','@drt'=>1));
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