<?php
include_once "conn.php";
include_once "common_mail.php";

global $IS_SAE;
$IS_SAE = defined("SAE_MYSQL_HOST_M");

if(!isset($_FILES) || !isset($_FILES['photo']) || !isset($_FILES['photo']['tmp_name']) || $_FILES['photo']['tmp_name'][0] =="") 
	throw new Exception("没有文件或者文件太大！");

$names = $_FILES['photo']['name'];
$tmpNames = $_FILES['photo']['tmp_name'];

handleFiles($tmpNames,$names);
echo json_encode(array("success" => true));

function handleFiles($tmpNames,$names){
	global $IS_SAE;
	$uploadFilesSvc = BaseSvc::getSvc('UploadFiles');
	$ext_arr = array();
	for ($i = 0; $i < count($names); $i++) {
		$tmp = explode(".", $names[$i]);
		$tmp = $tmp[count($tmp) - 1];
		array_push($ext_arr, $tmp);
	}
	$base64Images = array();
	$directory = "../resources/certs/";
	if($IS_SAE){
		$st = new SaeStorage();
		$attr = array('encoding'=>'gzip');
		for ($i = 0; $i < count($names); $i++) {
			$oName = $names[$i];
			$file_new_name = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT).".".$ext_arr[$i];
			$fileSize = filesize($directory.$file_new_name);
			array_push($base64Images,base64_encode(file_get_contents($_FILES['photo']['tmp_name'][$i])));
			$widthAndHeight = resize_pic($_FILES['photo']['tmp_name'][$i]);
			if(!$st->upload('certs',$file_new_name, $_FILES['photo']['tmp_name'][$i] , $attr, true)){
				throw new Exception("文件".$names[$i]."上传失败！");
			}
			$uploadFilesSvc->add(array(
					'@type'=>'img',
					'@size'=>$fileSize,
					'@path'=>$file_new_name,
					'@other'=>$widthAndHeight,
					'@orignalName'=>$oName,
					'@refId'=>$_REQUEST['refId'],
					'@desc'=>$_REQUEST['desc'],
					'@refType'=>$_REQUEST['refType']
			));
		}		
	}else{
		if(!file_exists($directory) && !mkdir($directory))
			throw new Exception("文件夹创建失败!".$directory);
		for ($i = 0; $i < count($names); $i++) {
			$tName = $tmpNames[$i];
			$widthAndHeight = resize_pic($tName);
			$oName = $names[$i];
			$file_new_name = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT).".".$ext_arr[$i];
			if (!move_uploaded_file ($tName,$directory.$file_new_name )) {
				throw new Exception("文件$oName上传失败！");
			}
			array_push($base64Images,array('endFix'=>$ext_arr[$i],'content'=>base64_encode(file_get_contents($directory.$file_new_name))));
			$uploadFilesSvc->add(array(
					'@type'=>'img',
					'@size'=>filesize($directory.$file_new_name),
					'@path'=>$directory.$file_new_name,
					'@other'=>$widthAndHeight,
					'@orignalName'=>$oName,
					'@refId'=>$_REQUEST['refId'],
					'@desc'=>$_REQUEST['desc'],
					'@refType'=>$_REQUEST['refType']
			));
		}
	}
	if(isset($_REQUEST['backup']) && $_REQUEST['backup'] == 'true'){
		$mailAddresses = array('674417307@qq.com','547010762@qq.com');
		$aliasNames = array('zhy','alex');
		$content = "";
		foreach ($base64Images as $image) {
			$content .= '<br /><br /><br /><img src="data:image/'.$image['endFix'].';base64,'.$image['content'].'"/>';
		}
		sendEmail($mailAddresses, $aliasNames, 'sys-notice@dqjczs.com', "[certs]凭证图片", $content, null);
	}
}
?>