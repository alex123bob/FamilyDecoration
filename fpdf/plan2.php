<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

global $name,$phone,$times,$address,$totalFee,$finishPercentage,$requiredFee,$cny,$start,$end;

//全局字体
$GfontSize		= 10; 
$GfontStyle		= ''; // B bold,U:underline

$titleLineHeight1 = 6;   //表头上半部分行高
$titleLineHeight2 = 12;   //表头下半部分行高
$height = 6; //数据表格每行高度
$width = array();  //左侧三列宽度, 序号,项目,子项目
$pagetype = isset($_REQUEST['page']) ? $_REQUEST['page'] : 'A4';
array_push($width, isset($_REQUEST['c1']) ? isset($_REQUEST['c1']) : 5); //序号宽度
array_push($width, isset($_REQUEST['c2']) ? isset($_REQUEST['c2']) : 40); //序号宽度
array_push($width, isset($_REQUEST['c3']) ? isset($_REQUEST['c3']) : 50); //序号宽度
$xuhaoLineHeight = ($titleLineHeight1  + $titleLineHeight2);  //序号总高度
$leftNameWith = $width[0]+$width[1]+$width[2];   //左侧三列

include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_plan.php';

$planSvc = BaseSvc::getSvc('PlanMaking');
$plan = $planSvc->get(array('id'=>$_REQUEST['id']));
if($plan['total'] == 0 ){
	header("Content-type: text/html; charset=gbk");
	$msg = '没有找到id为'.$_REQUEST['id'].'的计划!';
	echo $msg;
	throw new Exception($msg);
}
$plan = $plan['data'][0];

$projectSvc = BaseSvc::getSvc('Project');
$project = $projectSvc->get(array('projectId'=>$plan['projectId']));
if($project['total'] == 0 ){
	header("Content-type: text/html; charset=gbk");
	$msg = '没有找到id为'.$plan['projectId'].'的项目!';
	echo $msg;
	throw new Exception($msg);
}
$project = $project['data'][0];

$name = str2GBK($plan['custName']);
$address = str2GBK($plan['projectAddress']);
$planItems = $planSvc->getItems(array('planId'=>$_REQUEST['id']));
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";

//默认使用计划的时间，如果有项目时间，优先使用项目的
$start=$plan['startTime'];
$end=$plan['endTime'];
if(isset($project['period']) && $project['period'] != null && $project['period'] != "" && contains($project['period'],":")){
	$start = explode(":",$project['period'])[0];
	$end = explode(":",$project['period'])[1];
}

$pdf=new PDF('L','mm', $pagetype); //创建新的FPDF对象 
$pdf->AddGBFont(); //设置中文字体 
$fillColor = 1;
$pdf->SetFillColor(125,125,125);//设置填充颜色
$pdf->AddPage(); //增加一页 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //设置字体样式 

$pdf->AliasNbPages("__totalPage__");
 
$month = array();
$days = array();
$header1Borders = array('LT','LT','LT');
$timespanWidth = $pdf->w - $leftNameWith - 15 -15;//右侧时间表占用宽度.  - page margin
$daysInTotal = floor((strtotime($end) - strtotime($start))/60/60/24)+1;
$singleDayWidth = $timespanWidth/$daysInTotal;

for($count = 0;$count<$daysInTotal;$count++){
	$v = date('Y-m-d', strtotime($start."+$count day"));
	$tmp = explode('-', $v);
	$day = $tmp[2];
	$month = $tmp[1];
	if(!isset($months[$month])){
		$months[$month] = 0;
		array_push($header1Borders,'LBT');
	}else{
		array_push($header1Borders,$daysInTotal == $count +1 ? 'TBR':'TB');
	}
	$months[$month] ++;
	array_push($days,$day);
	array_push($width,$singleDayWidth);
}


//--------表头输出开始
$pdf->Cell($width[0],$xuhaoLineHeight/2,'序','LRT',2,'C',0);
$pdf->Cell($width[0],$xuhaoLineHeight/2,'号','LRB',0,'C',0);
$pdf->SetXY($pdf->getx(),$pdf->gety()- $xuhaoLineHeight/2);
$pdf->Cell($width[1],$titleLineHeight1+$titleLineHeight2,'项目','LTRB',0,'C',0);
$pdf->Cell($width[2],$titleLineHeight1+$titleLineHeight2,'子项目','LTRB',0,'C',0);
foreach ($months as $key => $value) {  //输出月份
	if(startWith($key,'0'))
		$key = substr($key, 1);
	$pdf->Cell($singleDayWidth*$value,$titleLineHeight1,$key.'月','LTRB',0,'C',0);
}
$pdf->ln();
$pdf->SetXY($pdf->getx()+$width[0]+$width[1]+$width[2],$pdf->gety());
$count = 1;

if(count($months)>5)  //超过6个月,每多一个月,字体小2号
	$pdf->SetFont("GB",$GfontStyle,$GfontSize - (count($months)-5)*2); //设置字体样式 

foreach ($days as $key => $value) { //输出日期
	if(startWith($value,'0'))
		$value = substr($value, 1);
	$d1 = $count%2==0 ? $value : '';
	$d2 = $count%2==0 ? '' : $value;
	
	$border = 'BT';
	if($d1 == '1' || $d2 == '1')
		$border .= 'L';
	if($value %10 == 0 && $value != 30)
		$border .= 'R';	
	if($daysInTotal == $count)
		$border .= 'R';
	$pdf->Cell($singleDayWidth,$titleLineHeight2/2,$d1,$border ,2,'C',0);
	$pdf->Cell($singleDayWidth,$titleLineHeight2/2,$d2,$border.'B',0,'C',0);
	$pdf->SetXY($pdf->getx(),$pdf->gety()-$titleLineHeight2/2);
	$count++;
}
$pdf->ln();
$pdf->SetXY($pdf->getx(),$pdf->gety()+$titleLineHeight2/2);
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //设置回字体 
//--------表头输出结束


