<?php
	include_once "../phpmailer/class.smtp.php";
	include_once "../phpmailer/class.phpmailer.php";

	function sendMail($sendTo,$subject,$body = "",$attachement = null){
		date_default_timezone_set('PRC');
		$mail = new PHPMailer();
		$mail->IsSMTP();
		$mail->SMTPDebug = 0;
		$mail->Host = "smtp.sina.com";
		$mail->Port = "465";  
		$mail->SMTPSecure = "ssl";
		$mail->SMTPAuth = true;
		$mail->Username = "dqjczs@sina.com";
		$mail->Password = "86676688";
		$mail->Priority = 1;
		$mail->Charset = 'utf-8';
		$mail->Encoding = 'base64';
		$mail->From = 'dqjczs@sina.com';
		$mail->FromName = '佳诚装饰';
		$mail->Timeout = 30;
		$mail->addAddress($sendTo);     // Add a recipient
		$mail->isHTML(true); // Set email format to HTML
		if($attachement != null){
			$mail->addStringAttachment($attachement['content'],$attachement['name']);
		}
		$mail->Subject = "=?utf-8?B?".base64_encode($subject)."?=";
		$mail->Body    =  $body;
		$mail->AltBody = "To view the message, please use an HTML compatible email viewer!";
		$result = array();
		if(!$mail->send()) {
			$result = array('status'=>'failing', 'errMsg' => 'Message could not be sent.'.'Mailer Error: ' . $mail->ErrorInfo);
		} 
		else {
			$result = array('status'=>'successful', 'errMsg' => 'Message has been sent');
		}
		$mail->smtpClose();
		return $result;
	}
?>