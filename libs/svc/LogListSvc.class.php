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
}
?>