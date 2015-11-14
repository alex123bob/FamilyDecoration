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

		/*数据库编码*/
		const GBK = "GBK";
		const GB2312 = "gb2312";
		const UTF8 = "utf8";
		const UNICODE = "unicode";

		//构造函数，初始化
		public function __construct($hostValue = 'localhost',$userValue = 'root',$passwordValue, $dbValue='', $encodeValue=''){
			$this->dbHost = $hostValue;
			$this->dbUser = $userValue;
			$this->dbPassword = $passwordValue;
			$this->dbSelect = $dbValue;
			//编码的选择
			if (strcasecmp($encodeValue,self::GBK) == 0)		//忽略大小写的比较
				$this->dbEncode = self::GBK;
			if (strcasecmp($encodeValue,self::GB2312) == 0)
				$this->dbEncode = self::GB2312;
			if (strcasecmp($encodeValue,self::UTF8) == 0)
				$this->dbEncode = self::UTF8;
			if (strcasecmp($encodeValue,self::UNICODE) == 0)
				$this->dbEncode = self::UNICODE;
			$this->DBConnect();
		}

		public function DBGetConnection (){
			return $this->dbConn;
		}

		//连接数据库函数
		public function DBConnect(){
			$this->dbConn = mysqli_connect($this->dbHost,$this->dbUser,$this->dbPassword, $this->dbSelect);		//打开一个到 MySQL 服务器的连接
			if (!$this->dbConn)		//如果没有数据库连接的标志
				throw new Exception("database connect error !");
			// if (!mysql_select_db($this->dbSelect, $this->dbConn))	//选择连接的数据库，如果没有连接的数据库和连接标志
			// 	throw new Exception("database open error !");
			mysqli_query($this->dbConn, "SET NAMES '".$this->dbEncode."'");			//连接数据库的编码方式，mysql_query表示发送一条mysql查询
		}

		//执行数据库语句的基本方法，具体的操作都要调用该基本操作
		public function DBExecute($sqlValue){
			//先判断是否连接，如果没连接先连接
			if (!$this->dbConn)
				$this->DBConnect();
			//将传递进来的SQL语句进行一个赋值
			$this->dbSQL = $sqlValue;
			//然后执行SQL语句
			if (!$this->dbResult = mysqli_query($this->dbConn, $this->dbSQL))
				$this->DBOutputErrorInfo();
		}

		//不建议使用
		public function DBGetResult(){
			return $this->dbResult;
		}

		//不建议使用
		public function DBSimpleSelect($tableValue){
			$partStr = "SELECT * FROM $tableValue";
			$this->dbSQL = $partStr;
			$this->DBExecute($this->dbSQL);
		}


		//不建议使用
		public function DBGetTotalNumber()
		{
			$this->dbRows = mysqli_num_rows($this->dbResult);   		//获取结果中行的数目
			return $this->dbRows;
		}


		//不建议使用
		public function DBGetFirstRow($tableValue)
		{
			$partStr = "SELECT * FROM $tableValue";
			$this->dbSQL = $partStr;
			$this->DBExecute($this->dbSQL);
			if (mysqli_num_rows($this->dbResult) > 0)
			{
				$partRows = mysqli_fetch_array($this->dbResult, MYSQLI_BOTH);		// 从结果集中取得一行作为关联数组，或数字数组，或二者兼有
				return $partRows;
			}
			else
			{
				return false;
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
				while($partRows = mysqli_fetch_array($this->dbResult,MYSQLI_BOTH))
					$partSomeRows[] = $partRows;
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
					case "boolean":
						$values .= " '".($value?"true":"false")."' ,";
						break;
					case "integer":
						$values .= " ".$value." ,";
						break;
					case "double":
						$values .= $value.",";
						break;
					case "NULL":
						$values .= " null ,";
						break;
					case "string":
						if(strtolower($value) == "now()"){
							$values .= " now() ,";
						}else{
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
						$sql .= "null,";
						break;
					case "string":
						if(strtolower($value) == "now()"){
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
				$condition = str_replace_once($condition,"?",$value);
			}
			if($condition != "" && trim($condition) != "")
				$sql .= " where ".$condition;
			$this->dbSQL = $sql;
			$this->DBExecute($this->dbSQL);
		}
		
		//创建新的数据库
		public function DBCreateDatabase($databaseValue){
			$partStr = "CREATE DATABASE $databaseValue";
			$this->dbSQL = $partStr;
			$this->DBExecute($this->dbSQL);
		}

		//删除操作
		public function DBDelete($tableValue, $conditionValue){
			$partStr = "DELETE FROM $tableValue WHERE $conditionValue";
			$this->dbSQL = $partStr;
			$this->DBExecute($this->dbSQL);
		}

		//利用系统自带的call方法吸收错误的方法，参数$errorMethodValue错误的方法，参数$errorValue是错误的值
		//该方法产生的错误的值是以数组的形式呈现出来的，所以打印错误的值的时候利用print_r()函数
		public function __call($errorMethodValue, $errorValue){
			echo "错误的方法是：".$errorMethodValue;
			echo "错误的值是：".print_r($errorValue);
		}

		/**
		 * 用于处理错误的信息进行一个输出
		 */
		 public function DBOutputErrorInfo() {
			$errorMsg = mysql_error();
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
			if (defined("SAE_MYSQL_HOST_M")) {
				$mysql = new mysql(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS, SAE_MYSQL_DB, 'utf8');
			} else {
				$fp = fopen($fileName, "ab");
				fwrite($fp, $inputStr);
				fclose($fp);
			}		
			throw new Exception($errorMsg);			
			exit();
		 }

		//关闭操作
		public function DBClose(){
			mysql_close($this->dbConn);
		}
	}
?>