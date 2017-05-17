<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

$FirstCellWidth=array(11,46,8,12,107);
$CellWidth 	= $FirstCellWidth;
$lineHeight 	= 6;
$titleLeft      = array(17,42,72.5,82,141);
//ȫ������
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline
//��������
$bigItemFontSize = 11;
$bigItemFontStyles = array_fill(0,14,'B');
//С������
$smallCountFontSize = 10;
$smallCountFontStyles = array_fill(0,14,'');
//OPQRST������ʽ
$NOPQRSTFontSize = 10;
$NOPQRSTFontStyles = array_fill(0,14,'');


include_once "../libs/conn.php";
include_once '../libs/budgetDB.php'; 
include_once 'chinese.php';
include_once 'pdf_chinese3.php';
global $custName;
global $projectName;

$budget = getBudgetsByBudgetId($_REQUEST["budgetId"]);
if(count($budget) == 0){
	throw new Exception("no budget with id ".$_REQUEST["budgetId"]);
}
$custName =  str2GBK(urldecode($budget[0]["custName"]));
$projectName = str2GBK(urldecode($budget[0]["businessAddress"]  == "" ? $budget[0]["projectName"] : $budget[0]["businessRegion"]." ".$budget[0]["businessAddress"]));
$budgetName = str2GBK(urldecode($budget[0]["budgetName"]));
$projectComments = str2GBK(urldecode($budget[0]["comments"]));
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "download";
$rows = 5;
$budgetItems = getBudgetItemsByBudgetId($_REQUEST["budgetId"],true);
$pdf=new PDF('P','mm', 'A4'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->Open(); //��ʼ����PDF 
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 
$pdf->AliasNbPages("__totalPage__");
//echo $custName.":".$projectName;
foreach($budgetItems as $bItem){
	$fields = array('budgetItemId','itemName','budgetId','mainMaterialTotalPrice',
					'remark','itemAmount','itemCode','itemUnit','basicItemId','basicSubItemId');
	foreach($fields as $field){
		if(!isset($bItem[$field]))
			$bItem[$field] = "";
	}
	$amount = $bItem["itemAmount"];
	$itemCode = $bItem["itemCode"];
	$itemName = $bItem["itemName"];
	if($itemName == 'С��' || in_array($itemCode,array('N','O','P','Q','R','S'))){
		continue;
	}
	$remark = trim($bItem["remark"], '<br />');
	
	$data = array($itemCode,$itemName,$bItem["itemUnit"],$amount,$remark);
	$fontStyles = array_fill(0,$rows,$GfontStyle);
	$fontSizes = array_fill(0,$rows-1,$GfontSize); //14��,����13������һ��,14�б�ע��С
	array_push($fontSizes,8);
	$borders = array('LB','LB','LB','LB','LBR');
	$align = array('C','L','C','C','L');
	

	//�������
	if(strlen($itemCode) == 1){
		$fontSizes = array_fill(0,$rows,$bigItemFontSize);
		$fontStyles = $bigItemFontStyles;
	}
	//С�ƺ������
	if ($itemCode != "A" && $bItem["basicItemId"] != "" && $bItem["basicSubItemId"] == "") {
		$pdf->writeCellLine($CellWidth,array("","","","",""),$borders,0,$align,$rows,$fontSizes);
	}
	$pdf->writeCellLine($CellWidth,$data,$borders,0,$align,$rows,$fontSizes,$fontStyles);
}
$pdf->Ln();
$pdf->Output($projectName.".pdf", $action == "view" ? "I" : "D" );
?>  