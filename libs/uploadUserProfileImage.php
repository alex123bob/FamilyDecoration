<?php
include_once "chart.php";

global $IS_SAE;
$IS_SAE = defined("SAE_MYSQL_HOST_M");

if(!isset($_FILES) || !isset($_FILES['photo']) || !isset($_FILES['photo']['tmp_name']) || $_FILES['photo']['tmp_name'][0] =="") throw new Exception("no files uploaded!");

// all arguments check ok 
// $type = $_REQUEST["type"];

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
  // when name the folder, here we wipe the parameter $type.
	$directory = "../resources/user/";
	if($IS_SAE){
		$st = new SaeStorage();
		$attr = array('encoding'=>'gzip');
		for ($i = 0; $i < count($names); $i++) {
			$tName = $tmpNames[$i];
			$oName = $names[$i];
			$file_new_name = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT).".".$ext_arr[$i];
			$uploadRes = $st->upload($_SERVER['HTTP_APPNAME'],$file_new_name, $_FILES['photo']['tmp_name'][$i] , $attr, true);
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
	
	return $result;
}
?>