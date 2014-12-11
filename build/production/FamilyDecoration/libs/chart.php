<?php
	include_once "conn.php";

	/**
	 * [addCategory]
	 * @param array $category [consists of chartId, chartCategory, chartContent]
	 */
	function addCategory (array $category){
		try {
			global $mysql;
			$mysql->DBInsert("`chart`", "`chartId`, `chartCategory`, `chartContent`",
			 	"'".$category['chartId']."', '".$category['chartCategory']."', '".$category['chartContent']."'");
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [getCharts Gets all chart categories]
	 * @return [type] [description]
	 */
	function getCategories (){
		try {
			global $mysql;
			$arr = $mysql->DBGetAllRows("`chart`", "*");

			if ($arr) {
				// Url encode Chinese characters and then decode them, in order to avert garbled characters.
				foreach($arr as $key => $val) {
					$arr[$key]['chartCategory'] = urlencode($val['chartCategory']);
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
	 * [getCategoryById get specific category by id]
	 * @param  [string] $chartId [description]
	 * @return [type]          [description]
	 */
	function getCategoryById ($chartId){
		try {
			global $mysql;
			$arr = $mysql->DBGetSomeRows("`chart`", "*", "where `chartId` = '$chartId' ");

			if ($arr) {
				// Url encode Chinese characters and then decode them, in order to avert garbled characters.
				foreach($arr as $key => $val) {
					$arr[$key]['chartCategory'] = urlencode($val['chartCategory']);
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
	 * [editCategory Edits chart by chartId]
	 * @param  array  $chart [consists of chartId and any segment to be edited]
	 * @return [type]      [description]
	 */
	function editChart (array $chart){
		try {
			global $mysql;
			$setValue = "";
			foreach ($chart as $key => $val) {
				if ($key == "chartId" || is_numeric ($key)) {
					continue;
				}
				else {
					$setValue .= " `".$key."` = '".$val."',";
				}
			}
			$setValue = substr($setValue, 0, -1);
			$condition = "`chartId` = '".$chart['chartId']."'";
			$mysql->DBUpdateSomeCols("`chart`", $condition, $setValue);
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function deleteCategory (array $chart) {
		try {
			global $mysql;
			$condition = "`chartId` = '".$chart['chartId']."'";
			$mysql->DBDelete("`chart`", $condition);
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function getChart (array $chart){
		try {
			global $mysql;
			$arr = $mysql->DBGetSomeRows("`chart`", "*", "where `chartId` = '".$chart["chartId"]."'");

			if ($arr) {
				// Url encode Chinese characters and then decode them, in order to avert garbled characters.
				foreach($arr as $key => $val) {
					$arr[$key]['chartCategory'] = urlencode($val['chartCategory']);
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
?>