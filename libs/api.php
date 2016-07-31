<?php
	require_once "conn.php";
	$ac = explode('.',$_REQUEST["action"]);
	$svcName = $ac[0];
	$action = strtolower($ac[1]);
	$fin = BaseSvc::getSvc($svcName);
	$class = new ReflectionClass($fin);//建立反射类  
	$methods=$class->getmethods();  //获取类中的方法 
	$found = false;
	$res = array('status'=>'successful', 'errMsg' => '');
	foreach($methods as $method){
		if(strtolower($method->getName()) == $action){
			$res = $class->getMethod($method->getName())->invoke($fin,$_REQUEST);
			$found = true;
			break;				
		}
	}
	/* 不需要提交。php结束后会自动提交 做个test
	global $mysql;
	//嵌套事务多层后，例如3层，3个begin,最内层发生异常后rollback只有1个，rollback到最后一个还原点，需要提交。
	if($mysql->isTransactions()){
		$mysql->commit(true);
	}*/
	if($res == null)
		$res = array('status'=>'successful', 'errMsg' => '');
	if(!$found)
		throw new Exception("unknown action:".$action);
	if(isset($_REQUEST['debug']) && (isset($res['status']) || isset($res['total']))){
		$res['executedSqls'] = $mysql->executedSqls;
	}
	echo (json_encode($res));
?>