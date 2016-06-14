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
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_plan.php';

$billSvc = BaseSvc::getSvc('StatementBill');
$billItemSvc = BaseSvc::getSvc('StatementBillItem');

$bill = $billSvc->get($_REQUEST);

$bill = $bill['data'][0];
$name = str2GBK($bill['payee']);
$phone = $bill['phoneNumber'];
$times = $bill['payedTimes'];
$address = str2GBK($bill['projectName']);
$totalFee = $bill['totalFee'];
$finishPercentage = str2GBK($bill['projectProgress']);
$requiredFee = $bill['claimAmount'];
$cny = str2GBK(cny($requiredFee));

$billItems = $billItemSvc->get(array('billId'=>$_REQUEST['id']));
$billItems = $billItems['data'];
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";

$pdf=new PDF('L','mm', 'A3'); //创建新的FPDF对象 
$pdf->AddGBFont(); //设置中文字体 
$pdf->Open(); //开始创建PDF 
$pdf->AddPage(); //增加一页 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //设置字体样式 
$pdf->AliasNbPages("__totalPage__");

$start='2015-02-24';
$end='2015-03-12';

$days = array();
$months = array();
$months2 =array();
$width = array(12,13,13);
$leftNameWith = 12+13+13;
$timespanWidth = $pdf->w - $leftNameWith - 15 -15;//margin
$daysInTotal = floor((strtotime($end) - strtotime($start))/60/60/24);
$singleDayWidth = $timespanWidth/$daysInTotal;
array_push($days, '序号');
array_push($days, '项目');
array_push($days, '子项目');

array_push($months2, '序号');
array_push($months2, '项目');
array_push($months2, '子项目');
for($count = 0;$count<$daysInTotal;$count++){
	$day = date('Y-m-d', strtotime($start."+$count day"));
	$tmp = explode('-', $day);
	if(!isset($months['m'.$tmp[1]])){
		$months['m'.$tmp[1]] = 0;
		array_push($months2,$tmp[1]);
	}
	$months['m'.$tmp[1]] ++;
	array_push($days, $tmp[2]);
	array_push($months2,'');
	array_push($width,$singleDayWidth);
}


$pdf->writeCellLine($width,$months2,'LTBR','','C',$times=$daysInTotal+3,$fontSizes=10,$fontStyles = array());
$pdf->writeCellLine($width,$days,'LTBR','','C',$times=$daysInTotal+3,$fontSizes=10,$fontStyles = array());

$totalBillCount = 0;
foreach($billItems as $value) {
	$pdf->writeCellLine($width,$days,'LTBR','','C',$times=$daysInTotal+3,$fontSizes=10,$fontStyles = array());
}

$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(175,5,'','R','','L');
$pdf->ln();
$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(175,5,'','R','','L');
$pdf->ln();

$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(115,5,'大写金额: '.str2GBK(cny($totalBillCount)),'','','L');
$pdf->Cell(60,5,'领款人(签字):','R','','L');
$pdf->ln();

$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(145,5,'','','','L');
$pdf->Cell(30,5,'年     月      日','R','','L');
$pdf->ln();
$pdf->Cell(10,5,'','LB','','L');
$pdf->Cell(175,5,'','RB','','L');

/*
$borderT = array('LT','T','T','T','T','RT');
$borderM = array('L','','','','','R');
$borderM = array('L','','','','','R');
$borderB = array('LB','B','B','B','B','RB');
$pdf->writeCellLine($widths,'',$borderT,'','C',$times=6,$fontSizes=10,$fontStyles = array());
$data = array('','大写金额:'.str2GBK(cny($totalBillCount)),'','','领款人(签字):','');
$margin=array('R','L','','','R','L');
$pdf->writeCellLine($widths,$data,$borderM,'',$margin,$times=6,$fontSizes=10,$fontStyles = array());
$data = array('','','','','年','    月    日');
$margin=array('R','L','','','R','L');
$pdf->writeCellLine($widths,$data,$borderM,'',$margin,$times=6,$fontSizes=10,$fontStyles = array());
$pdf->writeCellLine($widths,'',$borderB,'','C',$times=6,$fontSizes=10,$fontStyles = array());
*/

$pdf->Ln();
$pdf->Cell(11,21,"");
//$pdf->Cell(200,$titleHeightPosition,'    注： 1、 本报价单为合同附件， 具有同等法律效力， 业主签字后生效。');
$pdf->Ln();
$pdf->Output($address.".pdf", $action == "view" ? "I" : "D" );

$pdf->writeCellLine($CellWidth,$data,0,0,'R');

?>  