<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

global $paidTotalAmount,$name,$phone,$times,$address,$totalFee,$captain,$finishPercentage,$requiredFee,$cny,$professionTypeName,$billId; 

$lineHeight 	= 6;
//ȫ������
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_statement_bill.php';

$billSvc = BaseSvc::getSvc('StatementBill');
$billItemSvc = BaseSvc::getSvc('StatementBillItem');
$projectSvc = BaseSvc::getSvc('Project');
$billAuditSvc = BaseSvc::getSvc('StatementBillAudit');
$professionTypeSvc = BaseSvc::getSvc('ProfessionType');

$bills = $billSvc->get($_REQUEST);
if($bills['total'] == 0){
	echo '<html><script type="text/javascript">document.write(decodeURIComponent("%E6%89%BE%E4%B8%8D%E5%88%B0%E5%AF%B9%E5%BA%94%E7%9A%84%E5%8D%95%E6%8D%AE!"));</script></html>';
	die();
}else if($bills['total'] == 1 && $bills['data'][0]['billType'] == 'rbm') {
	echo '<html><script type="text/javascript">location.href = location.href.replace(\'statement_bill.php\', \'rbm_bill.php\')</script></html>';
	die();
}else if($bills['total'] == 1 && $bills['data'][0]['billType'] == 'mtf'){
	echo '<html><script type="text/javascript">location.href = location.href.replace(\'statement_bill.php\', \'material_order_pay.php\')</script></html>';
	die();
}else if($bills['total'] == 1 && $bills['data'][0]['billType'] == 'wlf'){
	//��˾����
	echo '<html><script type="text/javascript">location.href = location.href.replace(\'statement_bill.php\', \'wlf.php\')</script></html>';
	die();
}
//echo $bills['data'][0]['billType'] ;
$bill = $bills['data'][0];
$paidTotalAmount = $billSvc->getPreviousPaidTotalAmountByPayee($bill);
$billId = $bill['id'];
$name = str2GBK($bill['payee']);
$phone = $bill['phoneNumber'];
$projects = $projectSvc->get(array('projectId'=>$bill['projectId']));

$captain = str2GBK($projects['total'] > 0 ? $projects['data'][0]['captain'] : 'unknown');
$times = $bill['payedTimes'];
$address = str2GBK($bill['projectName']);
$totalFee = $bill['totalFee'];
$finishPercentage = str2GBK($bill['projectProgress']);
$professionTypeName = str2GBK($professionTypeSvc->get(array('_fields'=>'cname','value'=>$bill['professionType']))['data'][0]['cname']);
$requiredFee = $bill['claimAmount'];
$cny = str2GBK(cny($requiredFee));

if($bill['billType'] == 'qgd') { //�ʱ���
	$billItems =  array();
	array_push($billItems, array('serialNumber'=>'0', 'billItemName'=>str2UTF8('�ʱ���'), 'unit'=>str2UTF8('Ԫ'), 'amount'=>'1', 'unitPrice'=>$bill['totalFee'], 'subtotal'=>$bill['totalFee']));
} else {
	$billItems = $billItemSvc->get(array('billId'=>$_REQUEST['id']));
	$billItems = $billItems['data'];
}
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";
$pdf=new PDF('P','mm', 'A4'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->Open(); //��ʼ����PDF 
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 
$pdf->AliasNbPages("__totalPage__");
$titles = array('���','��Ŀ','��λ','����','����(Ԫ)','С��(Ԫ)');
$widths = array(10,80,20,20,20,35);
$aligns = array('C','C','C','C','C','C');
$pdf->writeCellLine($widths,$titles,'LTBR','','C',6,10,$fontStyles = array());
$totalBillCount = 0;
foreach($billItems as $value) {
	$data = array();
	$data[0] = $value['serialNumber'];
	$data[1] = str2GBK($value['billItemName']);
	$data[2] = str2GBK($value['unit']);
	$data[3] = $value['amount'];
	$data[4] = $value['unitPrice'];
	$data[5] = $value['subtotal'];
	$totalBillCount += $value['subtotal'];
	$pdf->writeCellLine($widths,$data,'LTBR','',$aligns,6,10,$fontStyles = array());
}
global $lineHeight;
$before = $lineHeight;
$lineHeight = 12;
$pdf->writeCellLine($widths,array('','�ϼ�','','','',$totalBillCount),'LTBR','','C',6,10,$fontStyles = array());
$lineHeight = $before;

$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(175,5,'','R','','L');
$pdf->ln();
$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(175,5,'�������ܹ��̿�: '.str2GBK(cny($totalFee)).'��','R','','L');
$pdf->ln();

$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(115,5,'���յ����̿�: '.str2GBK(cny($requiredFee)).'��','','','L');
$pdf->Cell(60,5,'','R','','L');
$pdf->ln();
$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(115,5,'','','','L');
$pdf->Cell(60,5,'�����(ǩ��):','R','','L');

$pdf->ln();
$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(115,5,'�ֽ� ��     ת�� ��','','','L');
$pdf->Cell(60,5,'','R','','L');

$pdf->ln();

$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(145,5,'','','','L');
$pdf->Cell(30,5,'��     ��      ��','R','','L');
$pdf->ln();
$pdf->Cell(10,5,'','LB','','L');
$pdf->Cell(175,5,'','RB','','L');


$pdf->Ln();
$auditstr = array();
if($bill['billType'] == 'qgd') { //�ʱ���
	array_push($auditstr, str2GBK($bill['checkerRealName']));
} else {
	$audits = $billAuditSvc->get(array('billId'=>$billId));
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
}

$pdf->Cell(11,21,"����� : ".join($auditstr,'��'));
$pdf->Ln();
$pdf->Output($address.".pdf", $action == "view" ? "I" : "D" );
?>  