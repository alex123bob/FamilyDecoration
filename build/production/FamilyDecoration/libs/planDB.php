<?php

	function addPlan($post){
		$projectId = $post["projectId"];
		$plans = getPlanByProjectId($projectId);
		if(count($plans) != 0){
			throw new Exception("plan with projectId:$projectId already exist!");
		}
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"projectId"=>$projectId,
			"conCleaHeatDefine" => $post["conCleaHeatDefine"],
			"bottomDig" => $post["bottomDig"],
			"toiletBalCheck" => $post["toiletBalCheck"],
			"plumbElecCheck" => $post["plumbElecCheck"],
			"knockWall" => $post["knockWall"],
			"tileMarbleCabiDefine" => $post["tileMarbleCabiDefine"],
			"waterElecCheck" => $post["waterElecCheck"],
			"waterElecConstruct" => $post["waterElecConstruct"],
			"waterElecPhoto" => $post["waterElecPhoto"],
			"tilerMateConstruct" => $post["tilerMateConstruct"],
			"tilerProCheck" => $post["tilerProCheck"],
			"woodMateCheck" => $post["woodMateCheck"],
			"woodProConstruct" => $post["woodProConstruct"],
			"woodProCheck" => $post["woodProCheck"],
			"paintMateCheck" => $post["paintMateCheck"],
			"paintProConstruct" => $post["paintProConstruct"],
			"cabiInstall" => $post["cabiInstall"],
			"toilKitchSuspend" => $post["toilKitchSuspend"],
			"paintProCheck" => $post["paintProCheck"],
			"switchSocketInstall" => $post["switchSocketInstall"],
			"lampSanitInstall" => $post["lampSanitInstall"],
			"floorInstall" => $post["floorInstall"],
			"paintRepair" => $post["paintRepair"],
			"wallpaperPave" => $post["wallpaperPave"],
			"housekeepingClean" => $post["housekeepingClean"],
			"elecInstall" => $post["elecInstall"],
			"curtainFuniInstall" => $post["curtainFuniInstall"]
		);
		global $mysql;
		$mysql->DBInsertAsArray("`plan`",$obj);
		return array('status'=>'successful', 'errMsg' => '','planId'=> $obj["id"]);
	}

	function deletePlan($planId){
		global $mysql;
		$condition = "`id` = '$planId' ";
		$setValue = " `isDeleted` = 'true'";
		$mysql->DBUpdateSomeCols("`plan`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => '');
	}

	function deletePlanByProjectId($projectId){
		global $mysql;
		$condition = "`projectId` = '$projectId' ";
		$setValue = " `isDeleted` = 'true'";
		$mysql->DBUpdateSomeCols("`plan`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getPlan($id){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`plan`", " * "," where id = '$id' " ,"");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["projectId"] = $val["projectId"];
		    $res[$count]["createTime"] = $val["createTime"];
			$res[$count]["conCleaHeatDefine"] = $val["conCleaHeatDefine"];
			$res[$count]["bottomDig"] = $val["bottomDig"];
			$res[$count]["toiletBalCheck"] = $val["toiletBalCheck"];
			$res[$count]["plumbElecCheck"] = $val["plumbElecCheck"];
			$res[$count]["knockWall"] = $val["knockWall"];
			$res[$count]["tileMarbleCabiDefine"] = $val["tileMarbleCabiDefine"];
			$res[$count]["waterElecCheck"] = $val["waterElecCheck"];
			$res[$count]["waterElecConstruct"] = $val["waterElecConstruct"];
			$res[$count]["waterElecPhoto"] = $val["waterElecPhoto"];
			$res[$count]["tilerMateConstruct"] = $val["tilerMateConstruct"];
			$res[$count]["tilerProCheck"] = $val["tilerProCheck"];
			$res[$count]["woodMateCheck"] = $val["woodMateCheck"];
			$res[$count]["woodProConstruct"] = $val["woodProConstruct"];
			$res[$count]["woodProCheck"] = $val["woodProCheck"];
			$res[$count]["paintMateCheck"] = $val["paintMateCheck"];
			$res[$count]["paintProConstruct"] = $val["paintProConstruct"];
			$res[$count]["cabiInstall"] = $val["cabiInstall"];
			$res[$count]["toilKitchSuspend"] = $val["toilKitchSuspend"];
			$res[$count]["paintProCheck"] = $val["paintProCheck"];
			$res[$count]["switchSocketInstall"] = $val["switchSocketInstall"];
			$res[$count]["lampSanitInstall"] = $val["lampSanitInstall"];
			$res[$count]["floorInstall"] = $val["floorInstall"];
			$res[$count]["paintRepair"] = $val["paintRepair"];
			$res[$count]["wallpaperPave"] = $val["wallpaperPave"];
			$res[$count]["housekeepingClean"] = $val["housekeepingClean"];
			$res[$count]["elecInstall"] = $val["elecInstall"];
			$res[$count]["curtainFuniInstall"] = $val["curtainFuniInstall"];
		    $count ++;
        }
		return $res;
	}

	function getPlanByProjectId($loglistId){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`plan`", " * "," where projectId = '$loglistId' and isDeleted = 'false' " ," order by createTime ");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["projectId"] = $val["projectId"];
		    $res[$count]["createTime"] = $val["createTime"];
			$res[$count]["conCleaHeatDefine"] = $val["conCleaHeatDefine"];
			$res[$count]["bottomDig"] = $val["bottomDig"];
			$res[$count]["toiletBalCheck"] = $val["toiletBalCheck"];
			$res[$count]["plumbElecCheck"] = $val["plumbElecCheck"];
			$res[$count]["knockWall"] = $val["knockWall"];
			$res[$count]["tileMarbleCabiDefine"] = $val["tileMarbleCabiDefine"];
			$res[$count]["waterElecCheck"] = $val["waterElecCheck"];
			$res[$count]["waterElecConstruct"] = $val["waterElecConstruct"];
			$res[$count]["waterElecPhoto"] = $val["waterElecPhoto"];
			$res[$count]["tilerMateConstruct"] = $val["tilerMateConstruct"];
			$res[$count]["tilerProCheck"] = $val["tilerProCheck"];
			$res[$count]["woodMateCheck"] = $val["woodMateCheck"];
			$res[$count]["woodProConstruct"] = $val["woodProConstruct"];
			$res[$count]["woodProCheck"] = $val["woodProCheck"];
			$res[$count]["paintMateCheck"] = $val["paintMateCheck"];
			$res[$count]["paintProConstruct"] = $val["paintProConstruct"];
			$res[$count]["cabiInstall"] = $val["cabiInstall"];
			$res[$count]["toilKitchSuspend"] = $val["toilKitchSuspend"];
			$res[$count]["paintProCheck"] = $val["paintProCheck"];
			$res[$count]["switchSocketInstall"] = $val["switchSocketInstall"];
			$res[$count]["lampSanitInstall"] = $val["lampSanitInstall"];
			$res[$count]["floorInstall"] = $val["floorInstall"];
			$res[$count]["paintRepair"] = $val["paintRepair"];
			$res[$count]["wallpaperPave"] = $val["wallpaperPave"];
			$res[$count]["housekeepingClean"] = $val["housekeepingClean"];
			$res[$count]["elecInstall"] = $val["elecInstall"];
			$res[$count]["curtainFuniInstall"] = $val["curtainFuniInstall"];
		    $count ++;
        }
		return $res;
	};

	function editPlan($data){
		global $mysql;
		$condition = "`id` = '".$data["id"]."' ";
		$setValue = " `projectId` = '".$data["projectId"]."'";
		$setValue = $setValue." , `conCleaHeatDefine` = '".$data["conCleaHeatDefine"]."'";
		$setValue = $setValue." , `bottomDig` = '".$data["bottomDig"]."'";
		$setValue = $setValue." , `toiletBalCheck` = '".$data["toiletBalCheck"]."'";
		$setValue = $setValue." , `plumbElecCheck` = '".$data["plumbElecCheck"]."'";
		$setValue = $setValue." , `knockWall` = '".$data["knockWall"]."'";
		$setValue = $setValue." , `tileMarbleCabiDefine` = '".$data["tileMarbleCabiDefine"]."'";
		$setValue = $setValue." , `waterElecCheck` = '".$data["waterElecCheck"]."'";
		$setValue = $setValue." , `waterElecConstruct` = '".$data["waterElecConstruct"]."'";
		$setValue = $setValue." , `waterElecPhoto` = '".$data["waterElecPhoto"]."'";
		$setValue = $setValue." , `tilerMateConstruct` = '".$data["tilerMateConstruct"]."'";
		$setValue = $setValue." , `tilerProCheck` = '".$data["tilerProCheck"]."'";
		$setValue = $setValue." , `woodMateCheck` = '".$data["woodMateCheck"]."'";
		$setValue = $setValue." , `woodProConstruct` = '".$data["woodProConstruct"]."'";
		$setValue = $setValue." , `woodProCheck` = '".$data["woodProCheck"]."'";
		$setValue = $setValue." , `paintMateCheck` = '".$data["paintMateCheck"]."'";
		$setValue = $setValue." , `paintProConstruct` = '".$data["paintProConstruct"]."'";
		$setValue = $setValue." , `cabiInstall` = '".$data["cabiInstall"]."'";
		$setValue = $setValue." , `toilKitchSuspend` = '".$data["toilKitchSuspend"]."'";
		$setValue = $setValue." , `paintProCheck` = '".$data["paintProCheck"]."'";
		$setValue = $setValue." , `switchSocketInstall` = '".$data["switchSocketInstall"]."'";
		$setValue = $setValue." , `lampSanitInstall` = '".$data["lampSanitInstall"]."'";
		$setValue = $setValue." , `floorInstall` = '".$data["floorInstall"]."'";
		$setValue = $setValue." , `paintRepair` = '".$data["paintRepair"]."'";
		$setValue = $setValue." , `wallpaperPave` = '".$data["wallpaperPave"]."'";
		$setValue = $setValue." , `housekeepingClean` = '".$data["housekeepingClean"]."'";
		$setValue = $setValue." , `elecInstall` = '".$data["elecInstall"]."'";
		$setValue = $setValue." , `curtainFuniInstall` = '".$data["curtainFuniInstall"]."'";
		$mysql->DBUpdateSomeCols("`plan`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => 'edit plan ok');
	}
?>