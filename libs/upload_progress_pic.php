<?php
include_once "chart.php";

global $IS_SAE;
$IS_SAE = defined("SAE_MYSQL_HOST_M");

if(!isset($_FILES) || !isset($_FILES['photo']) || !isset($_FILES['photo']['tmp_name']) || $_FILES['photo']['tmp_name'][0] =="") throw new Exception("no files uploaded!");

$name = $_FILES['photo']['name'];
$tmpName = $_FILES['photo']['tmp_name'];

// handler files
$result = handleFiles($tmpName,$name);
echo json_encode($result);

// handler files
function handleFiles($tmpName,$name){
	global $IS_SAE;
	$result = array("success" => true,"details" => array());
	$tmp = explode(".", $name);
	$tmp = $tmp[count($tmp) - 1];
	$ext = $tmp;
	$directory = "../resources/progress/";
	if($IS_SAE){
		$st = new SaeStorage();
		$attr = array('encoding'=>'gzip');
		$tName = $tmpName;
		$oName = $name;
		$file_new_name = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT).".".$ext;
		resize_pic($tName,$ext);
		$uploadRes = $st->upload($_SERVER['HTTP_APPNAME'],$file_new_name, $tName , $attr, true);
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
	}else{
		if(!file_exists($directory))
			if(!mkdir($directory))
				throw new Exception("文件夹创建失败!".$directory);
		
		$tName = $tmpName;
		$oName = $name;
		$file_new_name = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT).".".$ext;
		resize_pic($tmpName,$ext);
		if (move_uploaded_file ($tName, $directory.$file_new_name)) {
			array_push($result["details"], array(
				"success" => true,
				"msg" => "图片'$oName'上传成功！重命名为'$file_new_name'。",
				"file" => substr($directory, 1).$file_new_name,
				"original_file_name" => $oName
			));
		}
		else {
			array_push($result["details"], array(
				"success" => false,
				"msg" => "图片'$oName'上传失败！",
				"file" => '',
				"original_file_name" => $oName
			));
		}
	}
	
	return $result;
}
?>