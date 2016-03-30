<?php
	function getStatisticDepartments(){
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
		global $mysql;
        $res= array();

		$whereSql = " where `name` in (select `userName` from `log_list`) ";
		$orderBy = " ORDER BY `user`.`level` ASC ";
		$arr = $mysql->DBGetSomeRows("`user`", " DISTINCT `level` ",$whereSql ,$orderBy);
		foreach($arr as $key => $val) {
			$depa = explode("-", $val[0]);
			$depa = $depa[0];
			// if ($depa != "001") {
			$flag = false;
			for ($i = 0; $i < count($res); $i++) {
				$tmp = preg_match("/^".$depa."-\d{3}$/", $res[$i]["level"]);
				if ($tmp == 1) {
					$flag = true;
					break;
				}
			}
			if ($flag) {
				// todo
			}
			else {
				array_push($res, array("level"=>$val[0]));
			}
        }
		
		return $res;
	}

	function getMembersByDepartment($department){
		global $mysql;
        $res= array();
        $whereSql = "where level like '".$department."-%' and `isDeleted` = 'false' ";

        $arr = $mysql->DBGetSomeRows("`user`", "*", $whereSql);

        return $arr;
	}

	// this function returns an array with index from zero to eleven.
	function getDaysInMonthByYear($year){
	    if($year%400 == 0  || ($year % 4 == 0 && $year % 100 !== 0)){
	        $rday = 29;
	    }
	    else{
	        $rday = 28;
	    }
	    $daysArr = array();
	    for ($i = 1; $i <= 12; $i++){
	        if( $i == 2 ) {
	            $days = $rday;
	        }
	        else {
	            $days = (($i - 1) % 7 % 2) ? 30 : 31;
	        }
	        array_push($daysArr, $days);
	    }
	    return $daysArr;
	}

	function getIndividualStatisticsByYearByMonthByUser ($year, $month, $user){
		global $mysql;
		$currentMonthDaysAmount = getDaysInMonthByYear($year);
		$currentMonthDaysAmount = $currentMonthDaysAmount[(int)$month - 1];
                $res= array("log"=>array(), "business"=>array(), "signedBusiness"=>array(), "potentialBusiness"=>array());

                // log list
                $whereSql = "where isDeleted = 'false' and year(createTime) = '$year' and month(createTime) = '$month' and userName = '$user' GROUP BY day(`createTime`) ORDER BY day(`createTime`) ";
                $logArr = $mysql->DBGetSomeRows("`log_list`", "*, day(createTime) AS `day`, count(*) AS `logListDailyAmount` ", $whereSql);

                // business
                $whereSql = "where isDeleted = 'false' and isFrozen = 'false' and isTransfered = 'false' and isDead = 'false' and year(createTime) = '$year' and month(createTime) = '$month' and salesmanName = '$user' GROUP BY day(`createTime`) ORDER BY day(`createTime`) ";
                $businessArr = $mysql->DBGetSomeRows("`business`", " *, day(createTime) AS `day`, count(*) AS `businessDailyAmount` ", $whereSql);
                $userBusinessTotalNumber = $mysql->DBGetAsMap("select count(*) as `totalNumber` from `business` where isDeleted = 'false' and isFrozen = 'false' and isTransfered = 'false' and isDead = 'false' and year(createTime) = '$year' and month(createTime) = '$month' and salesmanName = '$user'");
                if (count($userBusinessTotalNumber) > 0) {
                	$userBusinessTotalNumber = $userBusinessTotalNumber[0]["totalNumber"];
                }

                // signed business
                $whereSql = "where isDeleted = 'false' and isFrozen = 'false' and isTransfered = 'false' and isDead = 'false' and year(createTime) = '$year' and month(createTime) = '$month' and designerName = '$user' GROUP BY day(`createTime`) ORDER BY day(`createTime`) ";
                $signedBusinessArr = $mysql->DBGetSomeRows("`business`", " *, day(createTime) AS `day`, count(*) AS `signedBusinessDailyAmount` ", $whereSql);
                $userSignedBusinessTotalNumber = $mysql->DBGetAsMap("select count(*) as `totalNumber` from `business` where isDeleted = 'false' and isFrozen = 'false' and isTransfered = 'false' and isDead = 'false' and year(createTime) = '$year' and month(createTime) = '$month' and designerName = '$user'");
                if (count($userSignedBusinessTotalNumber) > 0) {
                	$userSignedBusinessTotalNumber = $userSignedBusinessTotalNumber[0]["totalNumber"];
                }

                // potential business
                $whereSql = "where isDeleted = 'false' and year(createTime) = '$year' and month(createTime) = '$month' and salesmanName = '$user' GROUP BY day(`createTime`) ORDER BY day(`createTime`) ";
                $potentialBusinessArr = $mysql->DBGetSomeRows("`potential_business`", " *, day(createTime) AS `day`, count(*) AS `potentialBusinessDailyAmount` ", $whereSql);
                $userPotentialBusinessTotalNumber = $mysql->DBGetAsMap("select count(*) as `totalNumber` from `potential_business` where isDeleted = 'false' and year(createTime) = '$year' and month(createTime) = '$month' and salesmanName = '$user'");
                if (count($userPotentialBusinessTotalNumber) > 0) {
                        $userPotentialBusinessTotalNumber = $userPotentialBusinessTotalNumber[0]["totalNumber"];
                }
                
                for ($i=0; $i < $currentMonthDaysAmount; $i++) { 
                	// log
                	if (count($logArr) > 0 && $i + 1 == $logArr[0]["day"]) {
                		array_push($res["log"], $logArr[0]);
                		array_shift($logArr);
                	}
                	else {
                		array_push($res["log"], array("day"=>$i+1, "logListDailyAmount"=>0));
                	}
                	if ($i == 0) {
                		$res["log"][$i]["logListMonthlyAmount"] = (int)$res["log"][$i]["logListDailyAmount"];
                	}
                	else {
                		$res["log"][$i]["logListMonthlyAmount"] = (int)$res["log"][$i]["logListDailyAmount"] + (int)$res["log"][$i-1]["logListMonthlyAmount"];
                	}
                	// end log

                	// business
                	if (count($businessArr) > 0  && $i + 1 == $businessArr[0]["day"]) {
                		array_push($res["business"], $businessArr[0]);
                		array_shift($businessArr);
                	}
                	else {
                		array_push($res["business"], array("day"=>$i+1, "businessDailyAmount"=>0));
                	}
                	if ($i == 0) {
                		$res["business"][$i]["businessMonthlyAmount"] = (int)$res["business"][$i]["businessDailyAmount"];
                	}
                	else {
                		$res["business"][$i]["businessMonthlyAmount"] = (int)$res["business"][$i]["businessDailyAmount"] + (int)$res["business"][$i-1]["businessMonthlyAmount"];
                	}
                	$res["business"][$i]["businessTotalNumber"] = $userBusinessTotalNumber;
                	// end business
                	
                	// signed business
                	if (count($signedBusinessArr) > 0  && $i + 1 == $signedBusinessArr[0]["day"]) {
                		array_push($res["signedBusiness"], $signedBusinessArr[0]);
                		array_shift($signedBusinessArr);
                	}
                	else {
                		array_push($res["signedBusiness"], array("day"=>$i+1, "signedBusinessDailyAmount"=>0));
                	}
                	if ($i == 0) {
                		$res["signedBusiness"][$i]["signedBusinessMonthlyAmount"] = (int)$res["signedBusiness"][$i]["signedBusinessDailyAmount"];
                	}
                	else {
                		$res["signedBusiness"][$i]["signedBusinessMonthlyAmount"] = (int)$res["signedBusiness"][$i]["signedBusinessDailyAmount"] + (int)$res["signedBusiness"][$i-1]["signedBusinessMonthlyAmount"];
                	}
                	$res["signedBusiness"][$i]["signedBusinessTotalNumber"] = $userSignedBusinessTotalNumber;
                	// end signed business
                	
                	// potential business
                	if (count($potentialBusinessArr) > 0  && $i + 1 == $potentialBusinessArr[0]["day"]) {
                                array_push($res["potentialBusiness"], $potentialBusinessArr[0]);
                                array_shift($potentialBusinessArr);
                        }
                        else {
                                array_push($res["potentialBusiness"], array("day"=>$i+1, "potentialBusinessDailyAmount"=>0));
                        }
                        if ($i == 0) {
                                $res["potentialBusiness"][$i]["potentialBusinessMonthlyAmount"] = (int)$res["potentialBusiness"][$i]["potentialBusinessDailyAmount"];
                        }
                        else {
                                $res["potentialBusiness"][$i]["potentialBusinessMonthlyAmount"] = (int)$res["potentialBusiness"][$i]["potentialBusinessDailyAmount"] + (int)$res["potentialBusiness"][$i-1]["potentialBusinessMonthlyAmount"];
                        }
                        $res["potentialBusiness"][$i]["potentialBusinessTotalNumber"] = $userPotentialBusinessTotalNumber;
                	// end potential business
                }

                $outputArr = array();
                for ($i=0; $i < $currentMonthDaysAmount; $i++) { 
                        array_push($outputArr, array(
                                "day" => $i + 1,
                                "logListDailyAmount" => $res["log"][$i]["logListDailyAmount"],
                                "logListMonthlyAmount" => $res["log"][$i]["logListMonthlyAmount"],
                                "businessDailyAmount" => $res["business"][$i]["businessDailyAmount"],
                                "businessMonthlyAmount" => $res["business"][$i]["businessMonthlyAmount"],
                                "businessTotalNumber" => $res["business"][$i]["businessTotalNumber"],
                                "signedBusinessDailyAmount" => $res["signedBusiness"][$i]["signedBusinessDailyAmount"],
                                "signedBusinessMonthlyAmount" => $res["signedBusiness"][$i]["signedBusinessMonthlyAmount"],
                                "signedBusinessTotalNumber" => $res["signedBusiness"][$i]["signedBusinessTotalNumber"],
                                "potentialBusinessDailyAmount" => $res["potentialBusiness"][$i]["potentialBusinessDailyAmount"],
                                "potentialBusinessMonthlyAmount" => $res["potentialBusiness"][$i]["potentialBusinessMonthlyAmount"],
                                "potentialBusinessTotalNumber" => $res["potentialBusiness"][$i]["potentialBusinessTotalNumber"]
                        ));
                }

                return $outputArr;
	}
?>