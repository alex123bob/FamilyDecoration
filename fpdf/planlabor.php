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
		"0001"=>"��ש�๤",
		"0006"=>"�����๤",
		"0002"=>"ľ��",
		"0003"=>"���Ṥ",
		"0004"=>"ˮ�繤",
		"0005"=>"����",
		"0009"=>"��������"
	);
//ȫ������
$GfontSize		= 10; 
$GfontStyle		= ''; // B bold,U:underline

$titleLineHeight1 = 6;   //��ͷ�ϰ벿���и�
$titleLineHeight2 = 8;   //��ͷ�°벿���и�
$height = 6; //���ݱ���ÿ�и߶�
$width = array();  //���1�п���, ��Ŀ����
$pagetype = isset($_REQUEST['page']) ? $_REQUEST['page'] : 'A4';
array_push($width, 10); //��ſ���
array_push($width, 45); //������Ŀ����
$xuhaoLineHeight = ($titleLineHeight1  + $titleLineHeight2);  // ��Ŀ����
$leftNameWith = $width[0]+ $width[1];

include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_planlabor.php';

$planSvc = BaseSvc::getSvc('PlanMaking');
$plans = $planSvc->getLaborPlanByProfessionType(array('professionType'=>$_REQUEST['professionType']));
if(count($plans) == 0 ){
	header("Content-type: text/html; charset=gbk");
	$msg = 'û���ҵ�����Ϊ'.$professionTypes[$_REQUEST['professionType']].'���ù��ƻ�!';
	echo $msg;
	throw new Exception($msg);
}

$pageSizeFit = array('A3'=>30,'A4'=>20,'A1'=>150,'A2'=>90);
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";

//Ĭ��ʹ�üƻ���ʱ�䣬�������Ŀʱ�䣬����ʹ����Ŀ��
$timespan = $planSvc->getTimeSpanByProfessionType(array('professionType'=>$_REQUEST['professionType']));

$start=$timespan['startTime'];
$end=$timespan['endTime'];

$pdf=new PDF('L','mm', $pagetype); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->SetFillColor(85);
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 

$pdf->AliasNbPages("__totalPage__");
 
$month = array();
$days = array();
$header1Borders = array('LT','LT','LT');
$timespanWidth = $pdf->w - $leftNameWith - 15 -15;//�Ҳ�ʱ���ռ�ÿ���.  - page margin
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


//--------��ͷ�����ʼ
$pdf->Cell($width[0],$xuhaoLineHeight/2,'��','LRT',2,'C',0);
$pdf->Cell($width[0],$xuhaoLineHeight/2,'��','LR',2,'C',0);
$pdf->SetXY($pdf->getx()+$width[0],$pdf->gety()- $xuhaoLineHeight);
$pdf->Cell($width[1],$xuhaoLineHeight,'������Ŀ','LRT',2,'C',0);
$pdf->SetXY($pdf->getx()+$width[1], $pdf->gety()- $xuhaoLineHeight);

foreach ($months as $key => $value) {  //����·�
	if(startWith($key,'0'))
		$key = substr($key, 1);
	$pdf->Cell($singleDayWidth*$value,$titleLineHeight1,$key.'��','LTRB',0,'C',0);
}
$pdf->ln();
$pdf->SetXY($pdf->getx()+$width[0]+$width[1],$pdf->gety());
$count = 1;

if(count($months)>5)  //����6����,ÿ��һ����,����С2��
	$pdf->SetFont("GB",$GfontStyle,$GfontSize - (count($months)-5)*2); //����������ʽ 

foreach ($days as $key => $value) { //�������
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
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //���û����� 
//--------��ͷ�������

//--------������ݿ�ʼ
$lineCount = 0;
foreach($plans as $key => $item) {
	$lineCount ++;
	$projectName = str2GBK($item['projectName']);
	$linesNeed = $pdf->GetStringShowLines($projectName,$width[1]);
	//�����Ŀ  mutilCell ����cell����, cell�������Զ���⻻ҳ, ���, �ᴥ�����addPage, ���,��������ֶ�ȥaddPageһ��. fix bug
	if((($pdf->y + (8 * $linesNeed )) > $pdf->PageBreakTrigger)){
		$pdf->addPage();
	}
	
	$startX = $pdf->getx();
	$startY = $pdf->gety();

	$pdf->MultiCell($width[0],8 * $linesNeed,$lineCount,'LBTR','C',false,$height);
	$pdf->setXY($startX + $width[0],$startY);
	$pdf->MultiCell($width[1],8,$projectName,'LBTR','L',0,$height);
	$pdf->setXY($startX + $width[0] + $width[1],$startY);
	//---�����Ŀ����

	//����������
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
$pdf->Output($professionTypes[$_REQUEST['professionType']].'�ù��ƻ���ʱ���('.$start.'��'.$end.').pdf', $action == "view" ? "I" : "D" );
?>  
