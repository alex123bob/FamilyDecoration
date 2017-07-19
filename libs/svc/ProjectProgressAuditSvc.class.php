<?php
class ProjectProgressAuditSvc extends BaseSvc{
	public function add($q){
		$content = $q['@content'];
		if(!isset($q['@auditor'])){
			$q['@auditor'] = $_SESSION['name'];
		}
		$itemId = $q['@itemId'];
		$temp = explode("-",$itemId); 
		$q['@projectId'] = $temp[0]; 
		$q['@columnName'] = $temp[1];
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}

	public function get($q){
		$data = parent::get($q);
		$userSvc = parent::getSvc('User');
		$userSvc->appendRealName($data['data'],'auditor');
		return $data;
	}

	public function checkAuditPassed($type,$projectId){
		$columnName;
		$msg;
		switch ($type) {
			case '0001': $columnName = " 'c7' ";$msg="贴砖泥工工程-地面砖铺贴、内部验收";break;//泥工
			case '0006': $columnName = " 'c17' ";$msg="基础泥工工程-土建-墙体验收";break;//泥工
			case '0004': $columnName = " 'c12' ";$msg="水电工程-客户验收、拍照留底";break;//水电
			case '0002': $columnName = " 'c23' ";$msg="木工工程-客户验收、成品保护";break;//木工
			case '0003': $columnName = " 'c34' ";$msg="竣工验收、保修单签单";break;//油漆
			default:
            	return ;//其他工种不校验验收
            //throw new Exception("未知工种:".$type);break;
		}
		global $mysql;
		//可能会有多条监理审核意见.只按照最新添加的处理
		$cnt = $mysql->DBGetAsOneArray("select pass from project_progress_audit where projectId = '?'  and columnName = $columnName and isDeleted = 'false' order by createTime desc limit 1 ",$projectId);
		if(count($cnt) >0 && $cnt[0] > 0)
			return true;
		throw new BaseException("该项目$msg 最新添加的监理意见还未通过验收,暂时无法创建工资单!");
	}
}

?>