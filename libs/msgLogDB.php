<?php
	function getValue($str,$key){
		// get value from string like:<response><error>0</error><message>1.7</message></response>
		// for example getValue($str,"error") will return 0;
		$begin = strpos($str,"<$key>");
		$end = strpos($str,"</$key>");
		if($begin === false || $end === false)
			throw new Exception("no key named $key from $str");
		$keyLen = strlen($key)+2;
		$value = substr($str,$begin+$keyLen,$end - $begin - $keyLen);
		return $value;
	}
	
	function checkMsg($content){
		global $BlackListWords;
		foreach($BlackListWords as $blackWord){
			if(contains($content,$blackWord))
				throw new Exception("含有非法内容：".$blackWord);
		}
		return array('status'=>'successful', 'checked' => 'true');
	}
	function sendMsg($sender,$reciever,$recieverPhone,$content,$sendtime){
		global $mysql,$userAndPswd,$corpName,$apiUrl,$MsgErrorCode,$BlackListWords;
		foreach($BlackListWords as $blackWord){
			if(contains($content,$blackWord))
				return array('status'=>'successful', 'errMsg' => "含有非法内容：".$blackWord);
		}
		$content = $corpName.$content;
		$action = $sendtime == null ? "sendsms.action?" : "sendtimesms.action";
		$url = $apiUrl.$action.$userAndPswd."&phone=$recieverPhone&message=".urlencode($content)."&sendtime=$sendtime";
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10) ; // timeout  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回  
		curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ; // 在启用 CURLOPT_RETURNTRANSFER 时候将获取数据返回
		$res = curl_exec($ch);
		if($res == false){
			throw new Exception("向短信提供商请求失败！");
		}else{
			$error = getValue($res,"error");
			$message = isset($MsgErrorCode[$error]) ? $MsgErrorCode[$error] : "未知";
			$obj = array(
				"id" => date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
				"sender"=>$sender,
				"reciever"=>$reciever,
				"recieverPhone"=>$recieverPhone,
				"status"=>$error,
				"result"=>$message,
				"content"=>$content
			);
			$mysql->DBInsertAsArray('msg_log',$obj);
			if($error != "0") throw new Exception("错误代码:".$error." ".$message);
		}		
		return array('status'=>'successful', 'errMsg' => '');
	}
	function getBalance(){
		global $mysql,$userAndPswd,$corpName,$apiUrl;
		$url = $apiUrl."querybalance.action?".$userAndPswd;
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
		$res = curl_exec($ch);
		if($res == false){
			throw new Exception("向短信提供商请求失败！");
		}else{
			$error = getValue($res,"error");
			$balance = getValue($res,"message");
			$mysql->DBUpdate('system',array('paramValue'=>$balance),"`id` = '8' ");
			return array('status'=>'successful', 'balance' => $balance);
		}
	}
	function syncWithMsgVendorServer(){
		global $mysql,$userAndPswd,$corpName,$apiUrl;
		$url = $apiUrl."getmo.action?".$userAndPswd;
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
		$res = curl_exec($ch);
		if($res == false)
			throw new Exception("向短信提供商请求失败！");
		$revCount =0;
		//result data examples:
		/* <?xml version="1.0" encoding="UTF-8"?\><response><error>0</error><message></message></response>*/
		/*
		<?xml version="1.0" encoding="UTF-8"?>
		<response>
			<error>0</error>
			<message><srctermid>13057530560</srctermid><sendTime>20150513131133</sendTime><msgcontent>1</msgcontent><addSerial></addSerial><addSerialRev>912574</addSerialRev></message>
			<message><srctermid>13057530560</srctermid><sendTime>20150513131137</sendTime><msgcontent>2</msgcontent><addSerial></addSerial><addSerialRev>912574</addSerialRev></message>
		</response>
		<?xml version="1.0" encoding="UTF-8"?><response><error>0</error><message><srctermid>13057530560</srctermid><sendTime>20150513131133</sendTime><msgcontent>1</msgcontent><addSerial></addSerial><addSerialRev>912574</addSerialRev></message><message><srctermid>13057530560</srctermid><sendTime>20150513131137</sendTime><msgcontent>2</msgcontent><addSerial></addSerial><addSerialRev>912574</addSerialRev></message></response>
		*/
		/* 
			no message
			$res = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><response><error>0</error><message></message></response>"; 
		*/
		/*	one message
			$res = "<?xml version=\"1.0\" encoding=\"UTF-8\"?\><response><error>0</error><message><srctermid>13057530560</srctermid><sendTime>20150513131133</sendTime><msgcontent>1</msgcontent><addSerial></addSerial><addSerialRev>912574</addSerialRev></message></response>"; 
		*/
		/*  two(multi) message
			$res = "<?xml version=\"1.0\" encoding=\"UTF-8\"?\><response><error>0</error><message><srctermid>13057530560</srctermid><sendTime>20150513131133</sendTime><msgcontent>1</msgcontent><addSerial></addSerial><addSerialRev>912574</addSerialRev></message><message><srctermid>13057530560</srctermid><sendTime>20150513131137</sendTime><msgcontent>2</msgcontent><addSerial></addSerial><addSerialRev>912574</addSerialRev></message></response>"; 
		*/
		$messages = explode("</message><message>",$res);
		foreach($messages as $msg){
			try{
				$phone = getValue($res,"srctermid");
				$user = $mysql->DBGetAsOneArray("select realName from user where phone like '%$phone%'  and isDeleted = 'false' ");
				$obj = array(
					"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
					"sender"=>count($user) > 0 ? $user[0] : "unkown",
					"senderPhone"=>$phone,
					"content"=>getValue($res,"msgcontent"),
					"sendTime"=>getValue($res,"sendTime"),
				);
			}catch(Exception $e){
				continue;
			}
			$revCount++;
			$mysql->DBInsertAsArray('msg_recieve_log',$obj);
		}
		return array('status'=>'successful','revCount'=>$revCount);
	}
	
	function getsendmsgs($sender,$reciever,$recieverPhone,$status,$beginTime,$endTime,$page,$size){
		global $mysql;
		$sql = "select * from msg_log ";
		$sqlCount = "select count(*) as count from msg_log ";
		$where = " where createTime >= '$beginTime' and createTime <= '$endTime' ";

		if($sender != null)$where .= " and sender = '$sender' ";
		if($status != null)$where .= " and status = '$status' ";
		if($reciever != null)$where .= " and reciever = '$reciever' ";
		if($recieverPhone != null)$where .= " and recieverPhone = '$recieverPhone' ";
	
		$limit = " limit $size offset ".($size*($page-1));
		
		$data = $mysql->DBGetAsMap($sql.$where.$limit);
		$count = $mysql->DBGetAsOneArray($sqlCount.$where);
		return array('status'=>'successful',"data"=>$data,"total"=>$count[0]);
	}
	
	function getrecvmsgs($sender,$phone,$beginTime,$endTime,$page,$size){
		global $mysql;
		$sql = "select * from msg_recieve_log ";
		$sqlCount = "select count(*) as count from msg_recieve_log ";
		$where = " where createTime >= '$beginTime' and createTime <= '$endTime' ";

		if($sender != null)$where .= " and sender = '$sender' ";
		if($phone != null)$where .= " and senderPhone = '$phone' ";
	
		$limit = " limit $size offset ".($size*($page-1));
		
		$data = $mysql->DBGetAsMap($sql.$where.$limit);
		$count = $mysql->DBGetAsOneArray($sqlCount.$where);
		return array('status'=>'successful',"data"=>$data,"total"=>$count[0]);
	}
?>