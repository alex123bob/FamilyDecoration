<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

global $name,$phone,$times,$address,$totalFee,$captain,$finishPercentage,$requiredFee,$cny,$professionTypeName,$billId; 

$lineHeight 	= 6;
//全局字体
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_account_anlysis.php';

$accountLogMonthlyCheckSvc = BaseSvc::getSvc('AccountLogMonthlyCheck');
$logs = $accountLogMonthlyCheckSvc->get($_REQUEST);
$logs = $logs['data'];

$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";
$pdf=new PDF('P','mm', 'A4'); //创建新的FPDF对象 
$pdf->AddGBFont(); //设置中文字体 
$pdf->Open(); //开始创建PDF 
$pdf->AddPage(); //增加一页 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //设置字体样式 
$pdf->AliasNbPages("__totalPage__");
$titles = array('','日期','出账','入账','账户余额','核对人');
$widths = array(10,30,35,35,35,35);
$aligns = array('C','C','C','C','C','C');
$pdf->writeCellLine($widths,$titles,'LTBR','','C',6,10,$fontStyles = array());
$i = 1;
foreach($logs as $value) {
	$data = array();
	$data[0] = $i++;
	$data[1] = $value['checkMonth'];
	$data[2] = $value['income'];
	$data[3] = $value['outcome'];
	$data[4] = $value['balance'];
	$data[5] = str2GBK($value['checker']);
	$pdf->writeCellLine($widths,$data,'LTBR','',$aligns,6,10,$fontStyles = array());
}

$pdf->Ln();
$pdf->Cell(11,21,"");
$pdf->Ln();
$pdf->Output($address.".pdf", $action == "view" ? "I" : "D" );
?>