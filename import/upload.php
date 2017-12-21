<?php
include_once "../libs/conn.php";

global $IS_SAE;
$IS_SAE = defined("SAE_MYSQL_HOST_M");

if(!isset($_FILES) || !isset($_FILES['photo']) || !isset($_FILES['photo']['tmp_name']) || $_FILES['photo']['tmp_name'][0] =="") 
	throw new Exception("没有文件或者文件太大！");

$names = $_FILES['photo']['name'];
$tmpNames = $_FILES['photo']['tmp_name'];

$filename = handleFiles($tmpNames,$names)[0];
require_once 'PHPExcel-1.8.1/Classes/PHPExcel/IOFactory.php';
require_once $_REQUEST['type'].'.php';
$reader = PHPExcel_IOFactory::createReader('Excel2007');
$sql = parseContent($reader->load($filename), $filename);

echo $sql;

function handleFiles($tmpNames,$names){
	global $IS_SAE;
	$res = array();
	$ext_arr = array();
	for ($i = 0; $i < count($names); $i++) {
		$tmp = explode(".", $names[$i]);
		$tmp = $tmp[count($tmp) - 1];
		if($tmp != 'xlsx'){
			throw new Exception("只支持xlsx文件，不支持 $tmp 文件！");
		}
		array_push($ext_arr, $tmp);
	}
	if($IS_SAE){
		$st = new SaeStorage();
		$attr = array('encoding'=>'gzip');
		for ($i = 0; $i < count($names); $i++) {
			$file_new_name = date("YmdHis").'.'.$ext_arr[$i];
			$oName = $names[$i];
			$fileSize = filesize($_FILES['photo']['tmp_name'][$i]);
			if(!$st->upload('imports',$file_new_name, $_FILES['photo']['tmp_name'][$i] , $attr, true)){
				throw new Exception("文件".$names[$i]."上传失败！");
			}
			array_push($res, $file_new_name);
		}
	}else{
		$directory = "../resources/imports/";
		if(!file_exists($directory) && !mkdir($directory))
			throw new Exception("文件夹创建失败!".$directory);
		for ($i = 0; $i < count($names); $i++) {
			$file_new_name = date("YmdHis").'.'.$ext_arr[$i];
			$tName = $tmpNames[$i];
			$oName = $names[$i];
			if (!move_uploaded_file ($tName,$directory.$file_new_name)) {
				throw new Exception("文件$oName上传失败！");
			}
			array_push($res, $directory.$file_new_name);
		}
	}
	return $res;
}
?>