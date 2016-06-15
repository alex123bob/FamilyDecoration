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
//ȫ������
$GfontSize		= 10; // 1~5 ����10,6����9,7����8,8����6
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_plan.php';

$planSvc = BaseSvc::getSvc('PlanMaking');

$plan = $planSvc->get(array('id'=>$_REQUEST['id']));
if($plan['total'] == 0 )
	throw 'û���ҵ�idΪ'.$_REQUEST['id'].'�ļƻ�!';
$plan = $plan['data'][0];
$name = str2GBK($plan['custName']);
$address = str2GBK($plan['projectAddress']);
$planItems = $planSvc->getItems(array('planId'=>$_REQUEST['id']));
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";

$pdf=new PDF('L','mm', 'A3'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->Open(); //��ʼ����PDF 
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 

$pdf->AliasNbPages("__totalPage__");

$start=$plan['startTime'];
$end=$plan['endTime'];

$month = array();
$header1 =array();
$days = array();
$header1Borders = array('LT','LT','LT');
$width = array(5,13,13);  //������п��, ���,��Ŀ,����Ŀ
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


$titleLineHeight1 = 6;   //��ͷ�ϰ벿���и�
$titleLineHeight2 = 12;   //��ͷ�°벿���и�
$height = 8; //���ݱ��ÿ�и߶�
$xuhaoLineHeight = ($titleLineHeight1  + $titleLineHeight2);  //����ܸ߶�

//--------��ͷ�����ʼ
$pdf->Cell($width[0],$xuhaoLineHeight/2,'��','LRT',2,'C',0);
$pdf->Cell($width[0],$xuhaoLineHeight/2,'��','LRB',0,'C',0);
$pdf->SetXY($pdf->getx(),$pdf->gety()- $xuhaoLineHeight/2);
$pdf->Cell($width[1],$titleLineHeight1+$titleLineHeight2,'��Ŀ','LTRB',0,'C',0);
$pdf->Cell($width[2],$titleLineHeight1+$titleLineHeight2,'����Ŀ','LTRB',0,'C',0);
foreach ($months as $key => $value) {  //����·�
	if(startWith($value,'0'))
		$value = substr($value, 1);
	$pdf->Cell($singleDayWidth*$value,$titleLineHeight1,$key.'��','LTRB',0,'C',0);
}
$pdf->ln();
$pdf->SetXY($pdf->getx()+$width[0]+$width[1]+$width[2],$pdf->gety());
$count = 1;

if(count($months)>5)  //����6����,�������С
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
//--------��ͷ�������


//-------һά�����ɶ�ά���� --����list--С��list
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
//--------������ݿ�ʼ
foreach($bigItems as $key => $bigItem) {
	$smallItems = $bigItem['smallItems'];
	$smallCount = count($smallItems);
	$bigItemName = str2GBK($bigItem['itemName']);
	//��������Ҫ������
	$bigItemNameLines = $pdf->GetStringShowLines($bigItemName,$width[1]);
	//����С�������
	$allSmallItemsLines = 0;//����С��һ����Ҫ����
	foreach ($smallItems as $key => &$item) {
		$smallItemName = str2GBK($item['itemName']);
		//��ǰС������Ҫ������
		$smallItemNameLines = $pdf->GetStringShowLines($smallItemName,$width[2]);
		$item['linesNeed'] = $smallItemNameLines;
		$allSmallItemsLines += $smallItemNameLines;
	}
	//��ǰ��������Ҫ������
	$bigItem['itemNamelinesNeed'] = $bigItemNameLines;
	//����С����Ҫ��������
	$bigItem['smallItemLinesNeed'] = $allSmallItemsLines;
	//��ǰ����ʵ����Ҫ������
	$itemLines = $bigItemNameLines > $allSmallItemsLines ? $bigItemNameLines : $allSmallItemsLines;
	$startX = $pdf->getx();
	$startY = $pdf->gety();
	//������
	$pdf->Cell($width[0],$height*$itemLines,'','LBTR',0,'C',0);
	//���������
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
	//---�������������
	//�������Ŀ
	foreach ($smallItems as $key => &$item) {
		$smallStartX = $pdf->getx();
		$smallStartY = $pdf->gety();
		//���С����
		if($bigItem['itemNamelinesNeed'] == $itemLines){
			//��������߶���Ϊ�������ſ���,Ҫ�ټ���С��߶�
			//������Ļ�,С���������������
		}else{
			//��������߶���Ϊ�������ſ���,����Ҫ����С��߶�
		}
		if($item['linesNeed'] == 1){
			$pdf->Cell($width[2],$height,str2GBK($item['itemName']),'LTBR',2,'C',0);
		}else{
			$pdf->MultiCell($width[2],$height,str2GBK($item['itemName']),'LBTR','C',false,$height);
		}
		$pdf->setXY($smallStartX+$width[2],$smallStartY);
		//---���С��������
		//����������
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