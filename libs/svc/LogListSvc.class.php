<?php
class LogListSvc extends BaseSvc
{
	public function getMonths(){
		$date1 = new DateTime('now');
		$date2 = new DateTime('now - 1month');
		$date3 = new DateTime('now - 2month');
		return array(
			array('year'=>(int)$date1->format('Y'),'month'=>$date1->format('m')),
			array('year'=>(int)$date2->format('Y'),'month'=>$date2->format('m')),
			array('year'=>(int)$date3->format('Y'),'month'=>$date3->format('m'))
		);
	}

	public function getOldMonths(){
		$end = new DateTime('now -  3month');
		$end = $end->format('Y').$end->format('m');
		$res = array();
		for($i = 201502 ; $i< $end ; $i++){
			$y = substr((string)$i,0,4);
			$m = substr((string)$i,4,6);
			array_push($res, array('year'=>$y,'month'=>$m));
		}
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