<?php
	/**
	 * @desc Common operations including functions and operations.
	 * @auth Diego & Alex
	 */
	function ErrorHandler($errno, $errstr,$errorFile,$errorLine,$errorType = 0){
		$errstr = str_replace("Undefined index:","缺少参数:",$errstr);
		$popupMsg = $errstr;
		if(contains($errstr,'imagecreatefromjpeg')){
			$popupMsg = "图片压缩失败，请确认上传图片为jpg格式\n(直接把名字改成某某某.jpg是不行的哦)";
		}
		global $mysql;
		try{
			if($mysql != null && $mysql->isTransactions()){
				$mysql->rollback(true);
			}	
		}catch(Exception $e){}
		$error = array('@file'=>$errorFile,
							'@line'=>$errorLine,
							'@detail'=>$errstr,
							'@type'=>$errorType,
							'@params'=>json_encode($_POST),
							'@user'=>isset($_SESSION['name']) ? $_SESSION['name'] : '',
							'@url'=>"http://".$_SERVER["HTTP_HOST"] . ":" . $_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"],
							'@ip'=>isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '',
							'@refer'=>isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '',
							'@useragent'=>isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '');
		try{
			BaseSvc::getSvc('ErrorLog')->add($error);
		}catch(Exception $e){
			//var_dump($e);
		}
		$errorType= 0;
		try{
			//非业务异常，邮件通知
			if($errorType != 1){
				$mailSvc = BaseSvc::getSvc('Mail');
				$mailContent = '有系统异常啦！<br />'.json_encode($error);
				$mailSvc->add(array('@mailSubject'=>'有系统异常啦！','@mailContent'=>$mailContent,'@mailSender'=>'系统提醒','@mailReceiver'=>'674417307@qq.com','@receiverAddress'=>'674417307@qq.com'));
				$mailSvc->add(array('@mailSubject'=>'有系统异常啦！','@mailContent'=>$mailContent,'@mailSender'=>'系统提醒','@mailReceiver'=>'547010762@qq.com','@receiverAddress'=>'547010762@qq.com'));
			}
		}catch(Exception $e){
			//var_dump($e);
		}
		$res = array(
			'status'=>'failing',
			'line'=>$errorLine,
			'errMsg'=>$popupMsg,
			'file'=>$errorFile
			);
		if(isset($_REQUEST['debug'])){
			$res['executedSqls'] = $mysql->executedSqls;
		}
		echo (json_encode($res));
		die();
	}
	
	function ExceptionHandler($e){
		$errorCode = $e instanceof BaseException ? 1 : 0;
		ErrorHandler(-1,$e->getMessage(),$e->getTraceAsString(),'',$errorCode);
	}

	function getClientIp(){
		if(getenv('HTTP_CLIENT_IP')) { 
			$onlineip = getenv('HTTP_CLIENT_IP');
		}elseif(getenv('HTTP_X_FORWARDED_FOR')) { 
			$onlineip = getenv('HTTP_X_FORWARDED_FOR');
		}elseif(getenv('REMOTE_ADDR')) { 
			$onlineip = getenv('REMOTE_ADDR');
		} else { 
			$onlineip = $_SERVER['REMOTE_ADDR'];
		}
		return $onlineip;
	}
	function startWith($str, $needle) {
        return strpos($str, $needle) === 0;
	}
	function endWith($haystack, $needle) {   
		$length = strlen($needle);  
      	if($length == 0)    
        	return true;
      	return (substr($haystack, -$length) === $needle);
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
			throw new BaseException("未登陆！");
		}
		$sessionId = session_id();
		$userName = $_SESSION["name"];
		$res = $mysql->DBGetOneRow("`online_user`", "count(*) as count", "`userName` = '$userName'  and `sessionId` = '$sessionId' and `offlineTime` is null ");
		if($res["count"] != 1){
			header('HTTP/1.1 401 already login else');
			session_unset();
			session_destroy();
			throw new BaseException($userName."已在别处登陆！");
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
		global $mysql;
		if(is_array($arg)){
			foreach($arg as $key => $val){
				$arg[$key] = mysqli_real_escape_string($mysql->DBGetConnection(), $val);;
			}
		}else{
			$arg = mysqli_real_escape_string($mysql->DBGetConnection(), $arg);
		}
		return $arg;
	}
	//微妙时间
	function microtime_float()
	{
	    list($usec, $sec) = explode(" ", microtime());
	    return ((float)$usec + (float)$sec);
	}
	//微妙时间
	function microtime_float2()
	{
	    list($usec, $sec) = explode(" ", microtime());
	    return (int)($usec*1000);
	}
	 
	//将下划线命名转换为驼峰式命名
	function underlineToCamel ( $str , $ucfirst = true){
	     $str = ucwords(str_replace('_', ' ', $str));
   		 $str = str_replace(' ','',lcfirst($str));
     	return $ucfirst ? ucfirst($str) : $str;
	}
	//驼峰命名法转下划线风格
    function camelToUnderline($str){
        $array = array();
        for($i=0;$i<strlen($str);$i++){
            if($str[$i] == strtolower($str[$i])){
                $array[] = $str[$i];
            }else{
                if($i>0){
                    $array[] = '_';
                }
                $array[] = strtolower($str[$i]);
            }
        }
        
        $result = implode('',$array);
        return $result;
    }
    /*
	从数组中取部分字段
	如[{a:1,b:1,c:1},{a:1,b:1,c:1},{a:1,b:1,c:1},{a:1,b:1,c:1}]
	执行array_get($array,'a')
	返回
	[{a:1},{a:1},{a:1}]
    */
    function array_get($array){
		$count = func_num_args() - 1;
		$requiredField = array();
		$res = array();
		for ($i = 0;$i<$count;$i++) {
			$requiredField[$count] = func_get_arg(i+1);
		}
		foreach ($array as $key => $value) {
			foreach ($requiredField as $field) {
				$res[$key][$field] = $array[$key][$field];
			}
		}
		return $res;
    }
	/*
	从数组中取部分字段
	如{a:1,b:1,c:1}
	map_get($map,'a')
	返回
	{a:1}
    */
	function map_get($map){
		$count = func_num_args() - 1;
		$res = array();
		for ($i = 0;$i<$count;$i++) {
			$fieldName = func_get_arg(i+1);
			$res[$fieldName] = $map[$fieldName];
		}
		return $res;
    }
	/** 
    *数字金额转换成中文大写金额的函数 
    *String Int  $num  要转换的小写数字或小写字符串 
    *return 大写字母 
    *小数位为两位 
    **/  
    function cny($num){  
        $c1 = "零壹贰叁肆伍陆柒捌玖";  
        $c2 = "分角元拾佰仟万拾佰仟亿";  
        $num = round($num, 2);  
        $num = $num * 100;  
        if (strlen($num) > 10) {  
            return "数据太长，没有这么大的钱吧，检查下";  
        }
        $i = 0;  
        $c = "";  
        while (1) {  
            if ($i == 0) {  
                $n = substr($num, strlen($num)-1, 1);  
            } else {  
                $n = $num % 10;  
            }   
            $p1 = substr($c1, 3 * $n, 3);  
            $p2 = substr($c2, 3 * $i, 3);  
            if ($n != '0' || ($n == '0' && ($p2 == '亿' || $p2 == '万' || $p2 == '元'))) {  
                $c = $p1 . $p2 . $c;  
            } else {  
                $c = $p1 . $c;  
            }   
            $i = $i + 1;  
            $num = $num / 10;  
            $num = (int)$num;  
            if ($num == 0) {  
                break;  
            }   
        }  
        $j = 0;  
        $slen = strlen($c);  
        while ($j < $slen) {  
            $m = substr($c, $j, 6);  
            if ($m == '零元' || $m == '零万' || $m == '零亿' || $m == '零零') {  
                $left = substr($c, 0, $j);  
                $right = substr($c, $j + 3);  
                $c = $left . $right;  
                $j = $j-3;  
                $slen = $slen-3;  
            }   
            $j = $j + 3;  
        }   
  
        if (substr($c, strlen($c)-3, 3) == '零') {  
            $c = substr($c, 0, strlen($c)-3);  
        }  
        if (empty($c)) {  
            return "零元整";  
        }else{  
            return $c . "整";  
        }  
    }
    function notNullCheck($d,$f,$msg =""){
    	if(!isset($d[$f]) || $d[$f] === ""){
    		if($msg == "")
    			$msg = $f." can not be empty";
    		throw new Exception($msg);
    	}
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

function resize_pic($path,$endFix){
	$max = 1280;
	list($width, $height) = getimagesize($path);
	if(strtolower($endFix) !== "jpg" && strtolower($endFix) !== "jpeg"){
		return "$width x $height";
	}
	$im=imagecreatefromjpeg($path);
	if($width<=$max && $height <= $max){
		$newwidth = $width;
		$newheight = $height;
	}else{
		$scale = $width > $height ? $max/$width : $max/$height;
		$newheight = $width > $height ? $height * $scale : $max;
		$newwidth = $width > $height ? $max : $height * $scale;
	}
	$newim = imagecreatetruecolor($newwidth,$newheight);
	imagecopyresampled($newim,$im,0,0,0,0,$newwidth,$newheight,$width,$height);
	imagejpeg($newim,$path);
	imagedestroy($im);
	imagedestroy($newim);
	return "$newwidth x $newheight";
}
?>