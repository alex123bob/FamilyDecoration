<?php
Class ProjectProgressSvc extends BaseSvc{
	
	public function get($q){
		$q['_fields'] = 'id,projectId';
		return parent::get($q);
	}

	public function getItems($q){
		global $TableMapping;
		global $mysql;
		$sql = "select * from plan_making pr left join project_progress pl on pr.projectId = pl.projectId where pl.projectId = ? ";
		$projectProgress = $mysql->DBGetAsMap($sql,$q['projectId']);
		if(count($projectProgress)==0)
			throw new Exception('找不到id为'.$q['projectId'].'的项目!');
		if(count($projectProgress)>1)
			throw new Exception('找到多个id为'.$q['projectId'].'的项目!');
		require_once('PlanMakingSvc.class.php');
		$count = 0;
		$res = array();
		$projectProgress = $projectProgress[0];
		foreach (PlanMakingSvc::$map as $key => $value) {
			$startTime = '';
			$endTime = '';
			if(isset($projectProgress[$key]) && contains($projectProgress[$key],'~')){
				$time = explode("~",$projectProgress[$key]);
				$startTime = $time[0];
				$endTime = $time[1];
			}
			$item = array(
				'serialNumber'=>++$count,
				'parentItemName'=>PlanMakingSvc::$pmap[$key],
				'itemName'=>$value,
				'planStartTime'=>$startTime,
				'planEndTime'=>$endTime,
				'practicalProgress'=>$projectProgress['p'.$key],
				'supervisorComment'=>$projectProgress['m'.$key],
				'professionType'=>'xxx',
				'projectId'=>$projectProgress['projectId'],
				'id'=>$projectProgress['projectId'].'-'.$key);
			array_push($res, $item);
		}
		return array('total'=>32,'data'=>$res);
	}

	public function updateItem($q){
		$temp = explode("-",$q['id']);   // projectId-columnName
		$obj = array('projectId'=>$temp[0]);
		if(isset($q['@practicalProgress']))
			$obj['@practicalProgress'] = $q['@practicalProgress'];
		if(isset($q['@professionType']))
			$obj['@professionType'] = $q['@professionType'];
		if(isset($q['@supervisorComment']))
			$obj['@supervisorComment'] = $q['@supervisorComment'];
		return parent::update($obj);
	}
}
?>