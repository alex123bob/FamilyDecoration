<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

global $bill; 

$lineHeight 	= 6;
//ȫ������
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_wlf.php';

$billSvc = BaseSvc::getSvc('StatementBill');
$billAuditSvc = BaseSvc::getSvc('StatementBillAudit');
$bills = $billSvc->get($_REQUEST);

$bill = $bills['data'][0];
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";
$pdf=new PDF('P','mm', 'A4'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 
$pdf->AliasNbPages("__totalPage__");
$pdf->ln();
$pdf->Cell(10,20,'','','','L');
$pdf->ln();
$pdf->Cell(114,20,'','','','L');
$pdf->Cell(58,20,'�����(ǩ��):','','','L');


$pdf->ln();

$pdf->Cell(10,5,'','','','L');
$pdf->Cell(145,5,'','','','L');
$pdf->Cell(30,5,'��     ��      ��','','','L');
$pdf->ln();
$pdf->Cell(10,5,'','','','L');
$pdf->Cell(175,5,'','','','L');


$pdf->Ln();
$auditA = array();
$audits = $billAuditSvc->get(array('billId'=>$bill['id']));
foreach ($audits['data'] as $key => $item) {
	if($item['newStatus'] == 'new'|| $item['orignalStatus'] == 'new') {
		continue;
	}
	$s = str2GBK($item['operatorRealName'].'('.$item['newStatusName'].')');
	if($item['drt'] == -1){
		array_pop($auditA);
	} else {
		array_push($auditA, $s);
	}
}
$auditstr = join('��', $auditA);
$pdf->Text(83,60,'�����:');
$pdf->Text(95,60,($auditstr));
$pdf->Ln();
$pdf->Output($bill['id'].'-'.$bill['creatorRealName'].'������.pdf', $action == "view" ? "I" : "D" );
?>  