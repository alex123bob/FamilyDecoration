<?php
class AccountSvc extends BaseSvc
{

	public static $ACCOUNT_TYPE = array('CASH'=>'现金','CYBER'=>'网银账户','ALI'=>'支付宝账户','OTHER'=>'其他种类','WECHAT'=>'微信');

	public function add($qryParams){
		$qryParams['@id'] = $this->getUUID();
		return parent::add($qryParams);
	}

	public function getAccountType(){
		return $ACCOUNT_TYPE;
	}

	public function pay($q){
		return array('status'=>'successful');
	}

}

?>