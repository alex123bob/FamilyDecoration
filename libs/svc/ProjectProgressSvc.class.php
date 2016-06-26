<?php
Class ProjectProgressSvc extends BaseSvc{
	
	public function add($q){
		$content = $q['@content'];
		if(!isset($q['@committer'])){
			$q['@committer'] = $_SESSION['name'];
		}
		if(isset($q['@itemId'])){
			$itemId = $q['@itemId'];
			$temp = explode("-",$itemId); 
			$q['@projectId'] = $temp[0]; 
			$q['@columnName'] = $temp[1];
		}
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function getItems($q){
		$planSvc = parent::getSvc('PlanMaking');
		$progressAuditSvc = parent::getSvc('ProjectProgressAudit');
		//先查工程计划
		$plan = $planSvc->get(array('projectId'=>$q['projectId']));
		if(count($plan['data'])==0)
			throw new Exception('工程'.$q['projectId'].'暂时没有计划表!');
		if(count($plan['data'])>1)
			throw new Exception('找到多个projectId为'.$q['projectId'].'的项目!');
		$plan = $plan['data'][0];
		//查工程计划所有小项
		$planItems = $planSvc->getItems(array('projectId'=>$q['projectId']),true);
		//查工程进度审核
		$progressAudit = $progressAuditSvc->get(array('projectId'=>$plan['projectId']));
		$progressAudit = $progressAudit['data'];
		//查工程实际进度
		$progress = parent::get(array('projectId'=>$plan['projectId']));
		$progress = $progress['data'];
		//转为以工程计划planMaking 列名为key,value为进度条目数组的map
		$progressByColumnName = array();
		foreach ($progress as $key => &$value) {
			if(!isset($progressByColumnName[$value['columnName']])){
				$progressByColumnName[$value['columnName']] = array();
			}
			//去掉冗余数据
			$columnName = $value['columnName'];
			unset($value['columnName']);
			unset($value['isDeleted']);
			unset($value['projectId']);
			array_push($progressByColumnName[$columnName], $value);
		}
		//转为以工程计划planMaking 列名为key,value为审核条目数组的map
		$auditByColumnName = array();
		foreach ($progressAudit as $key => &$value) {
			if(!isset($auditByColumnName[$value['columnName']])){
				$auditByColumnName[$value['columnName']] = array();
			}
			//去掉冗余数据
			$columnName = $value['columnName'];
			unset($value['columnName']);
			unset($value['isDeleted']);
			unset($value['projectId']);
			array_push($auditByColumnName[$columnName], $value);
		}
		//遍历所有计划小项,将实际进度和审核追加
		foreach ($planItems as $key => &$value) {
			if(isset($progressByColumnName[$value['columnName']])){
				$value['practicalProgress'] = $progressByColumnName[$value['columnName']];
 			}else{
 				$value['practicalProgress'] = array();
 			}
 			if(isset($auditByColumnName[$value['columnName']])){
				$value['supervisorComment'] = $auditByColumnName[$value['columnName']];
 			}else{
 				$value['supervisorComment'] = array();
 			}
 			$value['planStartTime'] = $value['startTime'];
 			$value['planEndTime'] = $value['endTime'];
 			unset($value['columnName']);
 			unset($value['startTime']);
 			unset($value['endTime']);
		}
		return array('total'=>32,'data'=>$planItems);
	}
}
?>