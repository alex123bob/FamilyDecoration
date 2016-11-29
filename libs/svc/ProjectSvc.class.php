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
		$q['isFrozen'] = 0;
		//$q['projectId'] = '201503120934479771';  //for test
		$data = $this->get($q);
		//get all project ids
		$projectIds = '';
		$singleProjectQuery = false;
		if(isset($q['projectId'])){
			$projectIds = $q['projectId'];
			$singleProjectQuery = true;
		}else{
			$projects = array();
			foreach($data['data'] as $key => $value){
				array_push($projects,$value['projectId']);
			}
			$projectIds = join($projects,',');
		}
		//人力及材料预算成本
		$map = $this->getCostBudget($projectIds);
		//实际材料成本,只算材料订购单中的。suppier_order
		$mp1 = $this->getAcctualMateriaCost($projectIds);
		//实际人力成本,只算statement_bill中预付款ppb，工人工资reg，保证金qgd类型金额
		$mp2 = $this->getActualManPowerCost($projectIds);
		
		//追加预算
		foreach($data['data'] as $key => &$v){
			$projectId = $v['projectId'];
			$v['contract'] = '/';
			$v['incNDec']='/';
			$v['subTotal']='/';
			$v['income']='/';
			//材料成本预算、实际
			$v['materialElectricBudget']       =isset($map[$projectId.'mainMaterialCost0004']) ? $map[$projectId.'mainMaterialCost0004'] : 0;
			$v['materialElectricReality']      =isset($mp1[$projectId.'-0004']) ? $mp1[$projectId.'-0004'] : 0;
			$v['materialPlasterBudget']        =isset($map[$projectId.'mainMaterialCost0001']) ? $map[$projectId.'mainMaterialCost0001'] : 0;
			$v['materialPlasterReality']       =isset($mp1[$projectId.'-0001']) ? $mp1[$projectId.'-0001'] : 0;
			$v['materialCarpenterBudget']      =isset($map[$projectId.'mainMaterialCost0002']) ? $map[$projectId.'mainMaterialCost0002'] : 0;
			$v['materialCarpenterReality']     =isset($mp1[$projectId.'-0002']) ? $mp1[$projectId.'-0002'] : 0;
			$v['materialPaintBudget']          =isset($map[$projectId.'mainMaterialCost0003']) ? $map[$projectId.'mainMaterialCost0003'] : 0;
			$v['materialPaintReality']         =isset($mp1[$projectId.'-0003']) ? $mp1[$projectId.'-0003'] : 0;
			$v['materialMiscellaneousBudget']  =isset($map[$projectId.'mainMaterialCost0009']) ? $map[$projectId.'mainMaterialCost0009'] : 0;
			$v['materialMiscellaneousReality'] =isset($mp1[$projectId.'-0009']) ? $mp1[$projectId.'-0009'] : 0;
			$v['materialLaborBudget']          =isset($map[$projectId.'mainMaterialCost0005']) ? $map[$projectId.'mainMaterialCost0005'] : 0;
			$v['materialLaborReality']         =isset($mp1[$projectId.'-0005']) ? $mp1[$projectId.'-0005'] : 0;
			//材料成本预算、实际 -总计
			$v['materialTotalBudget']          =isset($map[$projectId.'totalMainMaterialCost']) ? $map[$projectId.'totalMainMaterialCost'] : 0;
			$v['materialTotalReality']         =$v['materialElectricReality']+$v['materialPlasterReality']+$v['materialCarpenterReality']+$v['materialPaintReality']+$v['materialMiscellaneousReality']+$v['materialLaborReality'];
			//人力成本预算、实际
			$v['manualElectricBudget']         =isset($map[$projectId.'manPowerCost0004']) ? $map[$projectId.'mainMaterialCost0004'] : 0;
			$v['manualElectricReality']        =isset($mp2[$projectId.'-0004']) ? $mp2[$projectId.'-0004'] : 0;
			
			$v['manualPlasterBudget']          =isset($map[$projectId.'manPowerCost0001']) ? $map[$projectId.'mainMaterialCost0001'] : 0;
			$v['manualPlasterReality']         =isset($mp2[$projectId.'-0001']) ? $mp2[$projectId.'-0001'] : 0;
			
			$v['manualCarpenterBudget']        =isset($map[$projectId.'manPowerCost0002']) ? $map[$projectId.'mainMaterialCost0002'] : 0;
			$v['manualCarpenterReality']       =isset($mp2[$projectId.'-0002']) ? $mp2[$projectId.'-0002'] : 0;
			
			$v['manualPaintBudget']            =isset($map[$projectId.'manPowerCost0003']) ? $map[$projectId.'mainMaterialCost0003'] : 0;
			$v['manualPaintReality']           =isset($mp2[$projectId.'-0003']) ? $mp2[$projectId.'-0003'] : 0;
			
			$v['manualMiscellaneousBudget']    =isset($map[$projectId.'manPowerCost0009']) ? $map[$projectId.'mainMaterialCost0009'] : 0;
			$v['manualMiscellaneousReality']   =isset($mp2[$projectId.'-0009']) ? $mp2[$projectId.'-0009'] : 0;
			
			$v['manualLaborBudget']            =isset($map[$projectId.'manPowerCost0005']) ? $map[$projectId.'mainMaterialCost0005'] : 0;
			$v['manualLaborReality']           =isset($mp2[$projectId.'-0005']) ? $mp2[$projectId.'-0005'] : 0;
			//人力预算、实际-总计
			$v['manualTotalBudget']            =isset($map[$projectId.'totalManPowerCost']) ? $map[$projectId.'totalManPowerCost'] : 0;
			$v['manualTotalReality']           =$v['manualElectricReality']+$v['manualPlasterReality']+$v['manualCarpenterReality']+$v['manualPaintReality']+$v['manualMiscellaneousReality']+$v['manualLaborReality'];

			//所有预算成本总计
			$v['totalBudget']= $v['manualTotalBudget'] + $v['materialTotalBudget'];
			//所有实际成本总计
			$v['totalReality']=$v['materialTotalReality'] + $v['manualTotalReality'];
			$v['others']=0; //TODO
			$v['status']='/';
		}
		//如果只查一个项目
		if($singleProjectQuery){
			$d = &$data['data'][0];
			//计算差额。方便前端使用。
			$d['elctMtDf'] = $d['materialElectricReality'] - $d['materialElectricBudget'];
			$d['elctMpDf'] = $d['manualElectricReality'] - $d['manualElectricBudget'];
			$d['plstMtDf'] = $d['materialPlasterReality'] - $d['materialPlasterBudget'];
			$d['plstMpDf'] = $d['manualPlasterReality'] - $d['manualPlasterBudget'];
			$d['cptMtDf']  = $d['materialCarpenterReality'] - $d['materialCarpenterBudget'];
			$d['cptMpDf']  = $d['manualCarpenterReality'] - $d['manualCarpenterBudget'];
			$d['ptMtDf']   = $d['materialPaintReality'] - $d['materialPaintBudget'];
			$d['ptMpDf']   = $d['manualPaintReality'] - $d['manualPaintBudget'];
			$d['msclMtDf'] = $d['materialMiscellaneousReality'] - $d['materialMiscellaneousBudget'];
			$d['msclMpDf'] = $d['manualMiscellaneousReality'] - $d['manualMiscellaneousBudget'];
			$d['lbMtDf']   = $d['materialLaborReality'] - $d['materialTotalBudget'];
			$d['lbMpDf']   = $d['manualLaborReality'] - $d['manualLaborBudget'];
			
			$d['ttMtDf']   = $d['elctMtDf']+$d['plstMtDf']+$d['cptMtDf']+$d['ptMtDf']+$d['msclMtDf']+$d['lbMtDf'];
			$d['ttMpDf']   = $d['elctMpDf']+$d['plstMpDf']+$d['cptMpDf']+$d['ptMpDf']+$d['msclMpDf']+$d['lbMpDf'];
			$d['extra'] = '差额';
			//前端柱状图，饼状图使用。
			$data['pie']=array(
				array('costType'=>'材料','cost'=>$d['materialTotalReality']),
				array('costType'=>'人工','cost'=>$d['manualTotalReality']),
				array('costType'=>'其他','cost'=>$d['others'])
			);
			$data['colMan']=array(
				array('professionType'=>'水电','reality'=>$d['manualElectricReality'],'budget'=>$d['manualElectricBudget']),
				array('professionType'=>'泥工','reality'=>$d['manualPlasterReality'],'budget'=>$d['manualPlasterBudget']),
				array('professionType'=>'木工','reality'=>$d['manualCarpenterReality'],'budget'=>$d['manualCarpenterBudget']),
				array('professionType'=>'油漆','reality'=>$d['manualPaintReality'],'budget'=>$d['manualPaintBudget']),
				array('professionType'=>'力工','reality'=>$d['manualLaborReality'],'budget'=>$d['manualLaborBudget']),
				array('professionType'=>'杂项','reality'=>$d['manualMiscellaneousReality'],'budget'=>$d['manualMiscellaneousBudget'])
			);
			$data['colMat']=array(
				array('professionType'=>'水电','reality'=>$d['materialElectricReality'],'budget'=>$d['materialElectricBudget']),
				array('professionType'=>'泥工','reality'=>$d['materialPlasterReality'],'budget'=>$d['materialPlasterBudget']),
				array('professionType'=>'木工','reality'=>$d['materialCarpenterReality'],'budget'=>$d['materialCarpenterBudget']),
				array('professionType'=>'油漆','reality'=>$d['materialPaintReality'],'budget'=>$d['materialPaintBudget']),
				array('professionType'=>'力工','reality'=>$d['materialLaborReality'],'budget'=>$d['materialLaborBudget']),
				array('professionType'=>'杂项','reality'=>$d['materialMiscellaneousReality'],'budget'=>$d['materialMiscellaneousBudget'])
			);
		}
		return $data;
	}
	
	//获取项目实际材料成本
	private function getAcctualMateriaCost($projectIds){
		$sql = "
			SELECT
				CONCAT(o.projectId,'-',i.professionType) as k,
				round(sum(i.unitPrice * i.amount),2) as v
			FROM
				supplier_order_item i
			LEFT JOIN supplier_order o ON o.id = i.supplierId
			WHERE
				o.isDeleted = 'false' AND i.isDeleted = 'false' and o.projectId in ($projectIds)
			GROUP BY
				o.projectId,
				professionType;
		";
		global $mysql;
		$costData = $mysql->DBGetAsMap($sql);
		$map = array();
		foreach($costData as $k => $v){
			$map[$v['k'].''] = $v['v'];
		}
		return $map;
	}
	
	//获取项目实际人工成本
	private function getActualManPowerCost($projectIds){
		$sql = "select CONCAT(s.projectId,'-',s.professionType) as k,round(sum(d.amount*d.unitPrice),2) as v 
				from statement_bill_item d 
				left join statement_bill s on s.id = d.billId 
				where s.isDeleted = 'false' and d.isDeleted = 'false' and s.billType in ('reg','ppd','qgd') and s.projectId in ($projectIds)
				group by projectId,s.professionType;";
		global $mysql;
		$costData = $mysql->DBGetAsMap($sql);
		$map = array();
		foreach($costData as $k => $v){
			$map[$v['k'].''] = $v['v'];
		}
		return $map;
	}
	
	//获取项目预算成本
	private function getCostBudget($projectIds){
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
		//整理成本预算数据
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
		return $map;
	}
	
	//工程财务管理--某一项目--合计--解析部分
	function getAnalysisDetail($q){
		global $mysql;
		$professionType = $q['professionType'];
		$projectId = $q['projectId'];
		$type = strtolower($q['type']);
		//预算人工成本
		$sql1 = "SELECT i.itemName as name,i.itemUnit as unit,i.manpowerCost as price,i.itemAmount as amount,round(i.manpowerCost*i.itemAmount,2) as totalPrice
				 FROM budget b LEFT JOIN budget_item i ON i.budgetId = b.budgetId
				 WHERE b.isDeleted = 'false' AND i.isDeleted = 'false' AND b.projectId IS NOT NULL AND i.workCategory IS NOT NULL and i.itemAmount > 0 and b.projectId = '?' and i.workCategory = '?'  order by name desc";
		//预算材料成本
		$sql2 = "SELECT i.itemName as name,i.itemUnit as unit,i.mainMaterialCost as price,i.itemAmount as amount,round(i.mainMaterialCost*i.itemAmount,2) as totalPrice
				 FROM budget b LEFT JOIN budget_item i ON i.budgetId = b.budgetId
				 WHERE b.isDeleted = 'false' AND i.isDeleted = 'false' AND b.projectId IS NOT NULL AND i.workCategory IS NOT NULL and i.itemAmount > 0 and b.projectId = '?' and i.workCategory = '?'  order by name desc";
		//实际人工成本
		$sql3 = "select d.billItemName as name,d.unit,d.amount,d.unitPrice as price,round(d.unitPrice*d.amount,2) as totalPrice
				from statement_bill_item d left join statement_bill s on s.id = d.billId 
				where s.isDeleted = 'false' and d.isDeleted = 'false' and s.billType in ('reg','ppd','qgd') and s.projectId = '?' and s.professionType = '?' order by name desc;";
		//实际材料成本
		$sql4 = "SELECT i.billItemName as name,i.unit,i.amount,i.unitPrice as price,round(i.unitPrice*i.amount,2) as totalPrice
				FROM supplier_order_item i LEFT JOIN supplier_order o ON o.id = i.supplierId
				WHERE o.isDeleted = 'false' AND i.isDeleted = 'false' and o.projectId = '?' and i.professionType = '?' order by name desc";
		$sql = "";
		switch($type){
			case "manpowerbudget": $sql = $sql1; break;
			case "materialbudget": $sql = $sql2; break;
			case "manpowerreality":$sql = $sql3; break;
			case "materialreality":$sql = $sql4; break;
			default : throw new Exception("unknow type $type , must be one of [manpower/material][budget/reality]");
		}
		
		$data = $mysql->DBGetAsMap($sql,$projectId,$professionType);
		return array("status"=>"successful","errMsg"=>"",'data'=>$data);
	}
	
	//工程财务管理--某一项目--单工种成本--人工成本
	function getProjectManPowerCost($q){
		global $mysql;
		$professionType = $q['professionType'];
		$projectId = $q['projectId'];
		//实际人工成本
		$sql = "select payee,id,claimAmount,paidAmount,status from statement_bill "
			  ."where billType in ('reg','ppd','qgd') and isDeleted = 'false' and projectId = '?' and professionType = '?' order by name desc;"
		$data = $mysql->DBGetAsMap($sql,$projectId,$professionType);
		return array("status"=>"successful","errMsg"=>"",'data'=>$data);
	}
	
	//工程财务管理--某一项目--单工种成本--材料成本
	function getProjectMaterialCost($q){
		global $mysql;
		$professionType = $q['professionType'];
		$projectId = $q['projectId'];
		//实际材料成本
		$sql = "select o.id,i.billItemName as name,i.amount,i.unit,i.unitPrice,round(i.amount*i.unitPrice,2) as totalPrice,s.supplierName,i.createTime from supplier_order_item i "
				."left join supplier s on i.supplierId = s.id "
				."left join supplier_order o on o.supplierId = i.supplierId "
				."where s.isDeleted = 'false' and i.isDeleted = 'false' and o.isDeleted = 'false' and o.projectId = '?' and i.professionType = '?' order by name desc";
		$data = $mysql->DBGetAsMap($sql,$projectId,$professionType);
		return array("status"=>"successful","errMsg"=>"",'data'=>$data);
	}
}

?>