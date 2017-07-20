<?php
class UserSvc extends BaseSvc
{
	function appendRealName(&$dataArray,$columnName = 'name'){
		if(count($dataArray) == 0)
			return;
		$names = array();
		foreach ($dataArray as $key => $value) {
			if(isset($value[$columnName]) && $value[$columnName] != "")
				array_push($names,$value[$columnName]);
		}
		if(count($names) == 0)
			return ;
		global $mysql;
		$sql = "select name,realName from $this->tableName where name in ( '" . join("','",array_unique($names)) . "') and isDeleted = 'false'";
		$names = $mysql->DBGetAsMap($sql);
		$namemapping = array();
		foreach ($names as $key => $value) {
			$namemapping[$value['name']] = $value['realName'];
		}
		foreach ($dataArray as $key => &$value) {
			if(isset($value[$columnName]) && $value[$columnName] != "" && isset($namemapping[$value[$columnName]]))
				$value[$columnName.'RealName'] = $namemapping[$value[$columnName]];
			else
				$value[$columnName.'RealName'] =$value[$columnName];
		}
	}

	function getRealNameAndEmail($user){
		global $mysql;
		$sql = "select realName,mail from user where name = '?' ";
		$names = $mysql->DBGetAsMap($sql,$user);
		return count($names) > 0 ? $names[0] : array('realName'=>$user,'mail'=>'');
	}

	function getRealNameAndPhone($user){
		global $mysql;
		$sql = "select realName,phone from user where name = '?' ";
		$names = $mysql->DBGetAsMap($sql,$user);
		return count($names) > 0 ? $names[0] : array('realName'=>$user,'phone'=>'');
	}

	public static function getDepartementByLevel($level){
		if(strpos($level, "001") === 0) return '总经办';
		if(strpos($level, "002") === 0) return '设计部';
		if(strpos($level, "003") === 0) return '工程部';
		if(strpos($level, "004") === 0) return '市场部';
		if(strpos($level, "005") === 0) return '人事行政部';
		if(strpos($level, "006") === 0) return '游客';
		if(strpos($level, "007") === 0) return '宣传部';
		if(strpos($level, "008") === 0) return '财务部';
		if(strpos($level, "009") === 0) return '预决算部';
		return '非部门';
	}
}

?>