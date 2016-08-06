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
			$file_new_name = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT).".".$ext_arr[$i];
			array_push($base64Images,base64_encode(file_get_contents($_FILES['photo']['tmp_name'][$i])));
			if(!$st->upload('certs',$file_new_name, $_FILES['photo']['tmp_name'][$i] , $attr, true)){
				throw new Exception("文件".$names[$i]."上传失败！");
			}
		}		
	}else{
		if(!file_exists($directory) && !mkdir($directory))
			throw new Exception("文件夹创建失败!".$directory);
		for ($i = 0; $i < count($names); $i++) {
			$tName = $tmpNames[$i];
			$widthAndHeight = resize($tName);
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


function resize($path){
	list($width, $height) = getimagesize($path);
	$im=imagecreatefromjpeg($path);
	if($width<=1920 && $height <= 1920){
		$newwidth = $width;
		$newheight = $height;
	}else{
		$scale = $width > $height ? 1920/$width : 1920/$height;
		$newheight = $width > $height ? $height * $scale : 1920;
		$newwidth = $width > $height ? 1920 : $height * $scale;
	}
	$newim = imagecreatetruecolor($newwidth,$newheight);
	imagecopyresampled($newim,$im,0,0,0,0,$newwidth,$newheight,$width,$height);
	imagejpeg($newim,$path);
	imagedestroy($im);
	imagedestroy($newim);
	return "$newwidth x $newheight";
}
?>