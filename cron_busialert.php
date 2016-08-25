<?php
	header("Content-type: text/html; charset=utf-8");
	include_once "./libs/common_mail.php";
	include_once "./libs/conn.php";
	
	function sendMailToSlacker($minDays,$maxDays=null){
		global $mysql,$HTTPHeader,$HTTPFooter;
		$select = "SELECT b.salesman,u.mail,r.name,b.address, b.customer, u.phone , b.designer, b.createTime, b.updateTime,TIMESTAMPDIFF(DAY , b.updateTime, NOW( ) ) as updateDaysAgo ";
		$from = " FROM  `business` AS b LEFT JOIN user AS u ON u.name = b.salesmanName LEFT JOIN region AS r ON r.id = b.regionId ";
		if($maxDays == null){
			$where = " WHERE TIMESTAMPDIFF(DAY , b.updateTime, NOW( ) ) >= $minDays ";
		}else if($maxDays > 0 && $maxDays > $minDays){
			$where = " WHERE TIMESTAMPDIFF(DAY , b.updateTime, NOW( ) ) >= $minDays AND TIMESTAMPDIFF(DAY , b.updateTime, NOW( ) ) <= $maxDays ";
		}else{
			$where = " WHERE TIMESTAMPDIFF(DAY , b.updateTime, NOW( ) ) = $minDays "; 
		}
		$where = $where." AND b.isTransfered =  'false' AND b.isDeleted =  'false' AND b.isFrozen =  'false' AND u.isDeleted =  'false' order by b.salesman ";
		
		$mails = array();
		$names = array();
		$res = $mysql->DBGetAsMap($select.$from.$where);
		if(count($res) == 0){
			echo "no slackers to send.<br />\n";
			return;
		}
		$title = "业务模块停滞 $minDays 天邮件通知";
		$content = "以下业务已经 $minDays 天没有更新了，请通知他们加油哦！<br /><br />\n\n<table>\n\t<tr>\n\t\t<td>业务员</td>\n\t\t<td>邮箱</td>\n\t\t<td>小区</td>\n\t\t<td>业务地址</td>\n\t\t<td>客户</td>\n\t\t<td>客户手机</td>\n\t\t<td>设计师</td>\n\t\t<td>创建时间</td>\n\t\t<td>最后更新时间</td><td>最后更新时间</td>\n\t</tr>\n";
		foreach($res as $item){
			array_push($mails,$item['mail']);
			array_push($names,$item['salesman']);
			$updateDaysAgo = $item['updateDaysAgo'];
			if($updateDaysAgo <= 7){
				$item['updateDaysAgo'] = $updateDaysAgo.'天前';
			}else if($updateDaysAgo <= 31){
				$item['updateDaysAgo'] = intVal($updateDaysAgo/7).'周前';
			}else if($updateDaysAgo < 365){
				$item['updateDaysAgo'] = intVal($updateDaysAgo/30.416).'个月前';
			}else{
				$item['updateDaysAgo'] = '一年前';
			}
			$content = $content."\t<tr>\n\t\t<td>".implode("</td>\n\t\t<td>",$item)."</td>\n\t</tr>\n";	
		}
		// add users need notify
		// dont add and mail like '%@%' , for better debug.
		$notifyUsers = $mysql->DBGetAsMap("SELECT `mail`,`realName` FROM `user` WHERE `level` = '004-001' OR `level` like '001-%' ");
		foreach($notifyUsers as $item){
			array_push($mails,$item['mail']);
			array_push($names,$item['realName']);
		}
		$mails = array_unique($mails);
		$names = array_unique($names);
		$content = $content."</table><br /><br />\n\n";
		echo $content;
		echo "<div class='detail'>\n";
		//print_r($mails);
		//print_r($names);
		array_push($mails,'547010762@qq.com');
		array_push($mails,'674417307@qq.com');
		array_push($names,'IT_Alex');
		array_push($names,'IT_Diego');
		sendEmail($mails,$names,null,$title, $HTTPHeader.$content.$HTTPFooter);
		echo "</div>";
	}
	
	global $HTTPHeader,$HTTPFooter;
	$HTTPHeader= "<!DOCTYPE HTML>\n<html>\n<head>\n<style>\n.detail{font-size:11px;color:#999;}\ntr{background-color:#BCE6DB;}\ntr:hover{background-color:#CC7E6F;cursor:pointer;}\ntr:nth-child(2n){background-color:#E4C4BE;}\ntd{border:#eee 1px solid;padding:5px;font-size:13px;}\ntable{border:0;margin:0;border-collapse:collapse;border-spacing:0;}\n</style>\n</head>\n<body>\n";
	$HTTPFooter  = "\n</body>\n</html>";
	echo $HTTPHeader;
	sendMailToSlacker(3,6);
	echo "<br /><br /><hr /><br /><br />\n\n\n\n";
	sendMailToSlacker(7);
	echo $HTTPFooter;
?>