<?php
Class BaseException extends Exception{}

Class Proxy extends BaseSvc{

	private $proxyClass;
	private $proxySvc;

	public function __construct($svc){
		$this->proxySvc = $svc;
		$this->proxyClass = new ReflectionClass($svc);
	}

	public function service($methodName,$arg){
		$class = new ReflectionClass($this);
		$method = $this->proxyClass->getMethod($methodName);
		$res = $method->invokeArgs($this->proxySvc,$arg);
		/*
		//处理事务  暂不做潜逃事务支持
		$outterTransactionLevel = $mysql->getTransactionLevel();
		try{
			$res = $method->invokeArgs($this->proxySvc,$arg);
		}catch(Exception $e){
			if($outterTransactionLevel < $mysql->getTransactionLevel()){
				$mysql->rollback(); //说明内部有事务，要返回。cacth中只回滚bSvc中事务。
			}else if($outterTransactionLevel == $mysql->getTransactionLevel()){
				//说明内部没有事务。
			}else{
				//说明内部没多提交/回滚了事务。 有代码bug
				throw new Exception("有bug！");
			}
			throw $e;
		}
		if($outterTransactionLevel != $mysql->getTransactionLevel()){
			throw new Exception("有bug！");
		}*/
		return $res;
	}

	public function __call($methodName,$arg){
		return $this->service($methodName,$arg);
	}
}

class BaseSvc{

	public $tableName="";
	public $fields = array();
	public $appendWhere="";
	public $appendSelect="";
	public $appendJoin="";

	/*
	xxx=value 表示xxx字段严格匹配
	_xxx=value 表示xxx字段 like 模糊匹配
	-xxx=value update时使用,表示xxx字段值更新为value
	_fields=xxx,xxx 查询时使用,表示只查询xxx,xxx字段
	_distinct=t 查询时使用,t表示唯一,默认t,f表示不过滤唯一性
	*/

