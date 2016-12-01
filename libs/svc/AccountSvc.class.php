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

	//返回格式 20160909
	public function getAccountCreateDay($accountId){
		global $mysql;
		$sql = "select replace(left(createTime, 10 ),'-','') from account where id = '?' and isDeleted = 'false'";
		$accounts = $mysql->DBGetAsOneArray($sql,$accountId);
		if(count($accounts)==0){
			throw new BaseException("找不到id为 $accountId 的账户！");
		}
		return (int)$accounts[0];
	}
	
	public function transfer($q){
		$SourceAccountId = $q['from'];
		$TargetAccountId = $q['to'];
		$amount = $q['amount'];
		global $mysql;
		//开始事务
		$mysql->begin();
		//上行锁
		$SourceAccount = $mysql->DBGetAsMap("select * from account where id = '".$SourceAccountId."' for update;");
		$TargetAccount = $mysql->DBGetAsMap("select * from account where id = '".$TargetAccountId."' for update;");
		$SourceAccount = $SourceAccount[0];
		$TargetAccount = $TargetAccount[0];
		//检查余额
		$newSourceBalance = (double)$SourceAccount['balance'] - ((double)$amount);
		$newTargetBalance = (double)$TargetAccount['balance'] - ((double)$amount);
		if($newSourceBalance < 0)
			throw new BaseException("余额不足！");
		$affect = 0;
		//更新记录
		$sourceLog = parent::getSvc('AccountLog')->add(array('@accountId'=>$SourceAccountId,'@amount'=>$amount,'@type'=>'out','@refId'=>'-null-','@refType'=>'self','@balance'=>$newSourceBalance,'@desc'=>'转出到'.$SourceAccount['name']));
		$targetLog = parent::getSvc('AccountLog')->add(array('@accountId'=>$TargetAccountId,'@amount'=>$amount,'@type'=>'in','@refId'=>$sourceLog['data']['id'],'@refType'=>'self','@balance'=>$newTargetBalance,'@desc'=>'从'.$SourceAccount['name'].'转入'));
		parent::getSvc('AccountLog')->update(array('id'=>$sourceLog['data']['id'],'@refId'=>$targetLog['data']['id']));
		//更新余额
		$mysql->DBExecute("update account set balance = $newSourceBalance where id = '".$SourceAccountId."';");
		$mysql->DBExecute("update account set balance = $newTargetBalance where id = '".$TargetAccountId."';");
		$mysql->commit();
		return array('status'=>'successful');
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
		if(!isset($q['orderby'])){
			$q['orderby'] = 'createTime desc';
		}
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

	public function receipt($q){
		global $mysql;
		$mysql->begin();
		switch ($q['@billType']) {
			case 'dsdpst'://设计定金
				$statementBillSvc = parent::getSvc('StatementBill');
				$amount = $q['@receiveAmount'];
				$accountId = $q['@accountId'];
				$bill = $statementBillSvc->add(array(
					'@billType'=>$q['@billType'],
					'@businessId'=>$q['@businessId'],
					'@payer'=>$q['@receiver'],
					'@paidAmount'=>$amount,
					'@paidTime'=>'now()',
					'@status'=>'accepted',
					'@descpt'=>$q['@receiveWay']
				));
				$mysql->DBExecute("update account set balance = balance + $amount where id = '".$accountId."';");
				$account = $mysql->DBGetAsMap("select * from account where id = '".$accountId."';");
				parent::getSvc('AccountLog')->add(array('@accountId'=>$accountId,'@amount'=>$amount,'@type'=>'in','@refId'=>$bill['data']['id'],'@refType'=>'designDeposit','@balance'=>$account[0]['balance']));
				break;
			case 'pjtf':
				$statementBillSvc = parent::getSvc('StatementBill');
				$amount = $q['@receiveAmount'];
				$accountId = $q['@accountId'];
				$bill = $statementBillSvc->add(array(
					'@billType'=>$q['@billType'],
					'@projectId'=>$q['@projectId'],
					'@payer'=>$q['@receiver'],
					'@paidAmount'=>$amount,
					'@paidTime'=>'now()',
					'@reimbursementReason'=>$q['@reimbursementReason'],
					'@status'=>'accepted',
					'@descpt'=>$q['@receiveWay']
				));
				$mysql->DBExecute("update account set balance = balance + $amount where id = '".$accountId."';");
				$account = $mysql->DBGetAsMap("select * from account where id = '".$accountId."';");
				parent::getSvc('AccountLog')->add(array('@accountId'=>$accountId,'@amount'=>$amount,'@type'=>'in','@refId'=>$bill['data']['id'],'@refType'=>'projectFee','@balance'=>$account[0]['balance']));
				break;
			case 'loan':
				$q['@status'] = 'accepted';
				$q['@type'] = '0';
				$q['@amount'] = $q['@receiveAmount'];
				$res = parent::getSvc('Loan')->add($q);
				$amount = $q['@receiveAmount'];
				$accountId = $q['@accountId'];
				$mysql->DBExecute("update account set balance = balance + $amount where id = '".$accountId."';");
				$account = $mysql->DBGetAsMap("select * from account where id = '".$accountId."';");
				parent::getSvc('AccountLog')->add(array('@accountId'=>$accountId,'@amount'=>$amount,'@type'=>'in','@refId'=>$res['data']['id'],'@refType'=>'loan','@balance'=>$account[0]['balance']));
				break;
			case 'other':
				$statementBillSvc = parent::getSvc('StatementBill');
				$amount = $q['@receiveAmount'];
				$accountId = $q['@accountId'];
				$q['@paidTime'] = "now()";
				$q['@status'] = "accepted";
				$q['@paidAmount'] = $amount;
				$q['@payer'] = $_SESSION['name'];
				$bill = $statementBillSvc->add($q);
				$mysql->DBExecute("update account set balance = balance + $amount where id = '".$accountId."';");
				$account = $mysql->DBGetAsMap("select * from account where id = '".$accountId."';");
				parent::getSvc('AccountLog')->add(array('@accountId'=>$accountId,'@amount'=>$amount,'@type'=>'in','@refId'=>$bill['data']['id'],'@refType'=>'projectFee','@balance'=>$account[0]['balance']));
				break;
			default:
				# code...
				break;
		}
		$mysql->commit();
		return array('status'=>'successful');
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
			throw new BaseException("余额不足！");
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
				$affect = parent::getSvc('salary')->update(array('@amount'=>$q['@fee'],'@status'=>'paid','id'=>$q['id'],'status'=>'chk'))['affect'];
				break;
			//入账 case 'designDeposit': return $this->designDeposit($q);
			//入账 case 'projectFee': return $this->projectFee($q);
			//入账 case 'loan': return $this->loan($q);  //贷款入账
			//入账 case 'other': return $this->other($q);
			default:throw new Exception("unknown type: ".$q['type']);
		}
		if($affect !== 1)
			throw new BaseException("没有找到id为".$q['id']."的已审核账单，请确认订单存在并且已通过审核！");

		//更新记录
		parent::getSvc('AccountLog')->add(array('@accountId'=>$accountId,'@amount'=>$q['@fee'],'@type'=>'out','@refId'=>$q['id'],'@refType'=>$q['type'],'@balance'=>$newBalance));
		//更新余额
		$mysql->DBExecute("update account set balance = $newBalance where id = '".$accountId."';");
		
		$mysql->commit();
		return array('status'=>'successful','d'=>$account);
	}
	
	//财务分析--收入分析
	function incomeAnalysis($q){
		global $mysql;
		//工程款//设计定金
		$sql = "select sum(paidAmount) as amount,billType from statement_bill where billType in ('pjtf','dsdpst','other') and isDeleted = 'false' and createTime >= '?' and createTime <= '?' group by billType;";
		$types = array('pjtf'=>'工程款','dsdpst'=>'设计定金','other'=>'其他','gov'=>'政府补贴','longterminvt'=>'长期投资','shortterminvt'=>'短期投资');
		$data = $mysql->DBGetAsMap($sql,$q['startTime'],$q['endTime']);
		$gotTypes = '/';
		$total = 0;
		foreach($data as &$item){
			$gotTypes .= $item['billType'].'/';
			$item['billType'] = $types[$item['billType']];
			$total += $item['amount'];
		}
		foreach($types as $type => $typeCN){
			if(!contains($gotTypes,'/'.$type.'/'))
				array_push($data,array('amount'=>0,'billType'=>$typeCN));	
		}
		if(isset($q['total']) && $q['total'] == 'true')
			array_push($data,array('amount'=>0,'billType'=>'总收入'));
		return $data; 
	}
	
	//财务分析--内部支出分析
	function corpOutcomeAnalysis($q){
		global $mysql;
		$sql = "select sum(paidAmount) as amount,billType from statement_bill where billType in ('pjtf','dsdpst','other') and isDeleted = 'false' group by billType;";
		$types = array('pjtf'=>'工程款','dsdpst'=>'设计定金','other'=>'其他','gov'=>'政府补贴','longterminvt'=>'长期投资','shortterminvt'=>'短期投资');
		$data = $mysql->DBGetAsMap($sql);
		$gotTypes = '/';
		foreach($data as &$item){
			$gotTypes .= $item['billType'].'/';
			$item['billType'] = $types[$item['billType']];
		}
		foreach($types as $type => $typeCN){
			if(!contains($gotTypes,'/'.$type.'/'))
				array_push($data,array('amount'=>0,'billType'=>$typeCN));
		}
		return $data; 
	}
}

?>