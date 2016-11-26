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
	
	function financeReport($q){
		if(isset($q['projectId'])){
			
		}
		$q['_fields'] = 'projectId,projectName,captain';
		$data = $this->get($q);
		foreach($data['data'] as $key => &$value){
			$value['contract'] = 'contract';
			$value['incNDec']='test';
			$value['subTotal']='test';
			$value['income']='test';
			$value['materialElectricBudget']='test';
			$value['materialElectricReality']='test';
			$value['materialPlasterBudget']='test';
			$value['materialPlasterReality']='test';
			$value['materialCarpenterBudget']='test';
			$value['materialCarpenterReality']='test';
			$value['materialPaintBudget']='test';
			$value['materialPaintReality']='test';
			$value['materialMiscellaneousBudget']='test';
			$value['materialMiscellaneousReality']='test';
			$value['materialTotalBudget']='test';
			$value['materialTotalReality']='test';
			$value['manualElectricBudget']='test';
			$value['manualElectricReality']='test';
			$value['manualPlasterBudget']='test';
			$value['manualPlasterReality']='test';
			$value['manualCarpenterBudget']='test';
			$value['manualCarpenterReality']='test';
			$value['manualPaintBudget']='test';
			$value['manualPaintReality']='test';
			$value['manualMiscellaneousBudget']='test';
			$value['manualMiscellaneousReality']='test';
			$value['manualTotalBudget']='test';
			$value['manualTotalReality']='test';
			$value['totalBudget']='test';
			$value['totalReality']='test';
			$value['others']='test';
			$value['status']='test';			
		}
		return $data;
	}
}

?>