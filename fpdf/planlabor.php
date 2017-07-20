<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

global $phone,$times,$totalFee,$finishPercentage,$requiredFee,$cny,$start,$end,$professionTypes;

$professionTypes = array(
		"0001"=>"贴砖泥工",
		"0006"=>"基础泥工",
		"0002"=>"木工",
		"0003"=>"油漆工",
		"0004"=>"水电工",
		"0005"=>"力工",
		"0009"=>"其他工种"
	);
//全局字体
$GfontSize		= 10; 
$GfontStyle		= ''; // B bold,U:underline

$titleLineHeight1 = 6;   //表头上半部分行高
$titleLineHeight2 = 8;   //表头下半部分行高
$height = 6; //数据表格每行高度
$width = array();  //左侧1列宽度, 项目名称
$pagetype = isset($_REQUEST['page']) ? $_REQUEST['page'] : 'A4';
array_push($width, 10); //序号宽度
array_push($width, 45); //工程项目宽度
$xuhaoLineHeight = ($titleLineHeight1  + $titleLineHeight2);  // 项目名称
$leftNameWith = $width[0]+ $width[1];

include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_planlabor.php';

$planSvc = BaseSvc::getSvc('PlanMaking');
$plans = $planSvc->getLaborPlanByProfessionType(array('professionType'=>$_REQUEST['professionType']));
if(count($plans) == 0 ){
	header("Content-type: text/html; charset=gbk");
	$msg = '没有找到工种为'.$professionTypes[$_REQUEST['professionType']].'的用工计划!';
	echo $msg;
	throw new Exception($msg);
}

$pageSizeFit = array('A3'=>30,'A4'=>20,'A1'=>150,'A2'=>90);
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";

//默认使用计划的时间，如果有项目时间，优先使用项目的
$timespan = $planSvc->getTimeSpanByProfessionType(array('professionType'=>$_REQUEST['professionType']));

$start=$timespan['startTime'];
$end=$timespan['endTime'];

$pdf=new PDF('L','mm', $pagetype); //创建新的FPDF对象 
$pdf->AddGBFont(); //设置中文字体 
$pdf->Open(); //开始创建PDF 
$pdf->SetFillColor(85);
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
$pdf->Cell($width[0],$xuhaoLineHeight/2,'号','LR',2,'C',0);
$pdf->SetXY($pdf->getx()+$width[0],$pdf->gety()- $xuhaoLineHeight);
$pdf->Cell($width[1],$xuhaoLineHeight,'工程项目','LRT',2,'C',0);
$pdf->SetXY($pdf->getx()+$width[1], $pdf->gety()- $xuhaoLineHeight);

foreach ($months as $key => $value) {  //输出月份
	if(startWith($key,'0'))
		$key = substr($key, 1);
	$pdf->Cell($singleDayWidth*$value,$titleLineHeight1,$key.'月','LTRB',0,'C',0);
}
$pdf->ln();
$pdf->SetXY($pdf->getx()+$width[0]+$width[1],$pdf->gety());
$count = 1;

if(count($months)>5)  //超过6个月,每多一个月,字体小2号
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
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //设置回字体 
//--------表头输出结束

//--------输出内容开始
$lineCount = 0;
foreach($plans as $key => $item) {
	$lineCount ++;
	$projectName = str2GBK($item['projectName']);
	$linesNeed = $pdf->GetStringShowLines($projectName,$width[1]);
	//输出项目  mutilCell 调用cell函数, cell函数会自动检测换页, 因此, 会触发多个addPage, 因此,在这儿仅手动去addPage一次. fix bug
	if((($pdf->y + (8 * $linesNeed )) > $pdf->PageBreakTrigger)){
		$pdf->addPage();
	}
	
	$startX = $pdf->getx();
	$startY = $pdf->gety();

	$pdf->MultiCell($width[0],8 * $linesNeed,$lineCount,'LBTR','C',false,$height);
	$pdf->setXY($startX + $width[0],$startY);
	$pdf->MultiCell($width[1],8,$projectName,'LBTR','L',0,$height);
	$pdf->setXY($startX + $width[0] + $width[1],$startY);
	//---输出项目结束

	//输出日期填充
	$data = array_fill(0, $daysInTotal, 0);
	$contentdata = array_fill(0, $daysInTotal, 0);
	if(isset($item['period']) && is_array($item['period'])  && count($item['period']) > 0){
		$periods = $item['period'];
		foreach($periods as $key => $period) {
			if(isset($period['s']) && isset($period['e']) && $period['s'] != '' && $period['e'] != '') {
				$periodStarDaysFromStartDay = floor((strtotime($period['s']) - strtotime($start))/60/60/24);
				$periodEndDaysFromStartDay = floor((strtotime($period['e']) - strtotime($start))/60/60/24);
				for($i = $periodStarDaysFromStartDay;$i <= $periodEndDaysFromStartDay ;$i++){
					if(isset($data[$i])){
						$data[$i] = 1;
						$contentdata[$i] = $period['c'] == 0 ? 0 : 1;
					}
				}
			}
		}
	}
	for($smallCount = 0;$smallCount < $daysInTotal ;$smallCount++){
		if($contentdata[$smallCount]){
			$pdf->SetFillColor(200);
		}
		$pdf->Cell($singleDayWidth,8*$linesNeed, '','LBTR',0,'L',$data[$smallCount]);
		$pdf->SetFillColor(85);
	}
	$pdf->ln();
}
$pdf->Output($professionTypes[$_REQUEST['professionType']].'用工计划划时间表('.$start.'至'.$end.').pdf', $action == "view" ? "I" : "D" );
?>  
