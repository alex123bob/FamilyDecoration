<?php
	/**
	 * @desc Common operations including functions and operations.
	 * @auth Diego & Alex
	 */

	function ErrorHandler($errno, $errstr){ 
		$result = array("status" => "failing","errMsg" =>"[$errno]:$errstr");
		echo json_encode($result);
		die();
	}
	function ExceptionHandler($e){
		$result = array("status" => "failing","errMsg" =>$e->getMessage());
		echo json_encode($result);
		die();
	}
	function str2GBK($str){
		$res = '';
		$res = is_null($str) ? "" : iconv("UTF-8","GB2312//IGNORE",$str);
		return $res;
	};
	set_error_handler("ErrorHandler");
	set_exception_handler("ExceptionHandler");
?>
	
	