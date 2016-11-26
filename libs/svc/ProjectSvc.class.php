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
		$q['_fields'] = 'projectId,projectName,captain';
		$data = $this->get($q);
		//get all project ids
		$projectIds = '';
		if(isset($q['projectId'])){
			$projectIds = $q['projectId'];
		}else{
			$projects = array();
			foreach($data['data'] as $key => $value){
				array_push($projects,$value['projectId']);
			}
			$projectIds = join($projects,',');
		}
		//获取项目成本
		$sql = "select sum(totalManPowerCost) as manPowerCost, sum(totalMainMaterialCost) as mainMaterialCost,projectId,workCategory from 
		(
			SELECT
				b.projectId,
				i.manpowerCost*i.itemAmount as totalManPowerCost,
				i.mainMaterialCost as totalMainMaterialCost,
				i.workCategory
			FROM
				budget b
			LEFT JOIN budget_item i ON i.budgetId = b.budgetId
			WHERE
					b.isDeleted = 'false'
				AND i.isDeleted = 'false'
				AND b.projectId IS NOT NULL
				AND i.workCategory IS NOT NULL
				and i.itemAmount > 0 and projectId in ($projectIds)
				) temp
			group by projectId,workCategory;";
		global $mysql;
		$costData = $mysql->DBGetAsMap($sql);
		//整理数据，由二维表转为下面类似层级结构
		/*
			项目一
				泥工预算
				油漆工预算
				...
			项目二
				泥工预算
				油漆工预算
				...			
			...
		
		*/
		$map = array();
		foreach($costData as $key => $value){
			$projectId = $value['projectId'];
			$workCategory = $value['workCategory'];
			$map[$projectId.'manPowerCost'.$workCategory] = round($value['manPowerCost'],2);
			$map[$projectId.'mainMaterialCost'.$workCategory] = round($value['mainMaterialCost'],2);
			$map[$projectId.'totalManPowerCost'] = (isset($map[$projectId.'totalManPowerCost']) ? $map[$projectId.'totalManPowerCost'] : 0 ) + $map[$projectId.'manPowerCost'.$workCategory];
			$map[$projectId.'totalMainMaterialCost'] = (isset($map[$projectId.'totalMainMaterialCost']) ? $map[$projectId.'totalMainMaterialCost'] : 0 ) + $map[$projectId.'mainMaterialCost'.$workCategory];
		}
//$map[$projectId][$workCategory]['manPowerCost'] $map[$projectId][$workCategory]['mainMaterialCost']
/*
plaster	泥工	0001
carpenter	木工	0002
painter	油漆工	0003
electrician	水电工	0004
handyman	力工	0005
other	其他	0009
*/
		//追加预算
		foreach($data['data'] as $key => &$value){
			$projectId = $value['projectId'];
			$value['contract'] = 'TODO';
			$value['incNDec']='TODO';
			$value['subTotal']='TODO';
			$value['income']='TODO';
			//材料预算-实际  TODO 力工？没有出现。
			$value['materialElectricBudget']       =isset($map[$projectId.'mainMaterialCost0004']) ? $map[$projectId.'mainMaterialCost0004'] : 0;
			$value['materialElectricReality']      ='TODO';
			$value['materialPlasterBudget']        =isset($map[$projectId.'mainMaterialCost0001']) ? $map[$projectId.'mainMaterialCost0001'] : 0;
			$value['materialPlasterReality']       ='TODO';
			$value['materialCarpenterBudget']      =isset($map[$projectId.'mainMaterialCost0002']) ? $map[$projectId.'mainMaterialCost0002'] : 0;
			$value['materialCarpenterReality']     ='TODO';
			$value['materialPaintBudget']          =isset($map[$projectId.'mainMaterialCost0003']) ? $map[$projectId.'mainMaterialCost0003'] : 0;
			$value['materialPaintReality']         ='TODO';
			$value['materialMiscellaneousBudget']  =isset($map[$projectId.'mainMaterialCost0009']) ? $map[$projectId.'mainMaterialCost0009'] : 0;
			$value['materialMiscellaneousReality'] ='TODO';
			$value['materialTotalBudget']          =isset($map[$projectId.'totalMainMaterialCost']) ? $map[$projectId.'totalMainMaterialCost'] : 0;
			$value['materialTotalReality']         ='TODO';
			//人力预算-实际
			$value['manualElectricBudget']         =isset($map[$projectId.'manPowerCost0004']) ? $map[$projectId.'mainMaterialCost0004'] : 0;
			$value['manualElectricReality']        ='TODO';
			$value['manualPlasterBudget']          =isset($map[$projectId.'manPowerCost0001']) ? $map[$projectId.'mainMaterialCost0001'] : 0;
			$value['manualPlasterReality']         ='TODO';
			$value['manualCarpenterBudget']        =isset($map[$projectId.'manPowerCost0002']) ? $map[$projectId.'mainMaterialCost0002'] : 0;
			$value['manualCarpenterReality']       ='TODO';
			$value['manualPaintBudget']            =isset($map[$projectId.'manPowerCost0003']) ? $map[$projectId.'mainMaterialCost0003'] : 0;
			$value['manualPaintReality']           ='TODO';
			$value['manualMiscellaneousBudget']    =isset($map[$projectId.'manPowerCost0009']) ? $map[$projectId.'mainMaterialCost0009'] : 0;
			$value['manualMiscellaneousReality']   ='TODO';
			$value['manualTotalBudget']            =isset($map[$projectId.'totalManPowerCost']) ? $map[$projectId.'totalManPowerCost'] : 0;
			$value['manualTotalReality']           ='TODO';
			
			$value['totalBudget']= $value['manualTotalBudget'] + $value['materialTotalBudget'];
			$value['totalReality']='TODO';
			$value['others']='TODO';
			$value['status']='TODO';			
		}
		return $data;
	}
}

?>