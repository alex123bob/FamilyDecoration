<?php
class LogListSvc extends BaseSvc
{
	public function getMonths(){
		$date1 = new DateTime('now');
		$date2 = new DateTime('now - 1month');
		$date3 = new DateTime('now - 2month');
		return array(
			array('y'=>(int)$date1->format('Y'),'m'=>$date1->format('m'),'f'=>0),
			array('y'=>(int)$date2->format('Y'),'m'=>$date2->format('m'),'f'=>0),
			array('y'=>(int)$date3->format('Y'),'m'=>$date3->format('m'),'f'=>0)
		);
	}

	public function getOldMonths(){
		$end = new DateTime('now - 2month');
		$endY = $end->format('Y');
		$endM = $end->format('m');
		$res = array();
		for ($y = 2015 ; $y < $endY ; $y++)
			for ($m = 1 ; $m < 13 ; $m++)
				array_push($res, array('y'=>$y,'m'=>$m));
		for ($m = 1 ; $m < $endM ; $m++)
			array_push($res, array('y'=>$endY,'m'=>$m));
		return $res;
	}

	private function getIndicatorMarket($user,$year,$month,$byMonth=false){
		global $mysql;
		$ym = '\''.$year.'-'.$month.'\'';

		$sql = "select day,count(*) as num from (
					select left(createTime,10) as day , potentialBusinessId  from potential_business_detail b 
					where committer = '?' and left(createTime,6) = $ym group by potentialBusinessId,left(createTime,10) 
				) as temp group by day";
		if($byMonth) $sql = "select sum(num) as sum from ( $sql ) as temp";
		$telemarketingData = $mysql->DBGetAsMap($sql,$user);

		$sql = "select left(levelTime,10) as day,count(*) as num from business b 
				where level = 'B' and salesmanName = '?' and left(levelTime,7) = $ym group by left(levelTime,10) ";
		if($byMonth) $sql = "select sum(num) as sum  from ( $sql ) as temp";
		$companyVisitData = $mysql->DBGetAsMap($sql,$user);

		$sql = "select left(levelTime,10) as day,count(*) as num from business b 
				where level = 'A' and salesmanName = '?' and left(levelTime,7) = $ym group by left(levelTime,10) ";
		if($byMonth) $sql = "select sum(num) as sum  from ( $sql ) as temp";
		$depositData = $mysql->DBGetAsMap($sql,$user);

		$sql = "select left(createTime,10) as day,count(*) as num  from potential_business b 
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

	public function getIndicator($q){
		$name = $q['name'];
		$year = $q['year'];
		$month = $q['month'];
		$mode = isset($q['mode']) ? $q['mode'] : "none";  // market , design

		if($mode == "market")
			return array(
				"plan" => array( 
					"telemarketing"=> "100", 
					"companyVisit"=> "200", 
					"deposit"=> "300", 
					"buildingSwiping"=> "400"
				),
				"accomplishment" => $this->getIndicatorMarket($name,$year,$month,true)
			);
		if($mode == "design")
			return array(
				"plan" => array( 
					"signedBusinessNumber"=> "100", 
					"depositRate"=> "200"
				),
				"accomplishment" => array(
					"signedBusinessNumber" => "99", 
					"depositRate" => "399"
				)
			);
		throw new Exception("unknow mode $mode!");
	}
}
?>