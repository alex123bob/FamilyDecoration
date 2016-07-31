<?php
	require_once "conn.php";
	$ac = explode('.',$_REQUEST["action"]);
	$svcName = $ac[0];
	$action = strtolower($ac[1]);
	$fin = BaseSvc::getSvc($svcName);
	$class = new ReflectionClass($fin);//建立 Person这个类的反射类  
	$methods=$class->getmethods();  //获取Person 类中的getName方法 
	$found = false;
	$res = array('status'=>'successful', 'errMsg' => '');
	foreach($methods as $method){
		if(strtolower($method->getName()) == $action){
			$res = $class->getMethod($method->getName())->invoke($fin,$_REQUEST);
			$found = true;
			break;				
		}
	}
	if($res == null)
		$res = array('status'=>'successful', 'errMsg' => '');
	if(!$found)
		throw new Exception("unknown action:".$action);
	if(isset($_REQUEST['debug'])){
		global $mysql;
		$res['executedSqls'] = $mysql->executedSqls;
	}
	echo (json_encode($res));
?>