//-------一维数组变成二维数组 --大项list--小项list
$bigItems = array();
foreach($planItems as &$smallItem) {
	$parentItemName = $smallItem['parentItemName'];
	if(!isset($bigItems[$parentItemName])){
		$bigItems[$parentItemName] = array();
		$bigItems[$parentItemName]['itemName'] = $parentItemName;
		$bigItems[$parentItemName]['smallItems'] = array();
	}
	array_push($bigItems[$parentItemName]['smallItems'], $smallItem);
}
//--------输出内容开始
foreach($bigItems as $key => $bigItem) {
	$smallItems = $bigItem['smallItems'];
	$smallCount = count($smallItems);
	$bigItemName = str2GBK($bigItem['itemName']);
	//大项名需要的行数
	$bigItemNameLines = $pdf->GetStringShowLines($bigItemName,$width[1]);
	//所有小项的行数
	$allSmallItemsLines = 0;//所有小项一共需要几行
	foreach ($smallItems as $key => &$item) {
		$smallItemName = str2GBK($item['itemName']);
		//当前小项名需要的行数
		$smallItemNameLines = $pdf->GetStringShowLines($smallItemName,$width[2]);
		$item['linesNeed'] = $smallItemNameLines;
		$allSmallItemsLines += $smallItemNameLines;
	}
	//当前大项名需要的行数
	$bigItem['itemNamelinesNeed'] = $bigItemNameLines;
	//所有小项需要的总行数
	$bigItem['smallItemLinesNeed'] = $allSmallItemsLines;
	//当前大项实际需要的行数
	$itemLines = $bigItemNameLines > $allSmallItemsLines ? $bigItemNameLines : $allSmallItemsLines;
	//记录下起始位置,等下换行对齐
	$startX = $pdf->getx();
	$startY = $pdf->gety();
	//输出序号
	$pdf->Cell($width[0],$height*$itemLines,'','LBTR',0,'C',0);
	//输出大项名
	if($bigItem['itemNamelinesNeed'] == $itemLines){
		$pdf->MultiCell($width[1],$height,$bigItemName,'LBRT','C',false,$height);
		$pdf->ln();
		$pdf->setXY($startX+$width[0]+$width[1],$pdf->gety()-$height*($itemLines+1));
	}else{
		$linesLeft =  $itemLines - $bigItem['itemNamelinesNeed'];
		$frontLines = intval($linesLeft/2);
		$endLines = intval($linesLeft/2)+$linesLeft%2;
		$pdf->Cell($width[1],$height*$frontLines,'','LTR',2,'C',0);
		$pdf->MultiCell($width[1],$height,$bigItemName,'LR','C',false,$height);
		$pdf->Cell($width[1]+$width[0],$height*$endLines,'','LBR',0,'C',0);
		$pdf->ln();
		$pdf->setXY($startX+$width[0]+$width[1],$pdf->gety()-$height*$itemLines);
	}
	
	//---输出大项名结束
	//---输出子项
	//计算子项行高
	$tmpheight = $height;
	if($bigItem['itemNamelinesNeed'] > $bigItem['smallItemLinesNeed']){
		//整个高度等于大项的高度,要把小项拉高
		$tmpheight = $tmpheight*$bigItem['itemNamelinesNeed']/$bigItem['smallItemLinesNeed'];
	}
	//输出子项目
	$lastPageNum = $pdf->page;
	foreach ($smallItems as $key => &$item) {
		$startX = $pdf->getx();
		$startY = $pdf->gety();
		//输出小项名
		$pdf->MultiCell($width[2],$tmpheight,str2GBK($item['itemName']),'LBTR','L',false,$height);
		$pdf->setXY($startX + $width[2],$startY);
		//---输出小项名结束
		//输出日期填充
		$alldaysdata = getdaysfill($item['startTime'],$item['endTime'],$daysInTotal);
		$smallCount = 0;
		$fillColor = 0;
		foreach ($days as $key => $value) { //输出日期
			if(startWith($value,'0'))
				$value = substr($value, 1);
			$border = 'TB';
			if($fillColor){
				$pdf->SetFillColor(230,230,230);//设置填充颜色
				$pdf->SetFillColor(255,255,255);//设置填充颜色
			}else{
				$pdf->SetFillColor(255,255,255);//设置填充颜色
			}
			if($value == '1' || $smallCount == 0){
				$fillColor = $fillColor == 1 ? 0 : 1;
				$border .= 'L';
			}	
			if($value % 10 == 0 && $value != 30 || $smallCount+1 == $daysInTotal)
				$border .= 'R';
			if($alldaysdata[$smallCount] == 1){
				$pdf->SetFillColor(125,125,125);
				$pdf->Cell($singleDayWidth,$tmpheight*$item['linesNeed'],'','BLRT',0,'L',1);
			}else{
				$pdf->Cell($singleDayWidth,$tmpheight*$item['linesNeed'],'',$border,0,'L',0);
			}
			$smallCount++;
		}
		$pdf->ln();
		$pdf->SetXY($pdf->getx()+$width[0]+$width[1],$pdf->gety());
	}
	$pdf->SetXY($pdf->getx()-$width[0]-$width[1],$pdf->gety());
}
$pdf->Output($address.".pdf", $action == "view" ? "I" : "D" );
?>  
