<?php
$APPBASE = $_SERVER['DOCUMENT_ROOT'];
if(strpos($_SERVER['PHP_SELF'],'/fd/') === 0) {
	$APPBASE = $APPBASE.'/fd';
}
else if (strpos($_SERVER['PHP_SELF'],'/FamilyDecoration/') === 0) {
	$APPBASE = $APPBASE.'/FamilyDecoration';
}
include_once "$APPBASE/libs/common.php";
include_once "$APPBASE/phpmailer/class.smtp.php";
include_once "$APPBASE/phpmailer/class.phpmailer.php";

function sendEmail ($recipient,$aliasNames='',$from = '佳诚装饰' ,$subject, $body, $attachement = null){
	date_default_timezone_set('PRC');
	$mail = new PHPMailer();
	$mail->IsSMTP();
	// $mail->SMTPDebug = 2; // this is debug mode, if you need, open it and see detailed error info
	$mail->SMTPDebug = 0; // non-debug mode
	$mail->Debugoutput  = 'html';
	$mail->Host = "smtp.qq.com";
	$mail->Port = "465";  
	$mail->SMTPSecure = "ssl";
	$mail->SMTPAuth = true;
	$mail->Username = "674417307@qq.com";
	$mail->Password = "qqNJ20";
	$mail->Priority = 1;
	$mail->Charset = 'utf-8';
	$mail->Encoding = 'base64';
	$mail->From = '674417307@qq.com';
	$mail->FromName = (trim($from) == '佳诚装饰') ? '' : $from;
	$mail->Timeout = 30;

	if($recipient == null || $recipient == "")
		throw new Exception("recipient should not be null !");

	if(is_string($recipient) && contains($recipient,','))
		$recipient = explode(',',$recipient);
	if(is_string($aliasNames) && contains($aliasNames,','))
		$aliasNames = explode(',',$aliasNames);
	
	if(is_string($recipient) && contains($recipient,'@')){
		$mail->addAddress($recipient,$aliasNames);
	}

	if (is_array($recipient)) {
		$recipient = array_merge($recipient);
		$count = count($recipient);
		$aliasNames = is_array($aliasNames) ? array_merge($aliasNames) : array();
		for ($i = 0;$i < $count ; $i++) {
			$address = $recipient[$i];
			$name = isset($aliasNames[$i]) ? $aliasNames[$i] : '';
			if(is_string($address) && contains($address,'@')){
				// echo "send mail to $address as $name <br />\n";
				$mail->addAddress($address,$name);
			}
		}
	}

	// $mail->addAddress('674417307@qq.com','IT_Diego');
	// $mail->addAddress('547010762@qq.com','IT_Alex');
	$mail->isHTML(true); // Set email format to HTML
	if($attachement != null){
		$mail->addStringAttachment($attachement['content'],$attachement['name']);
	}
	$mail->Subject = "【佳诚装饰】 $subject";
	$mail->Body    = $body;
	$mail->AltBody = "";
	if(!$mail->send()) {
		// echo "Message could not be sent.<br />\n";
		// echo "Mailer Error: " . $mail->ErrorInfo."<br />\n";
	} else {
		// echo "Message has been sent<br />\n";
	}
	$mail->smtpClose();
}
?>