<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

global $name,$phone,$times,$address,$totalFee,$captain,$finishPercentage,$cny,$billId; 

$lineHeight 	= 6;
//全局字体
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_material_order.php';

$billSvc = BaseSvc::getSvc('SupplierOrder');
$supplierSvc = BaseSvc::getSvc('Supplier');
$billItemSvc = BaseSvc::getSvc('SupplierOrderItem');
$projectSvc = BaseSvc::getSvc('Project');
$supplierOrderAudit = BaseSvc::getSvc('SupplierOrderAudit');

$bill = $billSvc->getWithSupplier($_REQUEST);
if(count($bill['data']) == 0){
	echo '<html><script type="text/javascript">document.write(decodeURIComponent("%E6%89%BE%E4%B8%8D%E5%88%B0%E5%AF%B9%E5%BA%94%E7%9A%84%E5%8D%95%E6%8D%AE!"));</script></html>';
	die();
}
$bill = $bill['data'][0];
$billId = $bill['id'];
$supplier = $supplierSvc->get(array('id'=>$bill['supplierId']))['data'];
if(count($supplier) == 0){
	echo '<html><script type="text/javascript">document.write(decodeURIComponent("%E6%89%BE%E4%B8%8D%E5%88%B0%E5%AF%B9%E5%BA%94%E4%BE%9B%E5%BA%94%E5%95%86%EF%BC%81"));</script></html>';
	die();
}
$supplier = $supplier[0];
$name = str2GBK($supplier['name']);
$phone = preg_match_all("/\d+/", $bill['phoneNumber'], $_tmp) ? $_tmp[0][0] : '';
$projects = $projectSvc->get(array('projectId'=>$bill['projectId']));
$captain = str2GBK($projects['data'][0]['captain']);
$times = $bill['payedTimes'];
$address = str2GBK($bill['projectName']);
$totalFee = $bill['totalFee'];
$finishPercentage = str2GBK($bill['projectProgress']);
$cny = str2GBK(cny($totalFee));

$billItems = $billItemSvc->get(array('billId'=>$_REQUEST['id']));
$billItems = $billItems['data'];
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";
$pdf=new PDF('P','mm', 'A4'); //创建新的FPDF对象 
$pdf->AddGBFont(); //设置中文字体 
$pdf->Open(); //开始创建PDF 
$pdf->AddPage(); //增加一页 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //设置字体样式 
$pdf->AliasNbPages("__totalPage__");
$titles = array('序号','项目','单位','数量','单价(元)','小计(元)');
$widths = array(10,80,20,20,20,35);
$aligns = array('C','C','C','C','C','C');
$pdf->writeCellLine($widths,$titles,'LTBR','','C',6,10,$fontStyles = array());
$totalBillCount = 0;
$index = 0;
foreach($billItems as $value) {
	$data = array();
	$data[0] = ++$index;//$value['referenceNumber'];
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
$pdf->writeCellLine($widths,array('','合计','','','',$totalBillCount),'LTBR','','C',6,10,$fontStyles = array());
$lineHeight = $before;

$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(175,5,'','R','','L');
$pdf->ln();
$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(175,5,'','R','','L');
$pdf->ln();

$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(115,5,'大写金额: '.str2GBK(cny($totalBillCount)),'','','L');
$pdf->Cell(60,5,'供应商(签字):','R','','L');
$pdf->ln();

$pdf->Cell(10,5,'','L','','L');
$pdf->Cell(145,5,'','','','L');
$pdf->Cell(30,5,'年     月      日','R','','L');
$pdf->ln();
$pdf->Cell(10,5,'','LB','','L');
$pdf->Cell(175,5,'','RB','','L');
$pdf->Ln();
$audits = $supplierOrderAudit->get(array('billId'=>$billId));
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
$pdf->Cell(0,8,"审核人 : ".join('→', $auditstr));

$pdf->Ln();
$pdf->Cell(11,21,"");
$pdf->Ln();
$pdf->Output($address.".pdf", $action == "view" ? "I" : "D" );
?>  