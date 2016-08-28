<?php
class LogListSvc extends BaseSvc
{
	public function getMonths(){
		$date1 = new DateTime('now');
		$date2 = new DateTime('now - 1month');
		$date3 = new DateTime('now - 2month');
		return array(
			array('y'=>$date1->format('Y'),'m'=>$date1->format('m'),'f'=>0),
			array('y'=>$date2->format('Y'),'m'=>$date2->format('m'),'f'=>0),
			array('y'=>$date3->format('Y'),'m'=>$date3->format('m'),'f'=>0)
		);
	}

	public function get($q){
		$begin = $q['day'].' 00:00:00';
		$end = $q['day'].' 23:59:59';
		$q['orderby'] = 'createTime asc';
		$this->appendWhere = " and (createTime >= '$begin' and createTime <= '$end' or  ( createTime < '$begin' and isFinished != '1' )) ";
		$res = parent::get($q);
		foreach ($res['data'] as &$item) {
			unset($item['updateTime']);
			unset($item['isDeleted']);
			$item['editable'] = $item['createTime'] < $begin ? 0 : 1;
		}
		return $res; 
	}
	
	public function add($q){
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function getOldMonths(){
		$end = new DateTime('now - 2month');
		$endY = $end->format('Y');
		$endM = $end->format('m');
		$res = array();
		for ($y = 2015 ; $y < $endY ; $y++)
			for ($m = 1 ; $m < 13 ; $m++)
				array_push($res, array('y'=>$y,'m'=>$m < 10 ? '0'.$m : $m));
		for ($m = 1 ; $m < $endM ; $m++)
			array_push($res, array('y'=>$endY,'m'=>$m < 10 ? '0'.$m : $m));
		return $res;
	}

	private function getIndicatorDesign($user,$year,$month){
		global $mysql;
		if(strlen($month) == 1) 
			$month = '0'.$month;
		$sql = "select count(1) from business where designerName = '?' and left(signTime,7) = '?'"; 
		$signedBusinessData = $mysql->DBGetAsOneArray($sql,$user,"$year-$month");
		return array(
			'signedBusinessNumber'=>(int)$signedBusinessData[0],
			'depositRate'=>(int)$signedBusinessData[0]
		);
	}
	private function getIndicatorMarket($user,$year,$month,$byMonth=false){
		global $mysql;
		if(strlen($month) == 1) 
			$month = '0'.$month;
		$ym = '\''.$year.'-'.$month.'\'';

		$sql = "select d,count(1) as num from (
					select left(createTime,10) as d , potentialBusinessId  from potential_business_detail b 
					where committer = '?' and left(createTime,7) = $ym group by potentialBusinessId,left(createTime,10) 
				) as temp group by d";
		if($byMonth) $sql = "select sum(num) as sum from ( $sql ) as temp";
		$telemarketingData = $mysql->DBGetAsMap($sql,$user);

		$sql = "select left(levelTime,10) as d,count(1) as num from business b 
				where level = 'B' and salesmanName = '?' and left(levelTime,7) = $ym group by left(levelTime,10) ";
		if($byMonth) $sql = "select sum(num) as sum  from ( $sql ) as temp";
		$companyVisitData = $mysql->DBGetAsMap($sql,$user);

		$sql = "select left(levelTime,10) as d,count(1) as num from business b 
				where level = 'A' and salesmanName = '?' and left(levelTime,7) = $ym group by left(levelTime,10) ";
		if($byMonth) $sql = "select sum(num) as sum  from ( $sql ) as temp";
		$depositData = $mysql->DBGetAsMap($sql,$user);

		$sql = "select left(createTime,10) as d,count(1) as num  from potential_business b 
				where salesmanName = '?' and left(createTime,7) = $ym group by left(createTime,10) ";
		if($byMonth) $sql = "select sum(num) as sum  from ( $sql ) as temp";
		$buildingSwipingData = $mysql->DBGetAsMap($sql,$user);

		return $byMonth ? array(
			'telemarketing'=>(int)$telemarketingData[0]['sum'],
			'companyVisit'=>(int)$companyVisitData[0]['sum'],
			'deposit'=>(int)$depositData[0]['sum'],
			'buildingSwiping'=>(int)$buildingSwipingData[0]['sum']
		): array(
			'telemarketing'=>$telemarketingData,
			'companyVisit'=>$companyVisitData,
			'deposit'=>$depositData,
			'buildingSwiping'=>$buildingSwipingData
		);
	}

