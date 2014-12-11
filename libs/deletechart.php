<?php
	$arr = $_POST["filename"];
	$arr = explode("<>", $arr);

	$flag = true;
	for ($i = 0; $i < count($arr); $i++) {
		$filename = $arr[$i];
		$filename = explode("||", $filename);

		if (is_array($filename)) {
			$filename = $filename[0];
		}

		if (file_exists($filename)) {
			if (@unlink($filename)) {
			} 
			else {
				$flag = false;
				break;
			}
		}
	}
	
	if ($flag) {
		echo json_encode(array('status'=>'successful', 'errMsg' => ''));
	}
	else {
		echo json_encode(array('status' => 'failing', 'errMsg'=>"文件删除失败！"));
	}
?>