<?php
	require_once "conn.php";
	$ac = explode('.',$_REQUEST["action"]);
	$svcName = $ac[0];
	$action = $ac[1];

	//$res = BaseSvc::getSvc($svcName)->service($action,$_REQUEST);
	$svc = BaseSvc::getSvc($svcName);
	$class = new ReflectionClass($svcName."Svc");
	$res = $class->getMethod($action)->invoke($svc,$_REQUEST);
	if($res == null)
		$res = array('status'=>'successful', 'errMsg' => '');
	if(isset($_REQUEST['debug']) && (isset($res['status']) || isset($res['total']))){
		$res['executedSqls'] = $mysql->executedSqls;
	}
	echo (json_encode($res));
?>