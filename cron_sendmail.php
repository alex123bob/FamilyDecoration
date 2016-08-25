<?php
	header("Content-type: text/html; charset=utf-8");
	include_once "./libs/common_mail.php";
	include_once "./libs/conn.php";

	function getLastedBackUpDBFileFromSaeStorage(){
		$st= new SaeStorage();
		$fileNames = $st->getList("dbback",date('Y-m-d'));
		if($fileNames == false){
			$prefixYesterDay = date("Y-m-d",strtotime("-1 day")); 
			$fileNames =  $st->getList("dbback",$prefixYesterDay);
			if($fileNames == false){
				throw new Exception('could not find latest db backup file.');
			}
		}
		rsort($fileNames,SORT_STRING);
		echo "latest db backup file:".$fileNames[0]."\n";
		$attach = $st->getUrl("dbback", $fileNames[0]);
		$filecontent = file_get_contents($attach);			// add url attachements like http:/xxx
		//$mail->addAttachment($attach);         	// Add local attachments like /home/user/xxx
		return array('content'=>$filecontent,'name'=>$fileNames[0]);
	}

	function checkProjectPeriod(){
		echo "checkProjectPeriod\n";
		global $mysql,$HTTPHeader,$HTTPFooter;
		$res = $mysql->DBGetAsMap("SELECT projectName,captainName,supervisorName,designerName,salesmanName,period from project where isDeleted = 'false' and period like '%:%' ");
		//遍历所有工程
		$menToSendMail = array();
		$content = "<table>\n\t<tr>\n\t\t<td>项目名</td>\n\t\t<td>负责人</td>\n\t\t<td>监理</td>\n\t\t<td>设计师</td>\n\t\t<td>业务员</td>\n\t\t<td>进度</td>\n\t\t<td>百分比</td>\n\t\t</tr>\n";
		$filted = array();
		foreach($res as $item){
			try{
				$datetime = explode (":",$item['period']);
				$startTime = date_create($datetime[0]);
				$endTime = date_create($datetime[1]);
				$period = date_diff($startTime, $endTime)->format('%R%a');
				$proceed = date_diff($startTime, new DateTime('NOW'))->format('%R%a');
				$percentage = intval($proceed/$period*10)*10;
				if( $percentage == 30 || $percentage == 50 || $percentage == 80){
					$item['percentage'] = "$percentage%";
					if($item['captainName'] != null && !in_array($item['captainName'],$menToSendMail))
						array_push($menToSendMail,$item['captainName']);
					if($item['supervisorName'] != null && !in_array($item['supervisorName'],$menToSendMail))
						array_push($menToSendMail,$item['supervisorName']);
					if($item['designerName'] != null && !in_array($item['designerName'],$menToSendMail))
						array_push($menToSendMail,$item['designerName']);
					if($item['salesmanName'] != null && !in_array($item['salesmanName'],$menToSendMail))
						array_push($menToSendMail,$item['salesmanName']);
					array_push($filted,$item);
				}
			}catch(Exception $ex){
				echo $ex."<br />\n\n";
				continue;
			}
		}
		

		//查找用户邮箱地址并发送
		
		if(count($menToSendMail) > 0){
			$menToSendMail = array_unique($menToSendMail);
			// can not add  " mail like '%a%' " , if so , the user would not be selected and therefor unable to replace name with realName which is bad UX.
			// sendEmail will detect the mail format .
			$sql = "SELECT mail,realname,name from user where isDeleted = 'false' and name in ('".join("','",$menToSendMail)." ')";
			$res = $mysql->DBGetAsMap($sql);
		}else{
			$res = array();
		}
		$mails = array();
		$names = array();
		$name_realName_Map = array();
		foreach($res as $item){
			array_push($mails,$item['mail']);
			array_push($names,$item['realname']);
			$name_realName_Map[$item['name']] = $item['realname'];
		}
		foreach($filted as $item){
			if(isset($name_realName_Map[$item['captainName']]))
				$item['captainName'] = $name_realName_Map[$item['captainName']];
			if(isset($name_realName_Map[$item['supervisorName']]))
				$item['supervisorName'] = $name_realName_Map[$item['supervisorName']];
			if(isset($name_realName_Map[$item['designerName']]))
				$item['designerName'] = $name_realName_Map[$item['designerName']];
			if(isset($name_realName_Map[$item['salesmanName']]))
				$item['salesmanName'] = $name_realName_Map[$item['salesmanName']];
			$content = $content."\t<tr>\n\t\t<td>".implode("</td>\n\t\t<td>",$item)."</td>\n\t</tr>\n";	
		}		
		$content = $content."</table><br /><br />\n\n";		
		echo $content;
		echo "<div class='detail'>\n";
		array_push($mails,'547010762@qq.com');
		array_push($mails,'674417307@qq.com');
		array_push($names,'IT_Alex');
		array_push($names,'IT_Diego');
		sendEmail($mails,$names,null,"【项目进度提示】",$HTTPHeader.$content.$HTTPFooter);
		echo "</div>";
	}

	global $HTTPHeader,$HTTPFooter;
	$HTTPHeader= "<!DOCTYPE HTML>\n<html>\n<head>\n<style>\n.detail{font-size:11px;color:#999;}\ntr{background-color:#BCE6DB;}\ntr:hover{background-color:#CC7E6F;cursor:pointer;}\ntr:nth-child(2){background-color:#E4C4BE;}\ntd{border:#eee 1px solid;padding:5px;font-size:13px;}\ntable{border:0;margin:0;border-collapse:collapse;border-spacing:0;}\n</style>\n</head>\n<body>\n";
	$HTTPFooter  = "\n</body>\n</html>";
	echo $HTTPHeader;
	//获取工期并邮件通知
	checkProjectPeriod();
	echo "\n\n\n<br /><br /><br /><br />\n\n\n";
	//备份数据库并发送邮件
	echo "<div class='detail'>\n";
	sendEmail('423129858@qq.com,547010762@qq.com,674417307@qq.com',null,null,"[Daily DB backup]".date('Y-m-d-H-i-s'),"This is the database daily backup file for
	 system recovery. Please keep it and ignore it.",getLastedBackUpDBFileFromSaeStorage());
	echo "</div>";
	echo $HTTPFooter;

?>