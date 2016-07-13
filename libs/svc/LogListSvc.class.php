<?php
class LogListSvc extends BaseSvc
{
	public function getMonths(){
		$now = new DateTime('now');
		$month = $now->format('m');
		$year = $now->format('Y');
		return array(
			array('year'=>$month - 2 < 1 ? $year - 1 : (int)$year,'month'=>$month - 2 < 1 ? 12 : $month - 2 ),
			array('year'=>$month - 1 < 1 ? $year - 1 : (int)$year,'month'=>$month - 1 < 1 ? 12 : $month - 1 ),
			array('year'=>(int)$year,'month'=>(int)$month)
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