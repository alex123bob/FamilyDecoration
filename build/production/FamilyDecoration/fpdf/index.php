<?php
include_once "../libs/conn.php";
include_once '../libs/budgetDB.php'; 
include_once 'chinese.php'; 
global $custName ;
global $projectName ;
$budget = getBudgetsByBudgetId($_REQUEST["budgetId"]);
$custName =  iconv("UTF-8","GB2312",urldecode($budget[0]["custName"]));
$projectName = iconv("UTF-8","GB2312",urldecode($budget[0]["projectName"]));
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "download";

class PDF extends PDF_Chinese{
	function Header(){ //设置页眉 
		$this->SetFont('GB','B',20); 
		$this->Image('../resources/img/logo.jpg',10,10,30,30); //增加一张图片，文件名为sight.jpg 
		//http://localhost/fd/
		global $custName,$projectName;
		$this->Text(60,30,'(求是教育集团下属企业)佳诚装饰室内装修装饰工程 预算单');
		$this->SetFont('GB','',10); 
		$this->Ln(26); //换行 
		$this->Cell(40,10,"",0,0,'C');
		$this->Cell(30,10,"客户姓名 ：",0,0,'L');
		$this->Cell(30,10,$custName,0,0,'L');
		$this->Cell(60,10,"",0,0,'C');
		$this->Cell(30,10,"工程地址 ：",0,0,'L');
		$this->Cell(30,10,$projectName,0,0,'L');
		$this->Ln(14); //换行 
		//$this->Line(10,50,280,50);
	} 
	function Footer(){ //设置页脚  
		$this->SetY(-15); 
		$this->SetFont('GB','',10); 
		$this->Cell(50,10,'第'.$this->PageNo().'页'); 
		$this->Cell(220,10,date("Y-m-d"),0,0,'R'); 
	} 
}

$budgetItems = getBudgetItemsByBudgetIdGBK($_REQUEST["budgetId"]);
$pdf=new PDF('L','mm', 'A4'); //创建新的FPDF对象 
$pdf->AddGBFont(); //设置中文字体 
$pdf->Open(); //开始创建PDF 
$pdf->AddPage(); //增加一页 
$pdf->SetFont('GB','',10); //设置字体样式 
$pdf->Ln(1);

$titles = array('主材','辅材','人工','机械','损失');
$CellWidth  = array(30,50,20,20,32,32,32,32,22);
$CellHeight = 6;
$borders = array('LT','LT','LT','LT','LT','LT','LT','LT','LTR');
$count = 0;
$pdf->Cell($CellWidth[$count],$CellHeight,'',$borders[$count++],0,'C');
$pdf->Text(21,58,'编号');
$pdf->Cell($CellWidth[$count],$CellHeight,'',$borders[$count++],0,'C');
$pdf->Text(57,58,'项目名称');
$pdf->Cell($CellWidth[$count],$CellHeight,'',$borders[$count++],0,'C');
$pdf->Text(96,58,'单位');
$pdf->Cell($CellWidth[$count],$CellHeight,'',$borders[$count++],0,'C');
$pdf->Text(116,58,'数量');
foreach($titles as $title){
	$pdf->Cell($CellWidth[$count],$CellHeight,$title,$borders[$count++],0,'C');
}
$pdf->Ln();
$titles 	= array('   ','   ','   ','   ','单价','总价','单价','总价','单价','总价','单价','总价','单价');
$CellWidth  = array(   30,   50,   20,   20,	14,	   18,    14,    18,    14,    18,    14,    18,    22);
$borders 	= array( 'LRB',  'BR',  'BR',   'BR', 	'BTR', 'BTR',  'BTR',  'BTR',  'BTR',  'BTR',  'BTR',  'BTR',  'BTR');
$CellHeight = 6;///array(15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15);

