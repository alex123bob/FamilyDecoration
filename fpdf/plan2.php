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

//ȫ������
$GfontSize		= 10; 
$GfontStyle		= ''; // B bold,U:underline

$titleLineHeight1 = 6;   //��ͷ�ϰ벿���и�
$titleLineHeight2 = 12;   //��ͷ�°벿���и�
$height = 6; //���ݱ���ÿ�и߶�
$width = array();  //������п���, ���,��Ŀ,����Ŀ
$pagetype = isset($_REQUEST['page']) ? $_REQUEST['page'] : 'A4';
array_push($width, isset($_REQUEST['c1']) ? isset($_REQUEST['c1']) : 5); //��ſ���
array_push($width, isset($_REQUEST['c2']) ? isset($_REQUEST['c2']) : 40); //��ſ���
array_push($width, isset($_REQUEST['c3']) ? isset($_REQUEST['c3']) : 50); //��ſ���
$xuhaoLineHeight = ($titleLineHeight1  + $titleLineHeight2);  //����ܸ߶�
$leftNameWith = $width[0]+$width[1]+$width[2];   //�������

include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_plan.php';

$planSvc = BaseSvc::getSvc('PlanMaking');
$plan = $planSvc->get(array('id'=>$_REQUEST['id']));
if($plan['total'] == 0 ){
	header("Content-type: text/html; charset=gbk");
	$msg = 'û���ҵ�idΪ'.$_REQUEST['id'].'�ļƻ�!';
	echo $msg;
	throw new Exception($msg);
}
$plan = $plan['data'][0];

$projectSvc = BaseSvc::getSvc('Project');
$project = $projectSvc->get(array('projectId'=>$plan['projectId']));
if($project['total'] == 0 ){
	header("Content-type: text/html; charset=gbk");
	$msg = 'û���ҵ�idΪ'.$plan['projectId'].'����Ŀ!';
	echo $msg;
	throw new Exception($msg);
}
$project = $project['data'][0];

$name = str2GBK($plan['custName']);
$address = str2GBK($plan['projectAddress']);
$planItems = $planSvc->getItems(array('planId'=>$_REQUEST['id']));
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";

//Ĭ��ʹ�üƻ���ʱ�䣬�������Ŀʱ�䣬����ʹ����Ŀ��
$start=$plan['startTime'];
$end=$plan['endTime'];
if(isset($project['period']) && $project['period'] != null && $project['period'] != "" && contains($project['period'],":")){
	$start = explode(":",$project['period'])[0];
	$end = explode(":",$project['period'])[1];
}

$pdf=new PDF('L','mm', $pagetype); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$fillColor = 1;
$pdf->SetFillColor(125,125,125);//���������ɫ
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
$pdf->Cell($width[0],$xuhaoLineHeight/2,'��','LRB',0,'C',0);
$pdf->SetXY($pdf->getx(),$pdf->gety()- $xuhaoLineHeight/2);
$pdf->Cell($width[1],$titleLineHeight1+$titleLineHeight2,'��Ŀ','LTRB',0,'C',0);
$pdf->Cell($width[2],$titleLineHeight1+$titleLineHeight2,'����Ŀ','LTRB',0,'C',0);
foreach ($months as $key => $value) {  //����·�
	if(startWith($key,'0'))
		$key = substr($key, 1);
	$pdf->Cell($singleDayWidth*$value,$titleLineHeight1,$key.'��','LTRB',0,'C',0);
}
$pdf->ln();
$pdf->SetXY($pdf->getx()+$width[0]+$width[1]+$width[2],$pdf->gety());
$count = 1;

if(count($months)>5)  //����6����,ÿ��һ����,����С2��
	$pdf->SetFont("GB",$GfontStyle,$GfontSize - (count($months)-5)*2); //����������ʽ 

foreach ($days as $key => $value) { //�������
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
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //���û����� 
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
	//��¼����ʼλ��,���»��ж���
	$startX = $pdf->getx();
	$startY = $pdf->gety();
	//������
	$pdf->Cell($width[0],$height*$itemLines,'','LBTR',0,'C',0);
	//���������
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
	
	//---�������������
	//---�������
	//���������и�
	$tmpheight = $height;
	if($bigItem['itemNamelinesNeed'] > $bigItem['smallItemLinesNeed']){
		//�����߶ȵ��ڴ���ĸ߶�,Ҫ��С������
		$tmpheight = $tmpheight*$bigItem['itemNamelinesNeed']/$bigItem['smallItemLinesNeed'];
	}
	//�������Ŀ
	$lastPageNum = $pdf->page;
	foreach ($smallItems as $key => &$item) {
		$startX = $pdf->getx();
		$startY = $pdf->gety();
		//���С����
		$pdf->MultiCell($width[2],$tmpheight,str2GBK($item['itemName']),'LBTR','L',false,$height);
		$pdf->setXY($startX + $width[2],$startY);
		//---���С��������
		//����������
		$alldaysdata = getdaysfill($item['startTime'],$item['endTime'],$daysInTotal);
		$smallCount = 0;
		$fillColor = 0;
		foreach ($days as $key => $value) { //�������
			if(startWith($value,'0'))
				$value = substr($value, 1);
			$border = 'TB';
			if($fillColor){
				$pdf->SetFillColor(230,230,230);//���������ɫ
				$pdf->SetFillColor(255,255,255);//���������ɫ
			}else{
				$pdf->SetFillColor(255,255,255);//���������ɫ
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
