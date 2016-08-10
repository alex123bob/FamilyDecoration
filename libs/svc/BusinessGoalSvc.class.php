<?php
class BusinessGoalSvc extends BaseSvc
{

	public function add($q){
		global $mysql;
		$q['@id'] = $this->getUUID();
		$res = parent::add($q);
		return $res;
	}


	public function updateGoal($q){
		if($q['id'] == null || $q['id'] == ""){
			return $this->add($q);
		}else{
			return parent::update($q);
		}
	}

	public function getByDepa($q){
		global $mysql;
		$targetMonth = $q['year'];
		if(isset($q['month']))
			$targetMonth .= '-'.$q['month'];
		$sql = "select g.id,g.c1,g.c2,g.c3,g.c4,u.realName,u.name as user,g.targetMonth from user u ".
		"left join business_goal g on u.name = g.user and u.isDeleted = 'false' and g.isDeleted = 'false' and g.targetMonth like '".$targetMonth."%'  where  u.level like '".$q['depa']."%' ";
		if(isset($q['user']))
			$sql .= " and user = '".$q['user']."'";
		$res = $this->parseData($sql,$q);
		$users = array();
		foreach ($res['data'] as $key => $value) {
			array_push($users, $value['user']);
		}
		$ym = $q['year'].'-'.$q['month'];
		if($q['depa'] == '0004'){
			$this->appendAcctualMarket($res['data'],$ym,$users);
		}else{
			$this->appendAcctualDesign($res['data'],$ym,$users);
		}
		return $res;
	}

	private function parseData($sql,$q){
		global $mysql;
		$count = $mysql->DBGetAsOneArray("select count(*) as cnt from ( $sql ) as temp ")[0];
		$data = $mysql->DBGetAsMap($sql.BaseSvc::parseLimitSql($q));
		$res = array('status'=>'successful','data'=>$data,'total'=>$count);
		return $res;
	}

	private function appendAcctualDesign(&$dataArray,$ym,$users){
		if(count($users) == 0)
			return;
		global $mysql;
		$users = '\''.join($users,'\',\'').'\'';
		$sql = "select count(*) as ctn,designerName as user from business where designerName in ($users) and left(signTime,7) = '$ym' group by designerName,left(signTime,7) "; 
		$signRateData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');
		foreach ($dataArray as &$value) {
			$value['id'] = $value['id'] == null ? '' : $value['id'];
			$value['ac1'] = (int)(isset($signRateData[$value['user']]) ? $signRateData[$value['user']]['ctn'] : 0);
			$value['ac2'] = 'TODO';
			$value['c1'] = (int)$value['c1'];
			$value['c2'] = (int)$value['c2'];
			unset($value['targetMonth']);
			$value['user'] = $value['realName'];
			unset($value['realName']);
			unset($value['c3']);
			unset($value['c4']);
		}
	}

	private function appendAcctualMarket(&$dataArray,$ym,$users){
		if(count($users) == 0)
			return;
		global $mysql;
		$users = '\''.join($users,'\',\'').'\'';
		$sql = "select count(*)  as ctn,committer as user from potential_business_detail where left(createTime,7) = '$ym' and committer in ( $users ) group by committer,left(createTime,7) ";
		$telemarketingData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');

		$sql = "select count(*)  as ctn,salesmanName as user from business where left(levelTime,7) = '$ym' and level = 'B' and salesmanName in ( $users ) group by salesmanName,left(levelTime,7) ";
		$companyVisitData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');

		$sql = "select count(*)  as ctn,salesmanName as user from business where left(levelTime,7) = '$ym' and level = 'A' and salesmanName in ( $users ) group by salesmanName,left(levelTime,7) ";
		$depositData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');

		$sql = "select count(*) as ctn,salesmanName as user from potential_business where left(createTime,7) = '$ym' and salesmanName in ( $users ) group by salesmanName,left(createTime,7) ";
		$buildingSwipingData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');

		foreach ($dataArray as &$value) {
			$value['id'] = $value['id'] == null ? '' : $value['id'];
			$value['ac1'] = (int)(isset($buildingSwipingData[$value['user']]) ? $buildingSwipingData[$value['user']]['ctn'] : 0);
			$value['ac2'] = (int)(isset($telemarketingData[$value['user']]) ? $telemarketingData[$value['user']]['ctn'] : 0);
			$value['ac3'] = (int)(isset($companyVisitData[$value['user']]) ? $companyVisitData[$value['user']]['ctn'] : 0);
			$value['ac4'] = (int)(isset($depositData[$value['user']]) ? $depositData[$value['user']]['ctn'] : 0);
			$value['c1'] = (int)$value['c1'];
			$value['c2'] = (int)$value['c2'];
			$value['c3'] = (int)$value['c3'];
			$value['c4'] = (int)$value['c4'];
			unset($value['targetMonth']);
			$value['user'] = $value['realName'];
			unset($value['realName']);
		}
	}

	// [{a:1,b:1,key:k1},{a:1,b:1,key:k2},{a:1,b:1,key:k3}]  ---> [k1:{a:1,b:1,key:k1},k2:{a:1,b:1,key:k2},k3:{a:1,b:1,key:k3}]
	private function objectListToKeyList($array,$key){
		$res = array();
		foreach ($array as $value) {
			$res[$value[$key]] = $value;
		}
		return $res;
	}
}

?>