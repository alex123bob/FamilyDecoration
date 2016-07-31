<?php
class AccountLogSvc extends BaseSvc
{

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