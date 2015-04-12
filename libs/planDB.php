<?php

	function addPlan($post){
		$projectId = $post["projectId"];
		$plans = getPlanByProjectId($projectId);
		$fields = array('conCleaHeatDefine','bottomDig','toiletBalCheck','plumbElecCheck','knockWall','woodProCheck','paintMateCheck','paintProConstruct','cabiInstall',
			'tileMarbleCabiDefine','waterElecCheck','waterElecConstruct','waterElecPhoto','tilerMateConstruct','tilerProCheck','woodMateCheck','woodProConstruct','toilKitchSuspend',
			'paintProCheck','switchSocketInstall','lampSanitInstall','floorInstall','paintRepair','wallpaperPave','housekeepingClean','elecInstall','curtainFuniInstall');
		if(count($plans) != 0)
			throw new Exception("plan with projectId:$projectId already exist!");
		$obj = array("id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),"projectId"=>$projectId);
		foreach($fields as $field)
			if(isset($post[$field]))
				$obj[$field] = $post[$field];
		global $mysql;
		$mysql->DBInsertAsArray("`plan`",$obj);
		return array('status'=>'successful', 'errMsg' => '','planId'=> $obj["id"]);
	}

	function deletePlan($planId){
		global $mysql;
		$mysql->DBUpdate("plan",array('isDeleted'=>true),"`id` = '?' ",array($planId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function deletePlanByProjectId($projectId){
		global $mysql;
		$mysql->DBUpdate("plan",array('isDeleted'=>true),"`projectId` = '?' ",array($projectId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getPlan($id){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`plan`", " * "," where id = '$id' " ,"");
		$fields = array('id','createTime','projectId','conCleaHeatDefine','bottomDig','toiletBalCheck','plumbElecCheck','knockWall','woodProCheck','paintMateCheck','paintProConstruct','cabiInstall',
			'tileMarbleCabiDefine','waterElecCheck','waterElecConstruct','waterElecPhoto','tilerMateConstruct','tilerProCheck','woodMateCheck','woodProConstruct','toilKitchSuspend',
			'paintProCheck','switchSocketInstall','lampSanitInstall','floorInstall','paintRepair','wallpaperPave','housekeepingClean','elecInstall','curtainFuniInstall');
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
			foreach($fields as $field)
				$res[$count][$field] = $val[$field];
		    $count ++;
        }
		return $res;
	}

	function getPlanByProjectId($loglistId){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`plan`", " * "," where projectId = '$loglistId' and isDeleted = 'false' " ," order by createTime ");
		$fields = array('id','createTime','projectId','conCleaHeatDefine','bottomDig','toiletBalCheck','plumbElecCheck','knockWall','woodProCheck','paintMateCheck','paintProConstruct','cabiInstall',
			'tileMarbleCabiDefine','waterElecCheck','waterElecConstruct','waterElecPhoto','tilerMateConstruct','tilerProCheck','woodMateCheck','woodProConstruct','toilKitchSuspend',
			'paintProCheck','switchSocketInstall','lampSanitInstall','floorInstall','paintRepair','wallpaperPave','housekeepingClean','elecInstall','curtainFuniInstall');
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
			foreach($fields as $field)
				$res[$count][$field] = $val[$field];
		    $count ++;
        }
		return $res;
	};

	function editPlan($data){
		global $mysql;
		$obj = array();
		$fields = array('projectId','conCleaHeatDefine','bottomDig','toiletBalCheck','plumbElecCheck','knockWall','woodProCheck','paintMateCheck','paintProConstruct','cabiInstall',
			'tileMarbleCabiDefine','waterElecCheck','waterElecConstruct','waterElecPhoto','tilerMateConstruct','tilerProCheck','woodMateCheck','woodProConstruct','toilKitchSuspend',
			'paintProCheck','switchSocketInstall','lampSanitInstall','floorInstall','paintRepair','wallpaperPave','housekeepingClean','elecInstall','curtainFuniInstall');
		foreach($fields as $field){
			if(isset($data[$field]))
				$obj[$field] = $data[$field];
		}
		$mysql->DBUpdate("plan",$obj,"`id` = '?' ",array($data['id']));
		return array('status'=>'successful', 'errMsg' => 'edit plan ok');
	}
?>