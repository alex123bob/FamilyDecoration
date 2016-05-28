<?php

class BaseSvc{

	public $tableName="";
	public $fields = "";

	/*
	删除,如:
	http://localhost/fd/libs/fina.php?action=user.del&orderby=name%20
	http://xxx/?action=get&name=xxx&phone=xxx&age=xxx&_name=王
	_开头的,模糊查询,like

	*/
	public function del($qryParams){
		$qryParams['isDeleted'] = 'true';
		$qryParams['createTime'] = 'now()';
		return $this->update($qryParams);
	}
	//增加
	public function add($qryParams){
		global $mysql;
		$obj = array();
		foreach ($this->fields as $f) {
			if(isset($qryParams[$f])){
				$obj[$f] = $qryParams[$f];
			}
		}
		$mysql->DBInsertAsArray($this->tableName,$obj);
		return array('status'=>'successful', 'data'=>$obj,'errMsg' => '');
	}

	public function getUUID(){
		//return uniqid().str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		return date("YmdHis").str_pad(microtime_float2(),4,0,STR_PAD_LEFT).str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
	}
	/*
	如:
	http://localhost/fd/libs/api.php?action=user.get&orderby=name%20asc&limit=1,4
	http://xxx/?action=user.get&name=xxx&phone=xxx&age=xxx&_name=王
	_开头的,模糊查询,like
	?action=getNameAndPhone&xxx=xxxx&ddd=xxxx

	*/
	public function get($qryParams){
		global $TableMapping;
		global $mysql;
		$whereSql = " where 1 = 1 ";
		$orderBy = "";
		$limit = "";
		$params = array();
		foreach ($this->fields as $f) {
			if(isset($qryParams[$f])){
				array_push($params, $qryParams[$f]);
				$whereSql = $whereSql." and `".$f."` = '?' ";
			}
			if(isset($qryParams["_".$f])){
				array_push($params, $qryParams['_'.$f]);
				$whereSql = $whereSql." and `".$f."` like '%?%' ";
			}
		}
		if(!contains($whereSql,'isDeleted')){
			$whereSql = $whereSql." and `isDeleted` = 'false' ";
		}
		if(isset($qryParams['orderby']) && trim($qryParams['orderby']) != ""){
			$orderBy = " order by  ".$qryParams['orderby'];
		}
		if(isset($qryParams['limit']) && trim($qryParams['limit']) != ""){
			$limit = " limit ".$qryParams['limit'];
		}
		$row = $mysql->DBGetAsMap("select * from ".$this->tableName.$whereSql.$orderBy.$limit,$params);
		$count = $mysql->DBGetAsOneArray("select count(1) as count from ".$this->tableName.$whereSql,$params)[0];
		return array('total'=>$count,'data'=>$row);

	} 

	/*
		修改
		http://localhost/fd/libs/api.php?action=user.update&name=10&_name=0
		_开头的where条件,不带_的是需要设值得字段以及要设的值
	*/
	public function update($qryParams){
		global $TableMapping;
		global $mysql;
		$obj = array();
		$whereSql = " 1 = 1 ";
		$params = array();
		foreach ($this->fields as $f) {
			if(isset($qryParams[$f])){
				$obj[$f] = $qryParams[$f];
			}
			if(isset($qryParams["_".$f])){
				array_push($params, $qryParams['_'.$f]);
				$whereSql = $whereSql." and `".$f."` = '?' ";
			}
		}
		if(trim($whereSql) == "1 = 1"){
			throw new Exception("no where condition. Cant update all records.");
		}
		$obj['lastUpdateTime'] = 'now()';		
		$affect = $mysql->DBUpdate($this->tableName,$obj,$whereSql,$params);
		return array('status'=>'successful','affect'=>$affect, 'errMsg' => '','data'=>$obj);
	}

	public function setTableName($tablename){
		global $TableMapping;
		$this->tableName = camelToUnderline($tablename);
		$this->fields = $TableMapping[$this->tableName];
		if(!isset($this->fields) || count($this->fields) == 0){
			throw new Exception("table ".$this->tableName."not defined in TableMapping.php");
		}
	}

	public static function processAction($req){
		$ac = explode('.',$req["action"]);
		$controller = $ac[0];
		$action = $ac[1];
		require_once $controller."Svc.class.php";
		$class = new ReflectionClass(ucfirst($controller)."Svc");
		$fin = $class->newInstanceArgs();
		$fin->setTableName($controller);
		$class = new ReflectionClass($fin);//建立 Person这个类的反射类  
		$methods=$class->getmethods();  //获取Person 类中的getName方法 
		$found = false;
		$res = array('status'=>'successful', 'errMsg' => '');
		foreach($methods as $method){
			if(strtolower($method->getName()) == $action){
				$res = $class->getMethod($method->getName())->invoke($fin,$req);
				$found = true;
				break;				
			}
		}
		if(!$found)
			throw new Exception("unknown action:".$action);
		if($res != null)
			echo (json_encode($res));
	}
}
?>