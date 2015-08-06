<?php
	/**
	 * @desc Common operations including functions and operations.
	 * @auth Diego & Alex
	 */

	function ErrorHandler($errno, $errstr,$errorFile,$errorLine){
		//print_r();
		$result = array("status" => "failing","errMsg" =>"[$errno]:$errstr","file"=>$errorFile,"line"=>$errorLine);
		echo json_encode($result);
		die();
	}
	function ExceptionHandler($e){
		$result = array("status" => "failing","errMsg" =>$e->getMessage(),"file"=>$e->getFile(),"line"=>$e->getLine());
		echo json_encode($result);
		die();
	}
	function startWith($str, $needle) {
        return strpos($str, $needle) === 0;
	}
	function contains($string, $needle) { 
		return false !== strpos($string, $needle); 
	} 
	function str2GBK($str){
		$res = '';
		#$res = is_null($str) ? "" : iconv("UTF-8","GB2312//IGNORE",$str);  //平方米等utf8单位会丢失
		$res = is_null($str) ? "" : mb_convert_encoding($str,"gbk","utf-8");
		return $res;
	};
	set_error_handler("ErrorHandler");
	set_exception_handler("ExceptionHandler");
	
	function getIP (){
		global $_SERVER;
		if (getenv('HTTP_CLIENT_IP')) {
			$ip = getenv('HTTP_CLIENT_IP');
		} else if (getenv('HTTP_X_FORWARDED_FOR')) {
			$ip = getenv('HTTP_X_FORWARDED_FOR');
		} else if (getenv('REMOTE_ADDR')) {
			$ip = getenv('REMOTE_ADDR');
		} else {
			$ip = $_SERVER['REMOTE_ADDR'];
		}
		return $ip;
	}
	function checkUserOnlineUniqueness(){
		global $mysql;
		if (!isset($_SESSION["name"])){
			header('HTTP/1.1 401 not login');
			throw new Exception("未登陆！");
		}
		$sessionId = session_id();
		$userName = $_SESSION["name"];
		$res = $mysql->DBGetOneRow("`online_user`", "count(*) as count", "`userName` = '$userName'  and `sessionId` = '$sessionId' and `offlineTime` is null ");
		if($res["count"] != 1){
			header('HTTP/1.1 401 already login else');
			session_unset();
			session_destroy();
			throw new Exception($userName."已在别处登陆！");
		}
		$mysql->DBUpdate("online_user",array('lastUpdateTime'=>'now()'),"`userName` = '?'  and `sessionId` = '?' and `offlineTime` is null ",array($userName,$sessionId));
		return array("status" => "ok","errMsg" =>"");
	}
	function str_replace_once($haystack,$needle,$replace) {
		$pos = strpos($haystack, $needle);
		if ($pos === false)	return $haystack;
		return substr_replace($haystack, $replace, $pos, strlen($needle));
	}
	function formatNumber($val){
		$tmp = $val;
		if(is_numeric($val)){
			$tmp = round($val,2)."";
			$index = strpos($tmp, ".");
			if(!$index){
				$tmp .= ".00";
			}else if($index + 2== strlen($tmp)){
				$tmp .= "0";
			}else{
				// do nothing;
			}
		}
		return $tmp;		
	}
	function myStrEscape($arg){
		if(is_array($arg)){
			foreach($arg as $key => $val){
				//$val = str_replace("%","%25",$val);
				//$val = str_replace("+","%2B",$val);
				$val = mysql_real_escape_string($val);
				$arg[$key] = $val;
			}
		}else{
			//$arg = str_replace("%","%25",$arg);
			//$arg = str_replace("+","%2B",$arg);
			$arg = mysql_real_escape_string($arg);
		}
		return $arg;
	}
	function ga($data){
		global $mysql;
		$fields = array("userName", "interfaceName");
		$obj = array(
			"userName" => $data["userName"],
			"interfaceName" => $data["interfaceName"]
		);
		$mysql->DBInsertAsArray("`user_behavior`",$obj);
		$res = array('status'=>'successful', 'errMsg' => $data["interfaceName"]);
		echo (json_encode($res));
	}
	$APPBASE = $_SERVER['DOCUMENT_ROOT'];
	if(startWith($_SERVER['PHP_SELF'],'/fd/'))
		$APPBASE = $APPBASE.'/fd';
?>