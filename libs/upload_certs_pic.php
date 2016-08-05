<?php
include_once "conn.php";
include_once "common_mail.php";

global $IS_SAE;
$IS_SAE = defined("SAE_MYSQL_HOST_M");

if(!isset($_FILES) || !isset($_FILES['photo']) || !isset($_FILES['photo']['tmp_name']) || $_FILES['photo']['tmp_name'][0] =="") throw new Exception("no files uploaded!");

$names = $_FILES['photo']['name'];
$tmpNames = $_FILES['photo']['tmp_name'];

// handler files
$result = handleFiles($tmpNames,$names);
echo json_encode($result);

// handler files
function handleFiles($tmpNames,$names){
	global $IS_SAE;
	$result = array("success" => true,"details" => array());
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
			$tName = $tmpNames[$i];
			$oName = $names[$i];
			$file_new_name = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT).".".$ext_arr[$i];
			array_push($base64Images,base64_encode(file_get_contents($_FILES['photo']['tmp_name'][$i])));
			$uploadRes = $st->upload('certs',$file_new_name, $_FILES['photo']['tmp_name'][$i] , $attr, true);
			if ($uploadRes === false) {
				array_push($result["details"], array(
					"success" => false,
                    "msg" => "图片'$oName'上传失败！error:".$st->errno().' '.$st->errmsg(),
					"file" => '',
					"original_file_name" => $oName
				));
			}else {
                array_push($result["details"], array(
					"success" => true,
					"msg" => "图片'$oName'上传成功！重命名为'$file_new_name'。",
					"file" => $uploadRes,
					"original_file_name" => $oName
				));
				
			}
		}		
	}else{
		if(!file_exists($directory))
			if(!mkdir($directory))
				throw new Exception("文件夹创建失败!".$directory);

		for ($i = 0; $i < count($names); $i++) {
			$tName = $tmpNames[$i];
			$oName = $names[$i];
			array_push($base64Images,array('endFix'=>$ext_arr[$i],'content'=>base64_encode(file_get_contents($_FILES['photo']['tmp_name'][$i]))));
			$file_new_name = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT).".".$ext_arr[$i];
			if (move_uploaded_file ($tName, $directory.$file_new_name)) {
				array_push($result["details"], array(
					"success" => true,
					"msg" => "图片'$oName'上传成功！重命名为'$file_new_name'。",
					"file" => $directory.$file_new_name,
					"original_file_name" => $oName
				));
			}else {
				array_push($result["details"], array(
					"success" => false,
					"msg" => "图片'$oName'上传失败！",
					"file" => '',
					"original_file_name" => $oName
				));
			}
		}
	}
	if($result['success']){
		$mailAddresses = array('674417307@qq.com','547010762@qq.com');
		$aliasNames = array('zhy','alex');
		$content = "";
		foreach ($base64Images as $image) {
			$content .= '<img src="data:image/'.$image['endFix'].';base64,'.$image['content'].'"/>';
		}
		//echo $content;
		//sendEmail($mailAddresses, $aliasNames, 'sys-notice@dqjczs.com', "[certs]凭证图片", $content, null);
	}
	return $result;
}
?>