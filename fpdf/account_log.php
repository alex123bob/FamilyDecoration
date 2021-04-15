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
include_once 'pdf_chinese_account_log.php';

$accountLogSvc = BaseSvc::getSvc('AccountLog');
$logs = $accountLogSvc->get($_REQUEST);
$logs = $logs['data'];

$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";
$pdf=new PDF('P','mm', 'A4'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf=new PDF('P','mm', 'A4'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 
$pdf->AliasNbPages("__totalPage__");
$titles = array('','����','����','����','�˻����','��ע','�˶���');
$widths = array(5,40,20,20,20,55,20);
$aligns = array('C','C','C','C','C','C','C');
$pdf->writeCellLine($widths,$titles,'LTBR','','C',7,10,$fontStyles = array());
$i = 1;
foreach($logs as $value) {
	$data = array();
	$data[0] = $i++;
	$data[1] = $value['createTime'];
	$data[2] = $value['type'] == 'in' || $value['type'] == 'add' ? $value['amount'] : '';
	$data[3] = $value['type'] == 'out' ? $value['amount'] : '';
	$data[4] = $value['balance'];
	$data[5] = str2GBK($value['desc']);
	$data[6] = str2GBK($value['operatorRealName']);
	$pdf->writeCellLine($widths,$data,'LTBR','',$aligns,7,10,$fontStyles = array());
}

$pdf->Ln();
$pdf->Cell(11,21,"");
$pdf->Ln();
$pdf->Output($address.".pdf", $action == "view" ? "I" : "D" );
?>