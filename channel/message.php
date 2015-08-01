<?php
	if (class_exists('SaeChannel')) {
		$channel = new SaeChannel();
		$msg = $_REQUEST['message'];
		$to =  isset($_REQUEST['to']) ? $_REQUEST['to'] : 'publicChannel';
		$to = trim($to);
		$to = $to == "" ? 'publicChannel' : $to;
		$ret = $channel->sendMessage($to,$msg);
		echo "send messageret:$msg to $to <br />$ret";
	}
?>