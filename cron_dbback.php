<?php
header("Content-type: text/html; charset=utf-8");

function backupDB(){
  	echo "backup db job added. will run sometime backup to : $date.sql.zip";
    $date = date('Y-m-d-H-i-s'); 
	$dj = new SaeDeferredJob();
	$taskID = $dj->addTask("export","mysql","dbback","$date.sql.zip",SAE_MYSQL_DB,"","");
	if($taskID === false) {
		var_dump($dj->errno(), $dj->errmsg());
		return "db backup error ! code:".$dj->errno()." msg:".$dj->errmsg();
	}else{
		return "backup db job added. will run sometime, backup to : $date.sql.zip";
	}
}

echo backupDB();
?>