<?php
$HTTPHeader= "<!DOCTYPE HTML>\n<html>\n<head>\n <meta http-equiv=Content-Type content='text/html;charset=utf-8'>\n<style>\n.detail{font-size:11px;color:#999;}\ntr{background-color:#BCE6DB;}\ntr:hover{background-color:#CC7E6F;cursor:pointer;}\ntr{background-color:#E4C4BE;}\ntd{border:#eee 1px solid;padding:5px;font-size:13px;}\ntable{border:0;margin:0;border-collapse:collapse;border-spacing:0;}\n</style>\n</head>\n<body>\n";
$HTTPFooter  = "\n</body>\n</html>";
echo $HTTPHeader;
echo "<table>\n\t";

$start = '999';
$end = 'fff';
$minus = '222';

$group = isset($_REQUEST['group']) ? $_REQUEST['group'] : 10;
$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : $start;
$end = isset($_REQUEST['end']) ? $_REQUEST['end'] : $end;
$minus = isset($_REQUEST['minus']) ? $_REQUEST['minus'] : $minus;



$start= str_split($start);
$end= str_split($end);

$recentlyUsedColor = array();

for($i=0;$i<100;$i++){
	if(count($recentlyUsedColor) == 0 || intVal($i%$group) == 0){
		do{
			$color =  base_convert(rand(base_convert($start[0],16,10),base_convert($end[0],16,10)),10,16)
					 .base_convert(rand(base_convert($start[1],16,10),base_convert($end[1],16,10)),10,16)
					 .base_convert(rand(base_convert($start[2],16,10),base_convert($end[2],16,10)),10,16);
			$color = base_convert($color,16,10);
		}while(in_array($color,$recentlyUsedColor));
		
		array_push($recentlyUsedColor,$color);
		if(count($recentlyUsedColor) > 10){
			array_shift($recentlyUsedColor);
		}
	}
	$tmp = intVal($i%2) == 1 ? $color  : ($color - base_convert($minus,16,10));
	echo "<tr style='background-color:#".base_convert($tmp,10,16)."'>\n\t\t<td>业务员".intVal($i/$group)."</td>\n\t\t<td>邮箱</td>\n\t\t<td>小区</td>\n\t\t<td>业务地址</td>\n\t\t<td>客户</td>\n\t\t<td>客户手机</td>\n\t\t<td>设计师</td>\n\t\t<td>创建时间</td>\n\t\t<td>最后更新时间</td><td>最后更新时间</td>\n\t</tr>\n";
}
echo  "</table><br /><br />\n\n";
echo "<br /><br /><hr /><br /><br />\n\n\n\n";
echo $HTTPFooter;


?>