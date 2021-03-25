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
		if(isset($q['month'])){
			$targetMonth .= '-'.$q['month'];
			$sql = "select g.id,g.c1,g.c2,g.c3,g.c4,u.realName,u.name as user,g.targetMonth from user u ".
			"left join business_goal g on u.name = g.user and g.isDeleted = 'false' and g.targetMonth like '".$targetMonth."%'  where  u.level like '".$q['depa']."%'  AND u.isDeleted = 'false'  ";
		}else{
			$sql = "select g.id,g.c1,g.c2,g.c3,g.c4,u.realName,u.name as user,g.targetMonth from user u ".
			"left join (select null as id , sum(c1) as c1,sum(c2) as c2,sum(c3) as c3,sum(c4) as c4,user,LEFT (targetMonth, 4) as targetMonth from business_goal where isDeleted = 'false' and targetMonth like '".$targetMonth."%' group by left(targetMonth,4),user ) g on u.name = g.user where  u.level like '".$q['depa']."%'  AND u.isDeleted = 'false' ";
		}		
		if(isset($q['user']))
			$sql .= " and user = '".$q['user']."'";
		$res = array('status'=>"successful");
		$res['data'] = $mysql->DBGetAsMap($sql);
		$res['total'] = count($res['data']);
		$users = array();
		foreach ($res['data'] as $key => $value) {
			array_push($users, $value['user']);
		}
		if(isset($q['month'])){
			$ym = $q['year'].'-'.$q['month'];
		}else{
			$ym = $q['year'];
		}
		if($q['depa'] == '0004'){
			$this->appendAcctualMarket($res['data'],$ym,$users);
		}else{
			$this->appendAcctualDesign($res['data'],$ym,$users);
		}
		return $res;
	}

	private function appendAcctualDesign(&$dataArray,$ym,$users){
		if(count($users) == 0)
			return;
		$left = strlen($ym);
		global $mysql;
		$users = '\''.join('\',\'', $users).'\'';
		$sql = "select count(1) as ctn,designerName as user from business where designerName in ($users) and left(signTime,$left) = '$ym' group by designerName,left(signTime,$left) "; 
		$signRateData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');
		foreach ($dataArray as &$value) {
			$value['id'] = $value['id'] == null ? '' : $value['id'];
			$value['a1'] = (int)(isset($signRateData[$value['user']]) ? $signRateData[$value['user']]['ctn'] : 0);
			$value['a2'] = 'TODO';
			$value['c1'] = (int)$value['c1'];
			$value['c2'] = (int)$value['c2'];
			unset($value['targetMonth']);
			unset($value['c3']);
			unset($value['c4']);
			$value['u'] = $value['user'];
			$value['n'] = $value['realName'];
			unset($value['user']);
			unset($value['realName']);
		}
	}

	private function appendAcctualMarket(&$dataArray,$ym,$users){
		if(count($users) == 0)
			return;
		global $mysql;
		$left = strlen($ym);
		$users = '\''.join('\',\'', $users).'\'';
		$sql = "select count(1)  as ctn,committer as user from potential_business_detail where left(createTime,$left) = '$ym' and committer in ( $users ) group by committer,left(createTime,$left) ";
		$telemarketingData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');

		$sql = "select count(1)  as ctn,salesmanName as user from business where left(levelTime,$left) = '$ym' and level = 'B' and salesmanName in ( $users ) group by salesmanName,left(levelTime,$left) ";
		$companyVisitData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');

		$sql = "select count(1)  as ctn,salesmanName as user from business where left(levelTime,$left) = '$ym' and level = 'A' and salesmanName in ( $users ) group by salesmanName,left(levelTime,$left) ";
		$depositData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');

		$sql = "select count(1) as ctn,salesmanName as user from potential_business where left(createTime,$left) = '$ym' and salesmanName in ( $users ) group by salesmanName,left(createTime,$left) ";
		$buildingSwipingData = $this->objectListToKeyList($mysql->DBGetAsMap($sql),'user');

		foreach ($dataArray as &$value) {
			$value['id'] = $value['id'] == null ? '' : $value['id'];
			$value['a1'] = (int)(isset($buildingSwipingData[$value['user']]) ? $buildingSwipingData[$value['user']]['ctn'] : 0);
			$value['a2'] = (int)(isset($telemarketingData[$value['user']]) ? $telemarketingData[$value['user']]['ctn'] : 0);
			$value['a3'] = (int)(isset($companyVisitData[$value['user']]) ? $companyVisitData[$value['user']]['ctn'] : 0);
			$value['a4'] = (int)(isset($depositData[$value['user']]) ? $depositData[$value['user']]['ctn'] : 0);
			$value['c1'] = (int)$value['c1'];
			$value['c2'] = (int)$value['c2'];
			$value['c3'] = (int)$value['c3'];
			$value['c4'] = (int)$value['c4'];
			$value['u'] = $value['user'];
			$value['n'] = $value['realName'];
			unset($value['user']);
			unset($value['realName']);
			unset($value['targetMonth']);
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