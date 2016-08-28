<?php
require_once __ROOT__."/libs/svc/MsgErrorCode.php";

class MsgLogSvc extends BaseSvc
{
	/*
		短信类
	*/
	//新增短信入库稍后发送
	public function add($q){
		$q['@id'] = $this->getUUID();
		if (!isset($q['@sender']))
			$q['@sender'] = isset($_SESSION['realname']) ? $_SESSION['realname'] : 'system';
		if (!isset($q['@reciever']) && !isset($q['@recieverPhone'])){
			throw new Exception('收信人和手机号不能同时为空!');
		}
		notNullCheck($q,'@content','短信内容不能为空!');
		$this->checkMsg($q['@content']);

		$userSvc = parent::getSvc('User');
		$sender = $userSvc->getRealNameAndPhone($q['@sender']);
		$reciever = $userSvc->getRealNameAndPhone($q['@reciever']);
		//转换一下用户名，可以传嘉诚装饰，也可以传admin
		$q['@sender'] = $sender['realName'];
		$q['@reciever'] = $reciever['realName'];
		if(!isset($q['@recieverPhone']))
			$q['@recieverPhone'] = $reciever['phone'];
		return parent::add($q);
	}

	//新增短信入库并立即发送
	public function addAndSend($q){
		$res = $this->add($q);
		return $this->sendMsg($res['data']);
	}

	private function getValueFromXml($str,$key){
		global $MsgErrorCode,$BlackListWords,$userAndPswd,$corpName,$apiUrl;
		// get value from string like:<response><error>0</error><message>1.7</message></response>
		// for example $this->getValueFromXml($str,"error") will return 0;
		$begin = strpos($str,"<$key>");
		$end = strpos($str,"</$key>");
		if($begin === false || $end === false)
			throw new Exception("no key named $key from $str");
		$keyLen = strlen($key)+2;
		$value = substr($str,$begin+$keyLen,$end - $begin - $keyLen);
		return $value;
	}
	
	public function checkMsg($content){
		global $MsgErrorCode,$BlackListWords,$userAndPswd,$corpName,$apiUrl;
		foreach($BlackListWords as $blackWord){
			if(contains($content,$blackWord))
				throw new Exception("含有非法内容：".$blackWord);
		}
		return array('status'=>'successful', 'checked' => 'true');
	}

	public function cron(){
		global $MsgErrorCode,$BlackListWords,$userAndPswd,$corpName,$apiUrl,$mysql;
		$texts = $mysql->DBGetAsMap("select * from msg_log where status < 4");  //-1未发送，100发送成功，1~n 发送失败次数
		$mysql->DBExecute("update msg_log set status = status + 1 where status < 4");
		foreach ($texts as $text) {
			try {
				$this->sendMsg($text);
				$mysql->DBExecute("update msg_log set status = 100 where id = '".$text['id']."'");
			} catch (Exception $e) {
				$msg = "第".($text['status']+1)."次:".$e->getMessage();
				echo "error:$msg<br />";
				$mysql->DBExecute("update msg_log set result = CONCAT('".$msg."','\n<br />',IFNULL(result,'')) where id = '".$text['id']."'");
			}			
		}
	}

	private function sendMsg($text){
		global $mysql,$MsgErrorCode,$BlackListWords,$userAndPswd,$corpName,$apiUrl;
		$sender = $text['sender'];
		$reciever = $text['reciever'];
		$recieverPhone = $text['recieverPhone'];
		$content = $corpName.$text['content'];
		if(strlen($recieverPhone) != 11){
			throw new Exception('手机号不正确:'.$recieverPhone);
		}
		$url = $apiUrl."sendsms.action?".$userAndPswd."&phone=$recieverPhone&message=".urlencode($content);
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10) ; // timeout  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回  
		curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ; // 在启用 CURLOPT_RETURNTRANSFER 时候将获取数据返回
		$res = curl_exec($ch);
		if($res == false)
			throw new Exception("向短信提供商请求失败！");
		$error = $this->getValueFromXml($res,"error");
		$message = isset($MsgErrorCode[$error]) ? $MsgErrorCode[$error] : "未知";
		if($error != "0")
			throw new Exception("$error $message");
	}

	public function getBalance(){
		global $mysql,$MsgErrorCode,$BlackListWords,$userAndPswd,$corpName,$apiUrl;
		$url = $apiUrl."querybalance.action?".$userAndPswd;
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
		$res = curl_exec($ch);
		if($res == false)
			throw new Exception("向短信提供商请求失败！");
		$error = $this->getValueFromXml($res,"error");
		$balance = $this->getValueFromXml($res,"message");
		$mysql->DBUpdate('system',array('paramValue'=>$balance),"`id` = '8' ");
		return array('status'=>'successful', 'balance' => $balance);
	}

	public function syncWithMsgVendorServer(){
		global $mysql,$MsgErrorCode,$BlackListWords,$userAndPswd,$corpName,$apiUrl;
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
				$phone = $this->getValueFromXml($res,"srctermid");
				$user = $mysql->DBGetAsOneArray("select realName from user where phone like '%$phone%'  and isDeleted = 'false' ");
				$obj = array(
					"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
					"sender"=>count($user) > 0 ? $user[0] : "unkown",
					"senderPhone"=>$phone,
					"content"=>$this->getValueFromXml($res,"msgcontent"),
					"sendTime"=>$this->getValueFromXml($res,"sendTime"),
				);
			}catch(Exception $e){
				continue;
			}
			$revCount++;
			$mysql->DBInsertAsArray('msg_recieve_log',$obj);
		}
		return array('status'=>'successful','revCount'=>$revCount);
	}
	
	public function getsendmsgs($sender,$reciever,$recieverPhone,$status,$beginTime,$endTime,$page,$size){
		global $mysql,$MsgErrorCode,$BlackListWords,$userAndPswd,$corpName,$apiUrl;
		$sql = "select * from msg_log ";
		$sqlCount = "select count(1) as count from msg_log ";
		// $where = " where createTime >= '$beginTime' and createTime <= '$endTime' "; // remove time limit, we are gonna use paging toolbar in frontend
		$where = " where 1 = 1 ";

		if($sender != null)$where .= " and sender = '$sender' ";
		if($status != null)$where .= " and status = '$status' ";
		if($reciever != null)$where .= " and reciever = '$reciever' ";
		if($recieverPhone != null)$where .= " and recieverPhone = '$recieverPhone' ";
	
		$limit = " limit $size offset ".($size*($page-1));

		$order = " ORDER BY `createTime` DESC ";
		
		$data = $mysql->DBGetAsMap($sql.$where.$order.$limit);
		$count = $mysql->DBGetAsOneArray($sqlCount.$where);
		return array('status'=>'successful',"data"=>$data,"total"=>$count[0]);
	}
	
	public function getrecvmsgs($sender,$phone,$beginTime,$endTime,$page,$size){
		global $mysql,$MsgErrorCode,$BlackListWords,$userAndPswd,$corpName,$apiUrl;
		$sql = "select * from msg_recieve_log ";
		$sqlCount = "select count(1) as count from msg_recieve_log ";
		$where = " where createTime >= '$beginTime' and createTime <= '$endTime' ";

		if($sender != null)$where .= " and sender = '$sender' ";
		if($phone != null)$where .= " and senderPhone = '$phone' ";
	
		$limit = " limit $size offset ".($size*($page-1));
		
		$data = $mysql->DBGetAsMap($sql.$where.$limit);
		$count = $mysql->DBGetAsOneArray($sqlCount.$where);
		return array('status'=>'successful',"data"=>$data,"total"=>$count[0]);
	}
}
?>