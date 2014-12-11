<?php
	include_once "conn.php";

	/**
	 * [addProject]
	 * @param array $pro [consists of projectId, projectName, projectProgress, projectChart]
	 */
	function addProject (array $pro){
		try {
			global $mysql;
			$mysql->DBInsert("`project`", "`projectId`, `projectName`, `projectProgress`, `projectChart`, `projectTime`",
			 	"'".$pro['projectId']."', '".$pro['projectName']."', '".$pro['projectProgress']."', '".$pro['projectChart']."', '".$pro['projectTime']."'");
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [delProject delete project by projectId]
	 * @param  [string] $id [projectId]
	 * @return [type]     [description]
	 */
	function delProject ($id){
		try {
			global $mysql;
			$mysql->DBDelete('`project`', "`projectId` = '".$id."'");
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function getProjectNames (){
		try {
			global $mysql;
			$arr = $mysql->DBGetAllRows("`project`", "`projectName`");

			if ($arr) {
				// Url encode Chinese characters and then decode them, in order to avert garbled characters.
				foreach($arr as $key => $val) {
					$arr[$key]['projectName'] = urlencode($val['projectName']);
				}
				$arr = urldecode(json_encode($arr));
			}
			else {
				$arr = json_encode(array());
			}
			
			return $arr;
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function getProjectYears (){
		try {
			global $mysql;
			$arr = $mysql->DBGetAllRows("`project`", "distinct YEAR(`projectTime`) as `projectYear`", " ORDER BY `projectTime` DESC");

			$arr = $arr ? json_encode($arr) : json_encode(array());
			
			return $arr;
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function getProjectMonths ($year){
		try {
			global $mysql;
			$arr = $mysql->DBGetSomeRows("`project`", "distinct MONTH(`projectTime`) as `projectMonth`", "where YEAR(`projectTime`) = $year",
				" ORDER BY `projectTime` DESC");

			$arr = $arr ? json_encode($arr) : json_encode(array());
			
			return $arr;
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function getProjects ($year, $month){
		try {
			global $mysql;
			$arr = $mysql->DBGetSomeRows("`project`", "*", "where YEAR(`projectTime`) = $year and MONTH(`projectTime`) = $month");

			if ($arr) {
				// Url encode Chinese characters and then decode them, in order to avert garbled characters.
				foreach($arr as $key => $val) {
					$arr[$key]['projectName'] = urlencode($val['projectName']);
					$arr[$key]['projectId'] = urlencode($val['projectId']);
					$arr[$key]['projectChart'] = urlencode($val['projectChart']);
					$arr[$key]['projectProgress'] = urlencode($val['projectProgress']);
					$arr[$key]['projectYear'] = date("Y", strtotime($val["projectTime"]));
					$arr[$key]['projectMonth'] = date("m", strtotime($val["projectTime"]));
					$arr[$key]['budgetId'] = urlencode($val['budgetId']);
				}
				$arr = urldecode(json_encode($arr));
			}
			else {
				$arr = json_encode(array());
			}
			
			return $arr;
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}
	
	function getProjectsByProjectId ($projectId){
		try {
			global $mysql;
			$arr = $mysql->DBGetSomeRows("`project`", "*", "where `projectId` = '$projectId' ");

			if ($arr) {
				// Url encode Chinese characters and then decode them, in order to avert garbled characters.
				foreach($arr as $key => $val) {
					$arr[$key]['projectName'] = urlencode($val['projectName']);
					$arr[$key]['projectId'] = urlencode($val['projectId']);
					$arr[$key]['projectChart'] = urlencode($val['projectChart']);
					$arr[$key]['projectProgress'] = urlencode($val['projectProgress']);
					$arr[$key]['budgetId'] = urlencode($val['budgetId']);
				}
				$arr = urldecode(json_encode($arr));
			}
			else {
				$arr = json_encode(array());
			}

			return $arr;
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [editProject Edits project by projectId]
	 * @param  array  $pro [consists of projectId and any segment to be edited]
	 * @return [type]      [description]
	 */
	function editProject (array $pro){
		try {
			global $mysql;
			$setValue = "";
			foreach ($pro as $key => $val) {
				if ($key == "projectId" || is_numeric ($key)) {
					continue;
				}
				else {
					$setValue .= " `".$key."` = '".$val."',";
				}
			}
			$setValue = substr($setValue, 0, -1);
			$condition = "`projectId` = '".$pro['projectId']."'";
			$mysql->DBUpdateSomeCols("`project`", $condition, $setValue);
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function editProjectByProjectName (array $pro){
		try {
			global $mysql;
			$setValue = "";
			foreach ($pro as $key => $val) {
				if ($key == "projectName" || is_numeric ($key)) {
					continue;
				}
				else {
					$setValue .= " `".$key."` = '".$val."',";
				}
			}
			$setValue = substr($setValue, 0, -1);
			$condition = "`projectName` = '".$pro['projectName']."'";
			$mysql->DBUpdateSomeCols("`project`", $condition, $setValue);
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	// echo addProject(array("projectId"=>"A-5-9", "projectName"=>"家装项目", "projectProgress"=>"刚刚开始;材料初始化;工程受阻;工程继续;", "projectChart"=>"sjaldjfas.fasdfasdal"))
	// echo editProject(array('projectId'=>'A-2-3', 'projectName'=>"非测试项目", 'projectProgress'=>"开始进入施工;施工完成;财务报销"));
?>