	public function getDetail($q){
		global $mysql;
		$month = $q['month'];
		$year = $q['year'];
		$user = $q['name'];
		if(strlen($month) == 1) 
			$month = '0'.$month;
		$mode = isset($q['mode']) ? $q['mode'] : "none";  // market , design
		$telemarketingDayNumberMappping = array();
		$buildingSwipingDayNumberMappping = array();
		$plan = array('buildingSwiping'=>array(),'buildingSwiping'=>array());
		if($mode == "market"){
			$data = $this->getIndicatorMarket($user,$year,$month,false);
			$days = date('t', strtotime("$year-$month"));//cal_days_in_month(CAL_GREGORIAN, $month, $year);
			$temp = $mysql->DBGetAsMap("select c1 as buildingSwiping,c2 as telemarketing from business_goal where targetMonth = '?' and user = '?' ","$year-$month",$user);
			if(count($temp) > 0){
				$planBwip = (int)$temp[0]['buildingSwiping'];
				$planTele = (int)$temp[0]['telemarketing'];
				$planBwipEveryDay = (int)($planBwip/$days);
				$planTeleEveryDay = (int)($planTele/$days);
				$planBwipLeft = $planBwip%$days;
				$planTeleLeft = $planTele%$days;
				for($i = 1;$i <= $days ;$i++){
					$date = "$year-$month-".($i < 10 ? '0':'').$i;
					$plan['buildingSwiping'][$date] = $planBwipEveryDay + ($i <= $planBwipLeft ? 1 : 0);
					$plan['telemarketing'][$date] = $planTeleEveryDay + ($i <= $planTeleLeft ? 1 : 0);
				}
			}
			foreach ($data['buildingSwiping'] as $item) {
				$buildingSwipingDayNumberMappping[$item['d']] = $item['num'];
			}
			foreach ($data['telemarketing'] as $item) {
				$telemarketingDayNumberMappping[$item['d']] = $item['num'];
			}
		}
		$time = strtotime("$year-$month-01");
		$days = "$year-$month" == date('Y-m') ? date('d') : date('t', $time); //this month , end to today
		$beginTime = "$year-$month-01 00:00:00";
		$endTime = "$year-$month-$days 00:00:00";
		$logsDayNumberMapping = array();
		$sumlogsDayNumberMapping = array();
		$comlogsDayNumberMapping = array();
		$sql = "select id,evaluator,left(createTime,10) as day,isFinished,content,logType from log_list where createTime >= '?' and createTime <= '?' and committer = '?' and isDeleted = 'false' ";
		$logs = $mysql->DBGetAsMap($sql,$beginTime,$endTime,$user);
		foreach ($logs as $value) {
			if((int)$value['logType'] == 1){
				$sumlogsDayNumberMapping[$value['day']] = $value;
			}else if((int)$value['logType'] == 2){
				$comlogsDayNumberMapping[$value['day']] = $value;
			}else{
				if(!isset($logsDayNumberMapping[$value['day']])){
					$logsDayNumberMapping[$value['day']] = array();
				}
				array_push($logsDayNumberMapping[$value['day']], $value);
			}
		}
		$res = array();
		for($i = $days;$i >= 1;$i--){
			$date = "$year-$month-".($i < 10 ? '0':'').$i;
			$tele = isset($telemarketingDayNumberMappping[$date]) ? $telemarketingDayNumberMappping[$date] : 0;
			$wip = isset($buildingSwipingDayNumberMappping[$date]) ? $buildingSwipingDayNumberMappping[$date] : 0;
			$log = isset($logsDayNumberMapping[$date]) ? $logsDayNumberMapping[$date] : array();
			$sl = isset($sumlogsDayNumberMapping[$date]) ? $sumlogsDayNumberMapping[$date]['content'] : '';
			$sid = isset($sumlogsDayNumberMapping[$date]) ? $sumlogsDayNumberMapping[$date]['id'] : '';
			$c = isset($comlogsDayNumberMapping[$date]) ? $comlogsDayNumberMapping[$date]['content'] : '';
			$cid = isset($comlogsDayNumberMapping[$date]) ? $comlogsDayNumberMapping[$date]['id'] : '';
			$e = isset($comlogsDayNumberMapping[$date]) ? $comlogsDayNumberMapping[$date]['evaluator'] : '';
			$planTel = isset($plan['telemarketing'][$date]) ? $plan['telemarketing'][$date] : '';
			$planWip = isset($plan['buildingSwiping'][$date]) ? $plan['buildingSwiping'][$date] : '';
			array_push($res, array(
				'sp'=>$mode == "market" ? (int)$planTel.'电 '.(int)$planWip.'扫' : null,  //standardPlan
				'pa'=>$mode == "market" ? $tele.'电 '.$wip.'扫' : null, //practicalAccomplishment
				'd'=>$mode == "market" ? ($planTel-$tele)."电 ".($planWip-$wip)."扫" : null,//difference
				's'=>$log,//selfPlan
				'sl'=>$sl,//summarizedLog
				'sid'=>$sid,
				'y'=>$year,
				'm'=>$month,
				'c'=>$c,//comments
				'cid'=>$cid,// comments id
				'e'=>$e,//evaluator
				'dy'=>$i < 10 ? "0$i" : "$i"  //day
			));
		}
		return $res;
	}
	public function getIndicator($q){
		global $mysql;
		$mode = isset($q['mode']) ? $q['mode'] : "none";  // market , design

		if($mode == "market"){
			$plan = $mysql->DBGetAsMap("select c1 as buildingSwiping,c2 as telemarketing,c3 as companyVisit,c4 as deposit from business_goal where targetMonth = '?' and user = '?' ",$q['year'].'-'.$q['month'],$q['name']);
			return array(
				"plan" => count($plan) > 0 ? $plan[0] : (object)array(),
				"accomplishment" => $this->getIndicatorMarket($q['name'],$q['year'],$q['month'],true)
			);
		}
			
		if($mode == "design"){
			$plan = $mysql->DBGetAsMap("select c1 as depositRate,c2 as signedBusinessNumber from business_goal where targetMonth = '?' and user = '?' ",$q['year'].'-'.$q['month'],$q['name']);
			return array(
				"plan" => count($plan) > 0 ? $plan[0] : (object)array(),
				"accomplishment" => $this->getIndicatorDesign($q['name'],$q['year'],$q['month'])
			);
		}
		throw new Exception("unknow mode $mode!");
	}

}
?>