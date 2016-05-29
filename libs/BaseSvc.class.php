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

		if(!isset($obj['isDeleted']))
			$obj['isDeleted'] = 'false';
		if(!isset($obj['createTime']))
			$obj['createTime'] = 'now()';

		$mysql->DBInsertAsArray($this->tableName,$obj);
		return array('status'=>'successful', 'data'=>$obj,'errMsg' => '');
	}

	public function getUUID(){
		//return uniqid().str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		return date("YmdHis").str_pad(microtime_float2(),4,0,STR_PAD_LEFT).str_pad(rand(0, 99), 2, rand(0, 9), STR_PAD_LEFT);
	}

	public function parseLimitSql($q){
		return isset($qryParams['limit']) && trim($qryParams['limit']) != "" ? " limit ".$q['limit'] : "";
	}

	public function parseOrderBySql($q){
		return isset($qryParams['orderby']) && trim($qryParams['orderby']) != "" ? " order by  ".$q['orderby'] : "";
	}

	public function parseWhereSql($prefix,$tableName,$q,&$params){
		global $TableMapping;
		global $mysql;
		$prefix = trim($prefix);
		if(!isset($q['isDeleted'])){
			$q['isDeleted'] = 'false';
		}
		$whereSql = " ";
		foreach ($TableMapping[$tableName] as $f) {
			if(isset($q[$f])){
				array_push($params, $q[$f]);
				$whereSql = $whereSql." and $prefix`$f` = '?' ";
			}
			if(isset($q["_".$f])){
				array_push($params, $q['_'.$f]);
				$whereSql = $whereSql." and $prefix`$f` like '%?%' ";
			}
		}
		return $whereSql;
	}

	/*
	如:
	http://localhost/fd/libs/api.php?action=user.get&orderby=name%20asc&limit=1,4
	http://xxx/?action=user.get&name=xxx&phone=xxx&age=xxx&_name=王
	_开头的,模糊查询,like
	?action=getNameAndPhone&xxx=xxxx&ddd=xxxx

	*/
	public function get($q){
		return $this->_get($q,false);
	}
	public function getCount($q){
		return $this->_get($q,true);
	}
	private function _get($qryParams,$onlyCount){
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
		$count = $mysql->DBGetAsOneArray("select count(1) as count from ".$this->tableName.$whereSql,$params)[0];
		if($onlyCount)
			return array('status'=>'successful', 'count'=>$count,'errMsg' => '');
		$row = $mysql->DBGetAsMap("select * from ".$this->tableName.$whereSql.$orderBy.$limit,$params);
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
		return $this;
	}

	public static function getSvc($svcName){
		require_once $svcName."Svc.class.php";
		$class = new ReflectionClass($svcName."Svc");
		$fin = $class->newInstanceArgs();
		return $fin->setTableName($svcName);
	}
}
?>