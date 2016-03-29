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
?>