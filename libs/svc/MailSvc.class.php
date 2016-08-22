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
			$q['@mailSender'] = $_SESSION['realname'];
		if (!isset($q['@senderAddress']))
			$q['@senderAddress'] = $_SESSION['mail'];
		if (!isset($q['@mailReceiver']) && !isset($q['@receiverAddress'])){
			throw new Exception('收信人和邮件地址不能同时为空!');
		}
		notNullCheck($q,'@mailSubject','主题不能为空!');
		notNullCheck($q,'@mailContent','内容不能为空!');

		$userSvc = parent::getSvc('User');
		$reciever = $userSvc->getRealNameAndEmail($q['@mailReceiver']);
		//转换一下用户名，可以传嘉诚装饰，也可以传admin
		$q['@mailReceiver'] = $reciever['realName'];
		if(!isset($q['@receiverAddress']))
			$q['@receiverAddress'] = $reciever['mail'];
		return parent::add($q);
	}

	//新增邮件入库并立即发送
	public function addAndSend($q){
		$res = $this->add($q);
		return $this->sendMail($res['data']);
	}

	public function cron($q){
		global $mysql;
		$mails = $mysql->DBGetAsMap("select * from mail where status < 4");  //-1未发送，100发送成功，1~n 发送失败次数
		$mysql->DBExecute("update mail set status = status + 1 where status < 4");
		foreach ($mails as $mail) {
			try {
				$this->sendMail($mail);
				$mysql->DBExecute("update mail set status = 100 where id = '".$mail['id']."'");
			} catch (Exception $e) {
				$msg = "第".($mail['status']+1)."次:".$e->getMessage();
				echo "error:$msg<br />";
				$mysql->DBExecute("update mail set result = CONCAT('".$msg."','\n<br />',IFNULL(result,'')) where id = '".$mail['id']."'");
			}			
		}
	}

	private function sendMail($mail){
		include_once "common_mail.php";
		echo "sending mail:".$mail['id']."[".$mail['mailSubject']."] from ".$mail['mailSender']." to ".$mail['mailReceiver']."(".$mail['receiverAddress'].") content:".$mail['mailContent'].'<br />';
		sendEmail($mail['receiverAddress'],$mail['mailReceiver'],$mail['mailSender'],$mail['mailSubject'],$mail['mailContent'],null);
	}

	public function getReceivedMailByUser($user){
		global $mysql;
		$reciever = parent::getSvc('User')->getRealNameAndEmail($user);
		$user = $reciever['realName'];
		$forPage = isset($_GET["limit"]) && isset($_GET["start"]) ? true : false;
		$sql = "select * from mail where `isDeleted` = 'false' and mailReceiver = '?' or mailReceiver like '%?,%' or mailReceiver like '%,?%' ORDER BY `createTime` DESC";
		if ($forPage) {
			$start = $_GET["start"];
			$limit = $_GET["limit"];
			$limitSql = " LIMIT $start, $limit ";
			$count = count($mysql->DBGetAsMap($sql, $user, $user, $user));
			$arr = $mysql->DBGetAsMap($sql.$limitSql,$user, $user, $user);
		}
		else {
			$arr = $mysql->DBGetAsMap($sql,$user, $user, $user);
		}
		if ($forPage) {
			$res = array("totalCount"=>$count, "resultSet"=>$arr);
			return $res;
		}
		else {
			return $arr;
		}
	}
	
	function getSentMailByUser($user){
		global $mysql;
		$reciever = parent::getSvc('User')->getRealNameAndEmail($user);
		$user = $reciever['realName'];
		$sql = "select * from mail where `isDeleted` = 'false' and mailSender = '?' ORDER BY `createTime` DESC ";
		$forPage = isset($_GET["limit"]) && isset($_GET["start"]) ? true : false;
		if ($forPage) {
			$start = $_GET["start"];
			$limit = $_GET["limit"];
			$limitSql = " LIMIT $start, $limit ";
			$count = count($mysql->DBGetAsMap($sql, $user));
			$arr = $mysql->DBGetAsMap($sql.$limitSql,$user);
		} else {
			$arr = $mysql->DBGetAsMap($sql,$user);
		}
		if ($forPage) {
			$res = array("totalCount"=>$count, "resultSet"=>$arr);
			return $res;
		}
		else {
			return $arr;
		}
	}

	function setMailRead($id) {
		global $mysql;
		$mysql->DBUpdate("mail",array('isRead'=>true),"`id` = '?' ",array($id));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function setMailReadByReceiver ($receiverName) {
		global $mysql;
		$mysql->DBUpdate("mail",array("isRead"=>true),"`mailReceiver` = '?' or `mailReceiver` like '%?,%' or `mailReceiver` like '%,?%'",array($receiverName, $receiverName, $receiverName));
		return array('status'=>'successful', 'errMsg' => '');
	}
}
?>