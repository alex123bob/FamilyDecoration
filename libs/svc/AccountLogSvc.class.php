<?php
class AccountLogSvc extends BaseSvc
{

	private static $refType = array(
		'companyBonus'=>'公司福利',
		'qualityGuaranteeDeposit'=>'质保金',
		'workerSalary'=>'工人工资',
		'staffSalary'=>'员工工资',
		'materialPayment'=>'主材订购费',
		'reimbursementItems'=>'报销',
		'tax'=>'税费',
		'designDeposit'=>'设计定金',
		'projectFee'=>'工程款',
		'loan'=>'贷款入账',
		'financialFee'=>'贷款出账',
		'edit'=>'修改账户',
		'add'=>'新增账户',
		'self'=>'转账',
		'other'=>'其他');
	
	public function get($q){
		if(!isset($q['orderby'])){
			$q['orderby'] = 'createTime desc';
		}
		if(isset($q['date'])){
			//20160912 总财务管理需要
			$date = $q['date'].'';
			if($q['scale'] == 'Y'){
				$q['createTimeMin'] = substr($date,0,4).'-01-01 00:00:00';
				$q['createTimeMax'] = substr($date,0,4).'-12-31 59:59:59';
			}else if($q['scale'] == 'M'){
				$q['createTimeMin'] = substr($date,0,4).'-'.substr($date,4,2).'-01 00:00:00';
				$q['createTimeMax'] = substr($date,0,4).'-'.substr($date,4,2).'-31 59:59:59';
			}else{
				$q['createTimeMin'] = substr($date,0,4).'-'.substr($date,4,2).'-'.substr($date,6,2).' 00:00:00';
				$q['createTimeMax'] = substr($date,0,4).'-'.substr($date,4,2).'-'.substr($date,6,2).' 59:59:59';
			}
			
		}
		$res = parent::get($q);
		$svc = BaseSvc::getSvc('User');
		$svc->appendRealName($res['data'],'operator');
		foreach ($res['data'] as &$value) {
			$value['refTypeCn'] = isset(self::$refType[$value['refType']]) ? self::$refType[$value['refType']] : '未知类型';
		}
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
		$q['@operator'] = $_SESSION['name'];
		return parent::add($q);
	}

	public function update($q){
		return parent::update(array('id'=>$q['id'],'@refId'=>$q['@refId']));
	}

	public function del($q){
		throw new BaseException("不允许删除记录！");
	}
}

?>