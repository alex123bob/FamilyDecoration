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
		$accountLog = parent::getSvc('AccountLog');
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
		//更新记录
		$accountLog->add(array('@accountId'=>$accountId,'@amount'=>$q['@fee'],'@type'=>'out','@refId'=>$q['id'],'@refType'=>$q['type'],'@balance'=>$newBalance));
		//更新余额
		$mysql->DBExecute("update account set balance = $newBalance where id = '".$accountId."';");
		
		$mysql->commit();
		return array('status'=>'successful','d'=>$account);
	}
}

?>