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
//ȫ������
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_account_anlysis.php';

$accountLogMonthlyCheckSvc = BaseSvc::getSvc('AccountLogMonthlyCheck');
$logs = $accountLogMonthlyCheckSvc->get($_REQUEST);
$logs = $logs['data'];

$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";
$pdf=new PDF('P','mm', 'A4'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->Open(); //��ʼ����PDF 
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 
$pdf->AliasNbPages("__totalPage__");
$titles = array('','����','����','����','�˻����','�˶���');
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