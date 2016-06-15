<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

global $name,$phone,$times,$address,$totalFee,$finishPercentage,$requiredFee,$cny; 

$lineHeight 	= 6;
//全局字体
$GfontSize		= 10; // 1~5 个月10,6个月9,7个月8,8个月6
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_plan.php';

$planSvc = BaseSvc::getSvc('PlanMaking');

$plan = $planSvc->get(array('id'=>$_REQUEST['id']));
if($plan['total'] == 0 )
	throw '没有找到id为'.$_REQUEST['id'].'的计划!';
$plan = $plan['data'][0];
$name = str2GBK($plan['custName']);
$address = str2GBK($plan['projectAddress']);
$planItems = $planSvc->getItems(array('planId'=>$_REQUEST['id']));
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";

$pdf=new PDF('L','mm', 'A3'); //创建新的FPDF对象 
$pdf->AddGBFont(); //设置中文字体 
$pdf->Open(); //开始创建PDF 
$pdf->AddPage(); //增加一页 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //设置字体样式 

$pdf->AliasNbPages("__totalPage__");

$start=$plan['startTime'];
$end=$plan['endTime'];

$month = array();
$header1 =array();
$days = array();
$header1Borders = array('LT','LT','LT');
$width = array(5,13,13);  //左侧三列宽度, 序号,项目,子项目
$leftNameWith = 12+13+13;
$timespanWidth = $pdf->w - $leftNameWith - 15 -15;//margin
$daysInTotal = floor((strtotime($end) - strtotime($start))/60/60/24)+1;
$singleDayWidth = $timespanWidth/$daysInTotal;

for($count = 0;$count<$daysInTotal;$count++){
	$v = date('Y-m-d', strtotime($start."+$count day"));
	$tmp = explode('-', $v);
	$day = $tmp[2];
	$month = $tmp[1];
	if(!isset($months[$month])){
		$months[$month] = 0;
		array_push($header1,$month);
		array_push($header1Borders,'LBT');
	}else{
		array_push($header1Borders,$daysInTotal == $count +1 ? 'TBR':'TB');
	}
	$months[$month] ++;
	array_push($header1,'');
	array_push($days,$day);
	array_push($width,$singleDayWidth);
}


$titleLineHeight1 = 6;   //表头上半部分行高
$titleLineHeight2 = 12;   //表头下半部分行高
$height = 8; //数据表格每行高度
$xuhaoLineHeight = ($titleLineHeight1  + $titleLineHeight2);  //序号总高度

//--------表头输出开始
$pdf->Cell($width[0],$xuhaoLineHeight/2,'序','LRT',2,'C',0);
$pdf->Cell($width[0],$xuhaoLineHeight/2,'号','LRB',0,'C',0);
$pdf->SetXY($pdf->getx(),$pdf->gety()- $xuhaoLineHeight/2);
$pdf->Cell($width[1],$titleLineHeight1+$titleLineHeight2,'项目','LTRB',0,'C',0);
$pdf->Cell($width[2],$titleLineHeight1+$titleLineHeight2,'子项目','LTRB',0,'C',0);
foreach ($months as $key => $value) {  //输出月份
	if(startWith($value,'0'))
		$value = substr($value, 1);
	$pdf->Cell($singleDayWidth*$value,$titleLineHeight1,$key.'月','LTRB',0,'C',0);
}
$pdf->ln();
$pdf->SetXY($pdf->getx()+$width[0]+$width[1]+$width[2],$pdf->gety());
$count = 1;

if(count($months)>5)  //超过6个月,把字体调小
	$pdf->SetFont("GB",$GfontStyle,$GfontSize - (count($months)-5)*2); //设置字体样式 

foreach ($days as $key => $value) { //输出日期
	if(startWith($value,'0'))
		$value = substr($value, 1);
	$d1 = $count%2==0 ? $value : '';
	$d2 = $count%2==0 ? '' : $value;
	$pdf->Cell($singleDayWidth,$titleLineHeight2/2,$d1,'LR',2,'C',0);
	$pdf->Cell($singleDayWidth,$titleLineHeight2/2,$d2,'LRB',0,'C',0);
	$pdf->SetXY($pdf->getx(),$pdf->gety()-$titleLineHeight2/2);
	$count++;
}
$pdf->ln();
$pdf->SetXY($pdf->getx(),$pdf->gety()+$titleLineHeight2/2);
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
	$startX = $pdf->getx();
	$startY = $pdf->gety();
	//输出序号
	$pdf->Cell($width[0],$height*$itemLines,'','LBTR',0,'C',0);
	//输出大项名
	if($bigItem['itemNamelinesNeed'] == $itemLines){
		$pdf->MultiCell($width[1],$height,$bigItemName,'LBRT','C',false,$height);
	}else{
		$linesLeft =  $itemLines - $bigItem['itemNamelinesNeed'];
		$frontLines = intval($linesLeft/2)+$linesLeft%2;
		$endLines = intval($linesLeft/2);
		$pdf->Cell($width[1],$height*$frontLines,'','LTR',2,'C',0);
		$pdf->MultiCell($width[1],$height,$bigItemName,'LR','C',false,$height);
		$pdf->Cell($width[1]+$width[0],$height*$endLines,'','LBR',0,'C',0);
	}
	$pdf->setXY($startX+$width[0]+$width[1],$startY);
	//---输出大项名结束
	//输出子项目
	foreach ($smallItems as $key => &$item) {
		$smallStartX = $pdf->getx();
		$smallStartY = $pdf->gety();
		//输出小项名
		if($bigItem['itemNamelinesNeed'] == $itemLines){
			//整个大项高度因为大项名撑开了,要再计算小项高度
			//不计算的话,小项下面结束会留白
		}else{
			//整个大项高度因为大项名撑开了,不需要计算小项高度
		}
		if($item['linesNeed'] == 1){
			$pdf->Cell($width[2],$height,str2GBK($item['itemName']),'LTBR',2,'C',0);
		}else{
			$pdf->MultiCell($width[2],$height,str2GBK($item['itemName']),'LBTR','C',false,$height);
		}
		$pdf->setXY($smallStartX+$width[2],$smallStartY);
		//---输出小项名结束
		//输出日期填充
		for($smallCount = 0;$smallCount < $daysInTotal ;$smallCount++){
			$pdf->Cell($singleDayWidth,$height*$item['linesNeed'],'1','LBTR',0,'C',0);
		}
		$pdf->ln();
		$pdf->SetXY($pdf->getx()+$width[0]+$width[1],$pdf->gety());
	}
	$pdf->SetXY($pdf->getx()-$width[0]-$width[1],$pdf->gety());
}
$pdf->Output($address.".pdf", $action == "view" ? "I" : "D" );
$pdf->writeCellLine($CellWidth,$data,0,0,'R');
?>  