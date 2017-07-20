<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

global $auditstr,$paid,$payTime,$payee,$name,$phone,$times,$address,$totalFee,$projectName,$finishPercentage,$requiredFee,$cny,$billId; 

$lineHeight 	= 6;
//ȫ������
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_rbm_bill.php';

$entryNExitSvc = BaseSvc::getSvc('EntryNExit');
$statementBillSvc = BaseSvc::getSvc('StatementBill');
$billAuditSvc = BaseSvc::getSvc('StatementBillAudit');

$bill = $statementBillSvc->get($_REQUEST);
if(count($bill['data']) == 0){
	echo '<html><script type="text/javascript">document.write(decodeURIComponent("%E6%89%BE%E4%B8%8D%E5%88%B0%E5%AF%B9%E5%BA%94%E7%9A%84%E5%8D%95%E6%8D%AE!"));</script></html>';
	die();
}
$entryNExitBill = $entryNExitSvc->get(array('c0'=>$_REQUEST['id'], 'type'=>'reimbursementItems'));

$bill = $bill['data'][0];
$entryNExitBill = $entryNExitBill['data'][0];
//print_r($entryNExitBill);
$billId = $entryNExitBill['c0'];
$name = str2GBK($entryNExitBill['c1']);
$phone = $entryNExitBill['c3'];
$projectName = str2GBK($entryNExitBill['c2']);
$totalFee = $entryNExitBill['c4'];
$cny = str2GBK(cny($entryNExitBill['c4']));
$paid = str2GBK($entryNExitBill['c5']);
$reimbursementReason = str2GBK($bill['reimbursementReason']);
$payee = str2GBK($entryNExitBill['c8']);
$payTime = str2GBK($entryNExitBill['c7']);
$audits = $billAuditSvc->get(array('billId'=>$billId));
$auditstr = array();
foreach ($audits['data'] as $key => $item) {
	if($item['newStatus'] == 'new' || $item['orignalStatus'] == 'new') {
		continue;
	}
	$s = str2GBK($item['operatorRealName'].'('.$item['newStatusName'].')');
	if($item['drt'] == -1){
		array_pop($auditstr);
	} else {
		array_push($auditstr, $s);
	}
}

$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";
$pdf=new PDF('P','mm', 'A4'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->Open(); //��ʼ����PDF 
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 
$pdf->AliasNbPages("__totalPage__");
$pdf->ln();
$pdf->Cell(125,5,'','','','L');
$pdf->Cell(60,5,'�����(ǩ��):','','','L');
$pdf->ln(10);

$pdf->Cell(155,5,'','','','L');
$pdf->Cell(30,5,'��     ��      ��','','','L');
$pdf->Output($address.".pdf", $action == "view" ? "I" : "D" );
?>  