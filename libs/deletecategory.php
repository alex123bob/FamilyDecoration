<?php
	include_once "chart.php";
	include_once "project.php";
	$chart = $_POST;

	function remove_directory ($dir){
		if ($handle = opendir($dir)) {
			while (false !== ($item = readdir($handle))) {
				if ($item != "." && $item != "..") {
					if (is_dir("$dir/$item")) {
						remove_directory("$dir/$item");
					}
					else {
						unlink("$dir/$item");
					}
				}
			}
			closedir($handle);
			rmdir($dir);
		}
	}

	if (isset($chart["chartId"])) {
		$dir = "../resources/chart/".$chart["chartId"];
	}
	else if (isset($chart["projectId"])) {
		$dir = "../resources/chart/".$chart["projectId"];
	}
	if (file_exists($dir)) {
		remove_directory($dir);
	}
	else {
		// todo
		// directory has not been existed
	}
	
	// edit project if parameters include projectChart.
	if (isset($chart["projectChart"])) {
		echo editProject($chart);
	}
	else {
		echo deleteCategory($chart);
	}
	
?>