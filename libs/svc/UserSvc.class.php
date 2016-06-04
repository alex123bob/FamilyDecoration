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
		$sql = "select name,realName from $this->tableName where name in ( '" . join("','",array_unique($names)) . "')";
		$names = $mysql->DBGetAsMap($sql);
		$namemapping = array();
		foreach ($names as $key => $value) {
			$namemapping[$value['name']] = $value['realName'];
		}
		foreach ($dataArray as $key => &$value) {
			if(isset($value[$columnName]) && $value[$columnName] != "" && isset($namemapping[$value[$columnName]]))
				$value['real'.$columnName] = $namemapping[$value[$columnName]];
		}
	}

}

?>