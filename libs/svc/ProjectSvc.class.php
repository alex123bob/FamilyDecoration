<?php
class ProjectSvc extends BaseSvc
{
	function appendCaptain(&$dataArray,$projectIdColumnName = 'projectId'){
		if(count($dataArray) == 0)
			return;
		$projectIds = array();
		foreach ($dataArray as $key => $value) {
			if(isset($value[$projectIdColumnName]) && $value[$projectIdColumnName] != "")
				array_push($projectIds,$value[$projectIdColumnName]);
		}
		if(count($projectIds) == 0)
			return ;
		global $mysql;
		$sql = "select captain,captainName,projectId from $this->tableName where projectId in ( '" . join("','",array_unique($projectIds)) . "')";
		$res = $mysql->DBGetAsMap($sql);
		$projectIdMapping = array();
		foreach ($res as $key => $value) {
			$projectIdMapping[$value['projectId']] = array('captain'=>$value['captain'],'captainName'=>$value['captainName']);
		}
		foreach ($dataArray as $key => &$value) {
			if(!isset($projectIdMapping[$value['projectId']]))
				continue;
			$value['captain'] = $projectIdMapping[$value['projectId']]['captain'];
			$value['captainName'] = $projectIdMapping[$value['projectId']]['captainName'];
		}
	}
}

?>