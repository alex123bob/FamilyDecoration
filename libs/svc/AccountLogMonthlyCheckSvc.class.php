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
		$q['@checker'] = $_SESSION['realname'];
		$q['@checkername'] = $_SESSION['name'];
		return parent::update($q);
	}

	public function del($q){
		throw new BaseException("不允许删除记录！");
	}
	
	private function generateTimeSpan($startTime,$endTime,$scale,$accountId,$accountCreateDay){
		$days = array();
		if($startTime > $endTime){
			throw new BaseException('开始时间不能晚于结束时间！');
		}
		if($accountCreateDay > $endTime){
			throw new BaseException("此时间段账户还未创建，账户创建时间：$accountCreateDay");
		}
		$startTime = $startTime < $accountCreateDay ? $accountCreateDay : $startTime;
		$timeFormat = self::$SCALE_TIMEFORMAT[$scale];
		for($i = strtotime($startTime); $i <= strtotime($endTime); $i += 86400){
			if(!in_array(date($timeFormat,$i),$days)){
				array_push($days,date($timeFormat,$i));
			}
		}
		return $days;
	}
	
	private function getAccountLastBalance($accountId,$startTime,$accountCreateDay){
		global $mysql;
		$sql = "select balance from account_log where replace(left(createTime,10),'-','') < '?' and accountId = '?' order by createTime desc limit 1 offset 0;";
		$accounts = $mysql->DBGetAsOneArray($sql,$startTime,$accountId);
		if(count($accounts)==0){
			return 0;
		}
		return (int)$accounts[0];
		
	}
	
	private static $SCALE_TYPE = array('Y'=>0,'M'=>1,'D'=>2);
	private static $SCALE_TIMEFORMAT = array('Y'=>'Y','M'=>'Ym','D'=>'Ymd');
	private static $SCALE_FOR_LEFT = array('Y'=>4,'M'=>7,'D'=>10);
	private static $SCALE_LAST_WARNING = array('Y'=>'上一年','M'=>'上个月','D'=>'昨天');
	
	public function get($q){
		global $mysql;
		$startTime = $q['startTime'];
		$endTime = $q['endTime'];
		$accountId = $q['accountId'];
		$scale = $q['scale'];
		$accountCreateDay = $this->getSvc('Account')->getAccountCreateDay($accountId);   //format 20160908
		$days = $this->generateTimeSpan($startTime,$endTime,$scale,$accountId,$accountCreateDay);

		if($scale == 'Y'){
			$startTime = substr($startTime,0,4);
			$endTime = substr($endTime,0,4);
		}else if($scale == 'M'){			
			$startTime = substr($startTime,0,6);
			$endTime = substr($endTime,0,6);
		}
		if($endTime >= (int)(date(self::$SCALE_TIMEFORMAT[$scale]))){
			throw new BaseException('最迟只能审核上'.self::$SCALE_LAST_WARNING[$scale].'账单！');
		}
		
		$sql = "select * from account_log_monthly_check where checkMonth >= '?' and checkMonth <= '?' and accountId = '?' and scale = '?' and isDeleted = 'false' order by checkMonth asc ";
		$data = $mysql->DBGetAsMap($sql,$startTime,$endTime,$accountId,self::$SCALE_TYPE[$scale]);
		$dataMapCheckMonthAsKey = array();
		foreach($data as $key=>$value){
			$dataMapCheckMonthAsKey[$value['checkMonth']] = $value;
		}
		$data = array();
		$lastBalance = 'null';
		foreach($days as $key => $day){
			$value = isset($dataMapCheckMonthAsKey[$day]) ? $dataMapCheckMonthAsKey[$day] : $this->generateMonthData($day,$accountId,$scale);
			if($value['income'] == $value['outcome'] && $value['income'] == $value['balance'] && $value['income'] == 0)
				$value['balance'] = $lastBalance == 'null' ? $this->getAccountLastBalance($accountId,$q['startTime'],$accountCreateDay) : $lastBalance;
			array_push($data,$value);
			$lastBalance = $value['balance'];
		}
		return array('status'=>'successful', 'data' => $data);
	}
	
	private function generateMonthData($month,$accountId,$scale){
		$left = self::$SCALE_FOR_LEFT[$scale];
		$sql1 = "select ifnull(sum(amount),0) as income from account_log where type = 'in' and accountId = '?' and replace(left(createTime,$left),'-','') = '?' and isDeleted = 'false' ";
		$sql2 = "select ifnull(sum(amount),0) as outcome from account_log where type = 'out' and accountId = '?' and replace(left(createTime,$left),'-','') = '?' and isDeleted = 'false' ";
		$sql3 = "select balance from account_log where accountId = '?' and isDeleted = 'false' and replace(left(createTime,$left),'-','') = '?' order by createTime desc limit 1 offset 0";
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
			'@status'=>'unchecked',
			'@balance'=>$balance,
			'@scale'=>self::$SCALE_TYPE[$scale],
			'@accountId'=>$accountId,
			'@checkMonth'=>$month
		))['data'];
	}
	
	public function markChecked($q){
		
	}
}

?>