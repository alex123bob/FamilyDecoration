<?php
	function getChartsByProjectId ($projectId){
		global $mysql;
		$res= array();
		$arr = $mysql->DBGetSomeRows("`chart_detail`", "*", "where `projectId` = '$projectId' and `isDeleted` = 'false' ");
		foreach($arr as $key => $val) {
			$res[$key]['id'] = ($val['id']);
			$res[$key]['projectId'] = ($val['projectId']);
			$res[$key]['chartId'] = ($val['chartId']);
			$res[$key]['content'] = ($val['content']);
			$res[$key]['originalName'] = ($val['originalName']);
			$res[$key]['createTime'] = ($val['createTime']);
			$res[$key]['updateTime'] = ($val['updateTime']);
			$res[$key]['isDeleted'] = ($val['isDeleted']);
		}
		return $res;
	}

	function getChartsByChartId ($chartId){
		global $mysql;
		$res= array();
		$arr = $mysql->DBGetSomeRows("`chart_detail`", "*", "where `chartId` = '$chartId' and `isDeleted` = 'false' ");
		foreach($arr as $key => $val) {
			$res[$key]['id'] = ($val['id']);
			$res[$key]['projectId'] = ($val['projectId']);
			$res[$key]['chartId'] = ($val['chartId']);
			$res[$key]['content'] = ($val['content']);
			$res[$key]['originalName'] = ($val['originalName']);
			$res[$key]['createTime'] = ($val['createTime']);
			$res[$key]['updateTime'] = ($val['updateTime']);
			$res[$key]['isDeleted'] = ($val['isDeleted']);
		}
		return $res;
	}

	function delChartsByProjectId ($projectId){
		global $mysql;
		$mysql->DBUpdate("chart_detail",array('isDeleted'=>true),"`projectId` = '?'",array($projectId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function delChartsByChartId ($chartId){
		global $mysql;
		$mysql->DBUpdate("chart_detail",array('isDeleted'=>true),"`chartId` = '?'",array($chartId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function delChartsById ($ids){
		global $mysql;
		$arr = explode(">>><<<", $ids);
		for ($i = 0; $i < count($arr); $i++) {
			$id = $arr[$i];
			$mysql->DBUpdate("chart_detail",array('isDeleted'=>true),"`id` = '?'",array($id));
		}
		return array('status'=>'successful', 'errMsg' => '');
	}

	function addCharts (array $chart){
		global $mysql;
		$content = explode(">>><<<", $chart["content"]);
		$originalName = explode(">>><<<", $chart["originalName"]);
		if (isset($chart["projectId"])) {
			$projectId = explode(">>><<<", $chart["projectId"]);
		}
		else if (isset($chart["chartId"])) {
			$chartId = explode(">>><<<", $chart["chartId"]);
		}
		$len = count($content);
		for ($i = 0; $i < $len; $i++) {
			$obj = array(
				"content" => $content[$i],
				"originalName" => $originalName[$i]
			);
			if (isset($projectId)) {
				$obj["projectId"] = $projectId[$i];
			}
			else if (isset($chartId)) {
				$obj["chartId"] = $chartId[$i];
			}
			$mysql->DBInsertAsArray("`chart_detail`",$obj);
		}
		return array('status'=>'successful', 'errMsg' => '');
	}
?>