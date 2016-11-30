<?php
class AccountLogMonthlyCheckSvc extends BaseSvc
{
	public function add($q){
		$q['@id'] = $this->getUUID();
		notNullCheck($q,'@accountId','账户编号不能为空!');
		notNullCheck($q,'@checkMonth','月份不能为空!');
		notNullCheck($q,'@income','月进账不能为空!');
		notNullCheck($q,'@balance','余额不能为空!');
		notNullCheck($q,'@outcome','月出账额不能为空!');
		return parent::add($q);
	}

	public function update($q){
		$q['@checker'] = $_SESSION['name'];
		return parent::update(array('id'=>$q['id']));
	}

	public function del($q){
		throw new BaseException("不允许删除记录！");
	}
	
	public function get($q){
		global $mysql;
		$startTime = $q['startTime'];
		$endTime = $q['endTime'];
		$accountId = $q['accountId'];
		$numStartTime = (int)date('Ym',strtotime($startTime));
		$numEndTime = (int)date('Ym',strtotime($endTime));
		
		$sql = "select replace(left(createTime,7),'-','') from account where id = '?' and isDeleted = 'false'";
		$accounts = $mysql->DBGetAsOneArray($sql,$accountId);
		if(count($accounts)==0){
			throw new BaseException("找不到id为 $accountId 的账户！");
		}
		$accountCreateTime = (int)$accounts[0];
		if($numEndTime >= (int)(date('Ym'))){
			throw new BaseException('最迟只能看到上个月月账单！');
		}
		if($numStartTime > $numEndTime){
			throw new BaseException('开始时间不能晚于结束时间！');
		}
		if($numEndTime < $accountCreateTime){
			throw new BaseException("此时间段账户还未创建，账户创建时间：$accountCreateTime");
		}
		if($numStartTime < $accountCreateTime)
			$numStartTime = $accountCreateTime;
		
		$sql = "select * from account_log_monthly_check where checkMonth >= '?' and checkMonth <= '?' and accountId = '?' and isDeleted = 'false' order by checkMonth asc ";
		
		$data = $mysql->DBGetAsMap($sql,$numStartTime,$numEndTime,$accountId);
		$dataMapCheckMonthAsKey = array();
		foreach($data as $key=>$value){
			$dataMapCheckMonthAsKey[$value['checkMonth']] = $value;
		}
		$data = array();
		$lastMonthBalance = 0;
		for($i=$numStartTime;$i<=$numEndTime;$i++){
			if(((int)$i%100)>12 || ((int)$i%100)==0)
				continue;
			$value = isset($dataMapCheckMonthAsKey[$i]) ? $dataMapCheckMonthAsKey[$i] : $this->generateMonthData($i,$accountId);
			if($value['income'] == $value['outcome'] && $value['income'] == $value['balance'] && $value['income'] == 0)
				$value['balance'] = $lastMonthBalance;
			array_push($data,$value);
			$lastMonthBalance = $value['balance'];
		}
		return array('status'=>'successful', 'data' => $data);
	}
	
	private function generateMonthData($month,$accountId){
		$sql1 = "select ifnull(sum(amount),0) as income from account_log where type = 'in' and accountId = '?' and replace(left(createTime,7),'-','') = '?' and isDeleted = 'false' ";
		$sql2 = "select ifnull(sum(amount),0) as outcome from account_log where type = 'out' and accountId = '?' and replace(left(createTime,7),'-','') = '?' and isDeleted = 'false' ";
		$sql3 = "select balance from account_log where accountId = '?' and isDeleted = 'false' and replace(left(createTime,7),'-','') = '?' order by createTime desc limit 1 offset 0";
		global $mysql;
		$income = $mysql->DBGetAsOneArray($sql1,$accountId,$month);
		$outcome = $mysql->DBGetAsOneArray($sql2,$accountId,$month);
		$balance = $mysql->DBGetAsOneArray($sql3,$accountId,$month);
		$income = $income[0];
		$outcome = $outcome[0];
		$balance = count($balance) > 0 ? $balance[0] : 0;
		return $this->add(array(
			'@income'=>$income,
			'@outcome'=>$outcome,
			'@balance'=>$balance,
			'@accountId'=>$accountId,
			'@checkMonth'=>$month
		))['data'];
	}
	
	public function markChecked($q){
		
	}
}

?>