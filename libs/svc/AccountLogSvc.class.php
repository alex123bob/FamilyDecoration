<?php
class AccountLogSvc extends BaseSvc
{

	public function get($q){
		$res = parent::get($q);
		$svc = BaseSvc::getSvc('User');
		$svc->appendRealName($res['data'],'operator');
		return $res;
	}

	public function add($q){
		$q['@id'] = $this->getUUID();
		notNullCheck($q,'@accountId','账户编号不能为空!');
		notNullCheck($q,'@type','类型不能为空!');
		notNullCheck($q,'@amount','金额不能为空!');
		notNullCheck($q,'@balance','余额不能为空!');
		notNullCheck($q,'@refId','关联单据编号不能为空!');
		notNullCheck($q,'@refType','关联单据类型不能为空!');
		$q['operator'] = $_SESSION['name'];
		return parent::add($q);
	}

	public function update($q){
		throw new Exception("不允许更改记录！");
	}

	public function del($q){
		throw new Exception("不允许删除记录！");
	}
}

?>