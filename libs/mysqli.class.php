<?php
/*
		类内部的变量成员都以db开头；
		类内部的方法成员都以DB开头；（构造函数等PHP已经定义的除外）
		方法内部的局部变量都以part开头；
		方法的参数都以Value结尾；
		常量都大写；
		变量名都是开头小写，方法名都是开头大写；
*/
	class mysql
	{
		private $transitionCount = 0;  //事务计数

		private $dbHost;            //数据库主机

		private $dbUser;           //数据库用户名

		private $dbPassword;      //数据库连接密码

		private $dbConn;          //连接标志

		private $dbSelect;        //所选择连接的数据库

		private $dbSQL;           //所要执行的SQL语句

		private $dbResult;        //执行mysql_query()函数后产生的结果

		private $dbFields;        //数据库中的某个字段

		private $dbRows;          //返回的数据库中某个结果集的总条数

		private $dbTable;         //选择的数据库中的表的名称

		private $dbEncode;        //进行数据库操作选择的编码

		private $port;

		public $executedSqls = array();
		/*数据库编码*/
		const GBK = "GBK";
		const GB2312 = "gb2312";
		const UTF8 = "utf8";
		const UNICODE = "unicode";

		//构造函数，初始化
		public function __construct($hostValue = 'localhost',$userValue = 'root',$passwordValue, $dbValue='', $encodeValue='',$port = 3306){
			$this->dbHost = $hostValue;
			$this->dbUser = $userValue;
			$this->dbPassword = $passwordValue;
			$this->dbSelect = $dbValue;
			$this->port = $port;
			//编码的选择
			if (strcasecmp($encodeValue,self::GBK) == 0)		//忽略大小写的比较
				$this->dbEncode = self::GBK;
			if (strcasecmp($encodeValue,self::GB2312) == 0)
				$this->dbEncode = self::GB2312;
			if (strcasecmp($encodeValue,self::UTF8) == 0)
				$this->dbEncode = self::UTF8;
			if (strcasecmp($encodeValue,self::UNICODE) == 0)
				$this->dbEncode = self::UNICODE;
			$this->dbConn = mysqli_connect($this->dbHost,$this->dbUser,$this->dbPassword, $this->dbSelect,$this->port);		//打开一个到 MySQL 服务器的连接
			if (!$this->dbConn)		//如果没有数据库连接的标志
				throw new Exception("database connect error !");
			mysqli_query($this->dbConn, "SET NAMES '".$this->dbEncode."'");			//连接数据库的编码方式，mysql_query表示发送一条mysql查询
		}
		/**
		单事务：
			$mysql->begin();
			....
			....
			$mysql->commit(); or $mysql->rollback();
		如果发生异常。 自动rollback; 不需要try catch rollback，除非业务上有逻辑判断需要rollback，否则一般不用显式调用rollback函数

		嵌套事务： //咱不做支持
			内部事务开始方法，只创建还原点。
			内部事务提交方法不做操作。防止破坏外部事务原子性
			内部事务rollback只还原到还原点
			内部事务异常,以下两种写法：
			-----------------------------------------------------------------------			
			$bSvc = BaseSvc:getSvc('BSvc');
			$mysql->begin();
			...
			...
			$bSvc->xxx();    //这种写法，内部报异常，会rollback外部事务。
			...
			...
			$mysql->commit();
			------------------------------------------------------------------------
			$bSvc = BaseSvc:getSvc('BSvc');
			$mysql->begin();
			$outterTransactionLevel = $mysql->getTransactionLevel();
			...
			...
			try{
				$bSvc->xxx();   //内部异常，不想让它影响到外部事务。
			}catch(Exception $e){
				if($outterTransactionLevel < $mysql->getTransactionLevel()){
					$mysql->rollback(); //说明内部有事务，要返回。cacth中只回滚bSvc中事务。
				}else if($outterTransactionLevel == $mysql->getTransactionLevel()){
					//说明内部没有事务。
				}else{
					//说明内部没多提交/回滚了事务。 有代码bug
					throw new Exception("有bug！");
				}				
			}
			...
			...
			$mysql->commit();
			--------------------------------------------------------------------------
			



		**/
		public function DBGetConnection (){
			return $this->dbConn;
		}

		public function isTransactions(){
			return $this->transitionCount > 0;
		}

		public function getTransactionLevel(){
			return $this->transitionCount;
		}

		//开始事务
		public function begin(){
			if($this->transitionCount++ == 0){
				$this->DBExecute("begin;");
			}else{
				throw new Exception('暂不支持潜逃事务');
				$this->DBExecute("savepoint sp".$this->transitionCount);
			}
		}

		//回滚事务
		//参数isAll 是否回滚所有有嵌套事务
		public function rollback($isAll = false){
			if($this->transitionCount == 0)
				throw new Exception("no transition!");
			if($isAll || $this->transitionCount == 1){
				$this->DBExecute("rollback;");
				$this->transitionCount = 0;
			}else{
				$this->DBExecute("rollback to sp$this->transitionCount;");
				$this->transitionCount --;
			}
		}

		//提交事务，如果是嵌套事务，外层事务回滚，内层事务也将会被回滚
		//参数isAll 是否提交所有嵌套事务
		public function commit($isAll = false){
			if($this->transitionCount == 0)
				throw new Exception("no transition!");
			if($isAll || $this->transitionCount == 1){
				$this->DBExecute("commit;");
				$this->transitionCount = 0;
			}else{
				$this->transitionCount --;
			}
		}

		//执行数据库语句的基本方法，具体的操作都要调用该基本操作
		public function DBExecute($sqlValue){
			//将传递进来的SQL语句进行一个赋值
			array_push($this->executedSqls,"($this->transitionCount)$sqlValue");
			$this->dbSQL = $sqlValue;
			//然后执行SQL语句
			if (!$this->dbResult = mysqli_query($this->dbConn, $this->dbSQL)){
				$errorMsg = mysql_error();
				if($errorMsg == "")
					$errorMsg = $this->dbConn->error." sql:".$this->dbSQL;
				if(contains($errorMsg,'Duplicate entry')){
					$ems = str_replace('Duplicate entry','已经存在',$errorMsg);
					$ems = substr($ems,0,stripos($ems,' for key'));
					throw new Exception($ems);
				}
				
				$pathArray = parse_url($_SERVER['REQUEST_URI']);
				$fileTemp = substr($pathArray['path'], (strrpos($pathArray['path'], "/")+1));
				$fileName = "errors-on-".$fileTemp.".txt";
				$inputStr = "【Error】 ".$this->dbSQL."\r\n";
				$inputStr.= "【Time】  ".date("Y-m-d H:i:s")."\r\n";
				$inputStr.= "【Meg】   $errorMsg\r\n\r\n";
				throw new Exception($errorMsg);			
				exit();
			}
			
		}

		//不建议使用
		public function DBGetAllRows($tableValue, $fieldsValue = '*', $order = ""){
			$partStr = "SELECT $fieldsValue FROM $tableValue";
			if ($order) {
				$partStr .= $order;
			}
			$this->dbSQL = $partStr;
			$this->DBExecute($this->dbSQL);
			if (mysqli_num_rows($this->dbResult) > 0) {
				while($partRows = mysqli_fetch_array($this->dbResult, MYSQLI_BOTH)){
					$partAllRows[] = $partRows;
				}
				return $partAllRows;
			} else {
				return array();
			}
		}

		//不建议使用
		public function DBGetOneRow($tableValue, $fieldsValue = '*', $conditionValue = '')
		{
			$partStr = "SELECT $fieldsValue FROM $tableValue";
			$conditionValue = " WHERE ".$conditionValue;			//加入的条件词语
			$partStr .= $conditionValue;
			$this->dbSQL = $partStr;
			$this->DBExecute($this->dbSQL);

			if (mysqli_num_rows($this->dbResult) > 0)
			{
				$partRows = mysqli_fetch_array($this->dbResult, MYSQLI_BOTH);
				return $partRows;
			}
			else
			{
				return false;
			}
		}

		//不建议使用
		public function DBGetSomeRows($tableValue, $fieldsValue = '*', $conditionValue = '', $order = ""){
			$partStr = "SELECT $fieldsValue FROM $tableValue $conditionValue";
			if ($order)
				$partStr .= $order;
			$this->dbSQL = $partStr;
			$this->DBExecute($this->dbSQL);

			if (mysqli_num_rows($this->dbResult) > 0){
				while($partRows = mysqli_fetch_array($this->dbResult, MYSQLI_BOTH))
					$partSomeRows[] = $partRows;
				return $partSomeRows;
			}
			return array();
		}
		/**
		DBGetAsKeyValueList("select xxx as k, xxx as v from xxx where id = '?' and xxx = '?' and xxx like '%?%' ",arg1,arg2,arg3);
		or DBGetAsKeyValueList("select xxx as k, xxx as v from xxx where id = '?' and xxx = '?' and xxx like '%?%' ",array(arg1,arg2,arg3);
		**/
		public function DBGetAsKeyValueList($sql){
			$count = substr_count($sql,"?");
			$count2 = func_num_args() - 1;
			$paramArray = null;
			if($count2 == 1 && is_array(func_get_arg(1))){
				// param passed as array
				$paramArray = func_get_arg(1);
				$count2 = count($paramArray);
				if($count > $count2)
					throw new Exception("sql:$sql need $count values but get $count2 !");
			}else if($count > $count2){
				throw new Exception("sql:$sql need $count values but get $count2 !");
			}
			$i = 0;
			$index = 0;
			for(;$i<$count;$i++){
				$value = $paramArray === null ? func_get_arg($i+1) : $paramArray[$i];
				$type = gettype($value);
				switch($type){
					case "boolean":
						$value = ($value ? "true" : "false");
						break;
					case "integer":
					case "NULL":
					case "double":
						break;
					case "string":
						$value = myStrEscape($value);
						break;
					default:
						throw new Exception("unknown type:".$type." of value:".$value);
						break;
				}
				$sql = str_replace_once($sql,"?",$value);
			}
			$this->dbSQL = $sql;
			$this->DBExecute($this->dbSQL);
			$res = array();
			if (mysqli_num_rows($this->dbResult) > 0){
				while($partRows = mysqli_fetch_array($this->dbResult,MYSQLI_ASSOC)){
					$res[$partRows['k']] = $partRows['v'];
				}
				return $res;
			}
			return $res;
		}
		/**
		DBGetAsMap("select * from xxx where id = '?' and xxx = '?' and xxx like '%?%' ",arg1,arg2,arg3);
		or DBGetAsMap("select * from xxx where id = '?' and xxx = '?' and xxx like '%?%' ",array(arg1,arg2,arg3);
		**/
		public function DBGetAsMap($sql){
			$count = substr_count($sql,"?");
			$count2 = func_num_args() - 1;
			$paramArray = null;
			if($count2 == 1 && is_array(func_get_arg(1))){
				// param passed as array
				$paramArray = func_get_arg(1);
				$count2 = count($paramArray);
				if($count > $count2)
					throw new Exception("sql:$sql need $count values but get $count2 !");
			}else if($count > $count2){
				throw new Exception("sql:$sql need $count values but get $count2 !");
			}
			$i = 0;
			$index = 0;
			for(;$i<$count;$i++){
				$value = $paramArray === null ? func_get_arg($i+1) : $paramArray[$i];
				$type = gettype($value);
				switch($type){
					case "boolean":
						$value = ($value ? "true" : "false");
						break;
					case "integer":
					case "NULL":
					case "double":
						break;
					case "string":
						$value = myStrEscape($value);
						break;
					default:
						throw new Exception("unknown type:".$type." of value:".$value);
						break;
				}
				$sql = str_replace_once($sql,"?",$value);
			}
			$this->dbSQL = $sql;
			$this->DBExecute($this->dbSQL);
			if (mysqli_num_rows($this->dbResult) > 0){
				while($partRows = mysqli_fetch_array($this->dbResult,MYSQLI_ASSOC)){
					$partSomeRows[] = $partRows;
				}
				return $partSomeRows;
			}
			return array();
		}
		/**
		DBGetAsOneArray("select name from xxx where id = '?' and xxx = '?' and xxx like '%?%' ",arg1,arg2,arg3);
		or DBGetAsOneArray("select name from xxx where id = '?' and xxx = '?' and xxx like '%?%' ",array(arg1,arg2,arg3);
		**/
		public function DBGetAsOneArray($sql){
			$count = substr_count($sql,"?");
			$count2 = func_num_args() - 1;
			$paramArray = null;
			if($count2 == 1 && is_array(func_get_arg(1))){
				// param passed as array
				$paramArray = func_get_arg(1);
				$count2 = count($paramArray);
				if($count > $count2)
					throw new Exception("sql:$sql need $count values but get $count2 !");
			}else if($count > $count2){
				throw new Exception("sql:$sql need $count values but get $count2 !");
			}
			$i = 0;
			$index = 0;
			for(;$i<$count;$i++){
				$value = $paramArray === null ? func_get_arg($i+1) : $paramArray[$i];
				$type = gettype($value);
				switch($type){
					case "boolean":
						$value = ($value ? "true" : "false");
						break;
					case "integer":
					case "NULL":
					case "double":
						break;
					case "string":
						$value = myStrEscape($value);
						break;
					default:
						throw new Exception("unknown type:".$type." of value:".$value);
						break;
				}
				$sql = str_replace_once($sql,"?",$value);
			}
			$this->dbSQL = $sql;
			$this->DBExecute($this->dbSQL);
			$partSomeRows = array();
			if (mysqli_num_rows($this->dbResult) > 0){
				while($partRows = mysqli_fetch_array($this->dbResult,MYSQLI_NUM))
					$partSomeRows = array_merge($partSomeRows,$partRows);
				return $partSomeRows;
			}
			return array();
		}

		public function DBInsertAsArray($tableValue, $obj){		//表名，字段数组，内容数组
			//foreach 实际上是HashTable实现的，按照添加顺序遍历，for才按索引
			//http://www.nowamagic.net/academy/detail/1204411
			$sql = "INSERT INTO $tableValue ( ";
			$keys = "";
			$values = "";
			foreach ( $obj as $key => $value){
				$keys .= " `$key` ,";
				$type = gettype($value);
				switch($type){
					case "array":

						throw new Exception("array not supportted !:".$type." key:".$key);
						break;
					case "boolean":
						$values .= " '".($value?"true":"false")."' ,";
						break;
					case "integer":
					case "double":
						$values .= round($value,3).",";
						break;
					case "NULL":
						$values .= $value." null,";
						break;
					case "string":
						if(strtolower($value) == "null") {
							$values .= " null,";
						}
						else if(strtolower($value) == "now()"){
							$values .= " now(),";
						}
						else{
							$values .= " '".myStrEscape($value)."' ,";
						}
						break;
					default:
						throw new Exception("unknown type:".$type." of value:".$value." key:".$key);
						break;
				}
			}
			$keys = substr($keys, 0, -1);
			$values = substr($values, 0, -1);
			$sql .= "$keys ) values ( $values );";
			$this->dbSQL = $sql;
			$this->DBExecute($this->dbSQL);
		}
		
		//更新操作（参数$setValue是更新操作的值，例如"user = 'abc',name='cde'"等样子，中间要以逗号隔开），不是数字类型的字段，更新后的值要加引号
		//这个用于更新多个字段数据，即多列
		public function DBUpdate($tableValue, $obj, $condition , $conditionValues = null){
			if(!contains($tableValue,"`"))
				$tableValue = '`'.$tableValue.'`';
			$sql = " update $tableValue SET ";
			foreach($obj as $key => $value){
				$sql .= " `$key`=";
				$type = gettype($value);
				switch($type){
					case "boolean":
						$sql .= "'".($value ? "true" : "false")."',";
						break;
					case "integer":
						$sql .= $value.",";
						break;
					case "double":
						$sql .= $value.",";
						break;
					case "NULL":
						$sql .= $value." null,";
						break;
					case "string":
						if(strtolower($value) == "null") {
							$sql .= "null,";
						}
						else if(strtolower($value) == "now()"){
							$sql .= "now(),";
						}else{
							$sql .= "'".myStrEscape($value)."',";
						}
						break;
					default:
						throw new Exception("unknown type:".$type." of value:".$value." key:".$key);
						break;
				}
			}
			$sql = substr($sql, 0, -1);
			$count = substr_count($condition,"?");
			$count2 = count($conditionValues);
			if($count != $count2){
				throw new Exception("sql:$condition need $count values but get $count2 !");
			}
			$i = 0;
			$index = 0;
			for(;$i<$count;$i++){
				$value = $conditionValues[$i];
				$type = gettype($value);
				switch($type){
					case "boolean":
						$value = ($value ? "true" : "false");
						break;
					case "integer":
					case "double":
						break;
					case "string":
						$value = myStrEscape($value);
						break;
					default:
						throw new Exception("unknown type:".$type." of value:".$value);
						break;
				}
				$condition = str_replace_once($condition,"?",$value);
			}
			if($condition != "" && trim($condition) != ""){
				$sql .= (contains($condition,"where") ? "" : " where " ).$condition;
			}
			$this->dbSQL = $sql;
			$this->DBExecute($this->dbSQL);
			if($this->dbResult){
				return mysqli_affected_rows($this->dbConn);
			}else{
				return -1;
			}
		}

		//利用系统自带的call方法吸收错误的方法，参数$errorMethodValue错误的方法，参数$errorValue是错误的值
		//该方法产生的错误的值是以数组的形式呈现出来的，所以打印错误的值的时候利用print_r()函数
		public function __call($errorMethodValue, $errorValue){
			echo "错误的方法是：".$errorMethodValue;
			echo "错误的值是：".print_r($errorValue);
		}
	}
?>