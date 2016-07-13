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
				"accomplishment" => array(
					"telemarketing" => "99", 
					"companyVisit" => "199", 
					"deposit" => "299", 
					"buildingSwiping" => "399"
				)
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