$count = 0;
foreach($titles as $title){
	$pdf->Cell($CellWidth[$count],$CellHeight,$title,$borders[$count++],0,'C');
}
$pdf->Ln();
$lineHeight = 10;
ksort($budgetItems);
$arrayForTotalCount = array();

foreach($budgetItems as $budgetItem){
	$count = 0;
	if("小计" == $budgetItem["itemName"]) continue;
	if("NULL" == $budgetItem["itemUnit"]) $budgetItem["itemUnit"] = "";
	$isBigSubject = (1 == strlen($budgetItem["itemCode"]));
	//echo $budgetItem["itemCode"].$isBigSubject."<br />";
	if($isBigSubject && count($arrayForTotalCount) == 4){
		//输出小计
		$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,"小计",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,isset($arrayForTotalCount["A"]) ? $arrayForTotalCount["A"] : "",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,isset($arrayForTotalCount["B"]) ? $arrayForTotalCount["B"] : "",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,isset($arrayForTotalCount["C"]) ? $arrayForTotalCount["C"] : "",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,isset($arrayForTotalCount["D"]) ? $arrayForTotalCount["D"] : "",1,0,'C');
		$pdf->Cell($CellWidth[$count++],$lineHeight,"",'LBR',0,'C');
		// 清空小计，供下一轮用
		$arrayForTotalCount = array();
		$count = 0;
		$pdf->Ln();
	}
	$amount = $budgetItem["itemAmount"];
	$mainMaterialPrice = $amount * ( $budgetItem["mainMaterialPrice"] + $budgetItem["lossPercent"] );
	$auxiliaryMaterialPrice = $amount*$budgetItem["auxiliaryMaterialPrice"];
	$manpowerPrice = $amount*$budgetItem["manpowerPrice"];
	$machineryPrice = $amount*$budgetItem["machineryPrice"];
	$arrayForTotalCount["A"] = (isset($arrayForTotalCount["A"]) ? $arrayForTotalCount["A"] : 0 ) + $mainMaterialPrice;
	$arrayForTotalCount["B"] = (isset($arrayForTotalCount["B"]) ? $arrayForTotalCount["B"] : 0 ) + $auxiliaryMaterialPrice;
	$arrayForTotalCount["C"] = (isset($arrayForTotalCount["C"]) ? $arrayForTotalCount["C"] : 0 ) + $manpowerPrice;
	$arrayForTotalCount["D"] = (isset($arrayForTotalCount["D"]) ? $arrayForTotalCount["D"] : 0 ) + $machineryPrice;
	//--- fill cells 
	$pdf->Cell($CellWidth[$count++],$lineHeight,$budgetItem["itemCode"],1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$budgetItem["itemName"],1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $budgetItem["itemUnit"],1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $budgetItem["itemAmount"],1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $budgetItem["mainMaterialPrice"],1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $mainMaterialPrice,1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $budgetItem["auxiliaryMaterialPrice"],1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $auxiliaryMaterialPrice,1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $budgetItem["manpowerPrice"],1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $manpowerPrice,1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $budgetItem["machineryPrice"],1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $machineryPrice,1,0,'C');
	$pdf->Cell($CellWidth[$count++],$lineHeight,$isBigSubject ? "" : $budgetItem["lossPercent"],1,0,'C');
	
	$pdf->Ln();
}
//输出小计
$count = 0;
$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,"小计",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,isset($arrayForTotalCount["A"]) ? $arrayForTotalCount["A"] : "",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,isset($arrayForTotalCount["B"]) ? $arrayForTotalCount["B"] : "",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,isset($arrayForTotalCount["C"]) ? $arrayForTotalCount["C"] : "",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,"",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,isset($arrayForTotalCount["D"]) ? $arrayForTotalCount["D"] : "",1,0,'C');
$pdf->Cell($CellWidth[$count++],$lineHeight,"",'LBR',0,'C');
//$projectName = iconv("GB2312","UTF-8",urldecode($projectName));
$pdf->Output($projectName.".pdf", $action == "view" ? "I" : "D" );
?>  