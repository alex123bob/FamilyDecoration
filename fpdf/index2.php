<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

$FirstCellWidth=array(11,41,8,12,   27,   27,   27,   23,8,82);
//$FirstCellWidth	= array(11,41,9,14,   28,   28,   28,   28,10,95);
$CellWidth 	= array(11,41,8,12,11,16,13,14,12,15,10,13,8,82);
//$CellWidth 		= array(11,41,9,14,12,16,12,16,12,16,12,16,10,95);
$lineHeight 	= 6;
$titleLeft      = array(17,39,67.5,77,236);
//$titleLeft      = array(4,25,54.5,65,236);
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
include_once 'pdf_chinese.php';
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
$budgetItems = getBudgetItemsByBudgetId($_REQUEST["budgetId"],true);
$pdf=new PDF('L','mm', 'A4'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->Open(); //��ʼ����PDF 
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 
$pdf->AliasNbPages("__totalPage__");
//echo $custName.":".$projectName;
foreach($budgetItems as $bItem){
	$fields = array('budgetItemId','itemName','budgetId','mainMaterialTotalPrice','auxiliaryMaterialTotalPrice','manpowerTotalPrice','mainMaterialTotalCost','manpowerTotalCost',
					'machineryTotalPrice','remark','itemAmount','itemCode','itemUnit','mainMaterialPrice','auxiliaryMaterialPrice','lossPercent','machineryPrice','manpowerPrice','basicItemId','basicSubItemId');
	foreach($fields as $field){
		if(!isset($bItem[$field]))
			$bItem[$field] = "";
	}
	$amount = $bItem["itemAmount"];
	$itemCode = $bItem["itemCode"];
	$itemName = $bItem["itemName"];
	$remark = $bItem["remark"];
	
	$data = array($itemCode,$itemName,$bItem["itemUnit"],$amount,
				$bItem["mainMaterialPrice"],$bItem["mainMaterialTotalPrice"],
				$bItem["auxiliaryMaterialPrice"],$bItem["auxiliaryMaterialTotalPrice"],$bItem["manpowerPrice"],
				$bItem["manpowerTotalPrice"],$bItem["machineryPrice"],$bItem["machineryTotalPrice"],
				formatNumber(($bItem["mainMaterialPrice"] + $bItem["auxiliaryMaterialPrice"]) * $bItem["lossPercent"]),$remark);
	$fontStyles = array_fill(0,14,$GfontStyle);
	$fontSizes = array_fill(0,13,$GfontSize); //14��,����13������һ��,14�б�ע��С
	array_push($fontSizes,8);
	$borders = array('LB','LB','LB','LB','LB','LB','LB','LB','LB','LB','LB','LB','LB','LBR');
	$align = array('C','L','C','C','C','C','C','C','C','C','C','C','C','L');
	if(in_array($bItem['itemCode'],array('N','O','P','Q','R','S'))){
		$data[3]= '';
		$fontSizes = array_fill(0,14,$NOPQRSTFontSize);
		$fontStyles = $NOPQRSTFontStyles;
	}
	if($itemName == 'С��'){
		$fontSizes = array_fill(0,14,$smallCountFontSize);
		$fontStyles = $smallCountFontStyles;
	}
	//�������
	if(strlen($itemCode) == 1){
		$data[12] = ''; //�����Ҫ������
		$fontSizes = array_fill(0,14,$bigItemFontSize);
		$fontStyles = $bigItemFontStyles;
	}
	//С�ƺ������
	if ($itemCode != "A" && $bItem["basicItemId"] != "" && $bItem["basicSubItemId"] == "") {
		$pdf->writeCellLine($CellWidth,array("","","","","","","","","","","","","",""),$borders,0,$align,14,$fontSizes);
	}
	$pdf->writeCellLine($CellWidth,$data,$borders,0,$align,14,$fontSizes,$fontStyles);
}


//�������
$otherInfo = preg_split('/\n|\r\n|\r|\n\r/',$projectComments);
$arrayCount = count($otherInfo);
//�������У���ֹ��ע�������У���������������
while($arrayCount<3){
	array_push($otherInfo,'');
	$arrayCount++;
}
$titleHeightPosition = 7;
$pdf->SetFont("GB",'',9); //����������ʽ 
$pdf->Cell(11,10,"");
$pdf->Ln();
$pdf->Cell(11,21,"");
$pdf->Cell(200,$titleHeightPosition,$otherInfo[0],0);
$pdf->SetFont("GB",'',10); //����������ʽ 
$pdf->Cell(21,$titleHeightPosition,'�ͻ�ǩ����',0);
$pdf->SetFont("GB",'',9); //����������ʽ 
$pdf->Ln();
$pdf->Cell(11,21,"");
$pdf->Cell(200,$titleHeightPosition,$otherInfo[1]);
$pdf->Ln();
$pdf->Cell(11,21,"");
$pdf->Cell(200,$titleHeightPosition,$otherInfo[2]);
$pdf->SetFont("GB",'',10); //����������ʽ 
$pdf->Cell(21,$titleHeightPosition,'ʱ�䣺',0,0,'R');
$pdf->Cell(16,$titleHeightPosition,'��',0,0,'R');
$pdf->Cell(11,$titleHeightPosition,'��',0,0,'R');
$pdf->Cell(11,$titleHeightPosition,'��',0,0,'R');
$pdf->SetFont("GB",'',9); //����������ʽ 
$i = 3;
while($i < $arrayCount){
	$pdf->Ln();
	$pdf->Cell(11,21,"");
	$pdf->Cell(200,$titleHeightPosition,$otherInfo[$i]);
	$i++;
}
$pdf->Ln();
$pdf->Cell(11,21,"");
//$pdf->Cell(200,$titleHeightPosition,'    ע�� 1�� �����۵�Ϊ��ͬ������ ����ͬ�ȷ���Ч���� ҵ��ǩ�ֺ���Ч��');
$pdf->Ln();
$pdf->Output($projectName.".pdf", $action == "view" ? "I" : "D" );

$pdf->writeCellLine($CellWidth,$data,0,0,'R');

?>  