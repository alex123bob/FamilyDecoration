<?php

Class ErrorLogSvc extends BaseSvc{


	public function delete($q){
		global $mysql;
		$mysql->DBExecute("delete from error_log where createTime = '".$q['createTime']."';");
		return array('status'=>'successful');
	}
}
?>