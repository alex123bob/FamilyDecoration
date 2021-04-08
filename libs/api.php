<?php
	require_once "conn.php";
	$ac = explode('.',$_REQUEST["action"]);
	$svcName = $ac[0];
	$action = $ac[1];
	$beginTime = time();
	//$res = BaseSvc::getSvc($svcName)->service($action,$_REQUEST);
	$svc = BaseSvc::getSvc($svcName);
	$class = new ReflectionClass($svcName."Svc");
	$res = $class->getMethod($action)->invoke($svc,$_REQUEST);
	$endTime = time();
	if($endTime - $beginTime > 5){
		BaseSvc::getSvc('LongRequestLog')->add(array(
			'@url'=>"http://".$_SERVER["HTTP_HOST"] . ":" . $_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"],
			'@user'=>isset($_SESSION['name']) ? $_SESSION['name'] : '',
			'@ip'=>isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '',
			'@useragent'=>isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '',
			'@time'=>($endTime - $beginTime),
			'@params'=>json_encode($_POST)
		));
	}
	if($res == null)
		$res = array('status'=>'successful', 'errMsg' => '');
	if(isset($_REQUEST['debug']) && (isset($res['status']) || isset($res['total']))){
		$res['executedSqls'] = $mysql->executedSqls;
	}
	if(isset($res['data']) && is_array($res['data'])){
		$res['status'] = $res['status'] ?? 'successful';
		foreach ($res['data'] as $key => &$item) {
			if(is_array($item)) {
				foreach ($item as $key => &$value) {
					if(!is_array($value) && ($value == null || $value == '')){
						unset($item[$key]);
					}
				}
			} else {
				if($item == null || $item == ''){
					unset($res['data'][$key]);
				}
			}
			
		}
	}
	echo (json_encode($res));
?>