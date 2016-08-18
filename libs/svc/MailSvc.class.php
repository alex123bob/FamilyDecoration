<?php
class MailSvc extends BaseSvc
{
	/*
		邮件类
	*/

	//新增邮件入库稍后发送
	public function add($q){
		$q['@id'] = $this->getUUID();
		if (!isset($q['@mailSender']))
			$q['@mailSender'] = $_SESSION['name'];
		if (!isset($q['@senderAddress']))
			$q['@senderAddress'] = $_SESSION['mail'];
		return parent::add($q);
	}

	//新增邮件入库并立即发送
	public function addAndSend($q){
		$res = $this->add($q);
		return $this->sendMail($res['data']);
	}

	public function get($q){
		$res = parent::get($q);
		$this->appendNamesAndAddress($res['data']);
		return $res;
	}
	public function cron($q){
		global $mysql;
		$mails = $mysql->DBGetAsMap("select * from mail where status < 4");  //-1未发送，100发送成功，1~n 发送失败次数
		$mysql->DBExecute("update mail set status = status + 1 where status < 4");

		$this->appendNamesAndAddress($mails);
		
		foreach ($mails as $mail) {
			try {
				$this->sendMail($mail);
				$mysql->DBExecute("update mail set status = 100 where id = '?'",$mail['id']);
			} catch (Exception $e) {
				$msg =$e->getMessage();
				echo "error:$msg<br />";
				$mysql->DBExecute("update mail set result = CONCAT(IFNULL(result,''),'\n','?') where id = '?'",$msg,$mail['id']);
			}			
		}
	}

	private function sendMail($mail){
		include_once "common_mail.php";
		echo "sending mail:".$mail['id']."[".$mail['mailSubject']."] from ".$mail['mailSenderName']." to ".$mail['mailReceiverName']."(".$mail['receiverAddress'].") content:".$mail['mailContent'].'<br />';
		sendEmail($mail['receiverAddress'],$mail['mailReceiverName'],$mail['mailSenderName'],$mail['mailSubject'],$mail['mailContent'],null);
	}

	private function appendNamesAndAddress(&$mails){
		if($mails == null || count($mails) == 0)
			return;
		global $mysql;
		//处理中文姓名和邮箱地址
		$names = array();
		foreach ($mails as $mail) {
			if($mail['mailSender'] != "")
				array_push($names,trim($mail['mailSender']));
			if(contains($mail['mailReceiver'],',')){
				$res = explode(',', $mail['mailReceiver']);
				foreach ($res as $name) {
					if($name != "")
						array_push($names,trim($name));
				}
			}else{
				array_push($names,trim($mail['mailReceiver']));
			}
		}
		$names = '(\''.join(array_unique($names),'\',\'').'\')';
		$users = $mysql->DBGetAsMap("select name,realName,mail from user where name in $names ");
		$namesMapp = array();
		foreach ($users as $user) {
			$namesMapp[$user['name']]  = array(
				'realName'=>$user['realName'],
				'mail'=>$user['mail']
			);
		}

		foreach ($mails as &$mail) {
			if($mail['mailSender'] != "")
				$mail['mailSenderName'] = isset($namesMapp[$mail['mailSender']]) ? $namesMapp[$mail['mailSender']]['realName'] : $mail['mailSender'];
			if(contains($mail['mailReceiver'],',')){
				$res = explode(',', $mail['mailReceiver']);
				$resAddress = array();
				$resNames = array();
				foreach ($res as $name) {
					if($name != ""){
						array_push($resNames, isset($namesMapp[$name]) ? $namesMapp[$name]['realName'] : $name);
						array_push($resAddress, isset($namesMapp[$name]) ? $namesMapp[$name]['mail'] : $name);
					}					
				}
				$mail['receiverAddress'] = join($resAddress,',');
				$mail['mailReceiverName'] = join($resNames,',');
			}else{
				$mail['receiverAddress'] = isset($namesMapp[$mail['mailReceiver']]) ? $namesMapp[$mail['mailReceiver']]['mail'] : $mail['mailReceiver'];
				$mail['mailReceiverName'] = isset($namesMapp[$mail['mailReceiver']]) ? $namesMapp[$mail['mailReceiver']]['realName'] : $mail['mailReceiver'];
			}
		}
	}
}
?>