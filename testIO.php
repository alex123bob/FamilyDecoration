<?php
	$st = new SaeStorage();
	$domain = $_SERVER['HTTP_APPNAME'];
	
	$action = "view";
	if(isset($_REQUEST['action']){
		$action = $_REQUEST['action'];
	}
   	switch($action){
       case "":
       		$res = $st->delete( string $domain, string $filename );
       		if($res == 0){
       			return array('status'=>'successful', 'errMsg' => '');
            }else{
            	return array
                    
                    $count = 0;
		foreach($arr as $item){
			$res[$count++]['projectYear'] = $item['projectYear'];
		}
            }
       		break;
       case "view":
       default:
       		$fileList =  $st->getList($domain,$_REQUEST['prefix'],$_REQUEST['limit'],$_REQUEST['offset']);
			echo "";
       		
			foreach($fileList as $key=>$val){
                
        		echo "<div>".$val."<br />";
        		echo "<img style='width:200px;height:200px;' src='".$st->getUrl($domain,$val)."'/></div><br />";
   			 }
			echo "</div><br /><br /><br /><div class='clearfloat'></div>";
       break;
   }
   echo urldecode(json_encode($res));  
?>