	public function del($q){
		$q['@isDeleted'] = 'true';
		$q['@updateTime'] = 'now()';
		return $this->update($q);
	}
	//增加
	public function add($q){
		global $mysql;
		$obj = array();
		foreach ($this->fields as $f) {
			if(isset($q['@'.$f])){
				$obj[$f] = $q['@'.$f];
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

	public static function parseLimitSql($q){
		return isset($q['limit']) && trim($q['limit']) != "" ? " limit ".$q['start'].",".$q['limit'] : "";
	}

	public function parseSelectSql($q,$tableName = ""){
		$sql = "select ";
		$tableName = $tableName == "" ? $this->tableName : $tableName;
		if(isset($q['_fields']) && $q['_fields'] != "" && trim($q['_fields']) != ""){
			$sql .= "$tableName.".$q['_fields'] ;
		}else{
			$sql .= "$tableName.*";
		}

		return $sql." $this->appendSelect from ".$tableName;
	}

	public function parseOrderBySql($q){
		return isset($q['orderby']) && trim($q['orderby']) != "" ? " order by  ".$q['orderby'] : "";
	}

	public function parseWhereSql($prefix,$q,&$params,$tableName = "",$errorNoWhere=false){
		global $TableMapping;
		global $mysql;
		$prefix = trim($prefix);
		$tableName = $tableName == "" ? $this->tableName : $tableName;
		$whereSql = " where 1 = 1 ";
		$hasWhere = false;
		//echo isset($q['id']);
		foreach ($TableMapping[$tableName] as $f) {
			if(isset($q[$f.'Max'])){
				array_push($params, $q[$f.'Max']);
				$whereSql = $whereSql." and $prefix`$f` <= '?' ";
				$hasWhere = true;			
			}
			if(isset($q[$f.'Min'])){
				array_push($params, $q[$f.'Min']);
				$whereSql = $whereSql." and $prefix`$f` >= '?' ";
				$hasWhere = true;
			}
			if(isset($q[$f])){
				$comparator = "=";
				$value = $q[$f];
				if(startWith($value,'!')){
					$comparator = " != ";
					$value = substr($value,1);
				}
				array_push($params, $value);
				$whereSql = $whereSql." and $prefix`$f` $comparator '?' ";
				$hasWhere = true;
			}
			if(isset($q["_".$f])){
				$comparator = "like";
				$key = '_'.$f;
				$value = $q[$key];
				if(startWith($value,'!')){
					$comparator = " not like ";
					$value = substr($value,1);
				}
				array_push($params, $value);
				$whereSql = $whereSql." and $prefix`$f` $comparator '%?%' ";
				$hasWhere = true;
			}
		}
		if($errorNoWhere && !$hasWhere)
			throw new Exception("没有约束条件! no where condition !");
		if(!contains($whereSql,'isDeleted')){
			$whereSql = $whereSql." and $prefix`isDeleted` = 'false' ";
		}
		return $whereSql;
	}

	public function parseUpdateObj($q,$tableName = ""){
		global $TableMapping;
		global $mysql;
		$tableName = $tableName == "" ? $this->tableName : $tableName;
		$obj = array();
		$hasUpdate = false;
		foreach ($TableMapping[$tableName] as $f) {
			if(isset($q["@".$f])){
				$obj[$f] = $q['@'.$f];
				$hasUpdate = true;
			}
		}
		if(!$hasUpdate)
			throw new Exception("没有更新! no update field !");
		$obj['updateTime'] = 'now()';		
		return $obj;
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
		return $this->_get($q,true,$appendWhere);
	}
	private function _get($q,$onlyCount){
		global $TableMapping;
		global $mysql;
		$whereSql = " where 1 = 1 ";
		$orderBy = "";
		$limit = "";
		$params = array();
		$where = $this->parseWhereSql($this->tableName.'.',$q,$params);
		$limit = $this->parseLimitSql($q);
		$orderBy = $this->parseOrderBySql($q);	
		$count = $mysql->DBGetAsOneArray("select count(1) as count from ".$this->tableName.$where.$this->appendWhere.' limit 0,1',$params);

		if($onlyCount){
			return array('status'=>'successful', 'count'=>$count[0],'errMsg' => '');
		}
		$select = $this->parseSelectSql($q);
		$sql = $select.' '.$this->appendJoin.' '.$where.$this->appendWhere.$orderBy.$limit;
		$row = $mysql->DBGetAsMap($sql,$params);
		return array('total'=>$count[0],'data'=>$row);
	}

	/*
		修改
		http://localhost/fd/libs/api.php?action=user.update&name=10&_name=0&-age=123&.title=123
		_开头的where条件,不带_的是需要设值得字段以及要设的值
	*/
	public function update($q){
		global $TableMapping;
		global $mysql;
		$conditionObj = array();
		$where = $this->parseWhereSql('',$q,$conditionObj,null,true);
		$updateObj = $this->parseUpdateObj($q);
		$affect = $mysql->DBUpdate($this->tableName,$updateObj,$where,$conditionObj);
		return array('status'=>'successful','affect'=>$affect, 'errMsg' => '','update'=>$updateObj,'where'=>$conditionObj);
	}

	public function setTableName($tablename){
		global $TableMapping;
		$this->tableName = camelToUnderline($tablename);
		if(!isset($TableMapping[$this->tableName])){
			throw new Exception("could not find $this->tableName in TableMapping");
		}
		$this->fields = $TableMapping[$this->tableName];
		if(!isset($this->fields) || count($this->fields) == 0){
			throw new Exception("table ".$this->tableName."not defined in TableMapping.php");
		}
		return $this;
	}

	public static function getSvc($svcName){
		require_once __ROOT__."/libs/svc/".$svcName."Svc.class.php";
		global $mysql;
		$class = new ReflectionClass($svcName."Svc");
		$fin = $class->newInstanceArgs();
		if(is_subclass_of($fin,'BaseSvc')){
			$fin->setTableName($svcName); 
		}			
		return  $fin;
	}
}
?>