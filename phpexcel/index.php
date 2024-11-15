<?php
include_once './Classes/PHPExcel.php';       
include_once './Classes/PHPExcel/Writer/Excel5.php';
include_once "../libs/conn.php";
include_once '../libs/budgetDB.php';

$downLoad = false;
if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'download'){
	$downLoad = true;
}

$budget = getBudgetsByBudgetId($_REQUEST["budgetId"]);
$budgetItems = getBudgetItemsByBudgetId($_REQUEST["budgetId"],true,false);

$fileName = str2GBK(urldecode($budget[0]["projectName"])).".xls";

$cancel_time=date("YmdHis");   
      
// 创建一个处理对象实例       
$objExcel = new PHPExcel();       
      
// 创建文件格式写入对象实例, uncomment       
//$objWriter = new PHPExcel_Writer_Excel5($objExcel);      
$objWriter = PHPExcel_IOFactory::createWriter($objExcel, 'Excel5');
 
//设置文档基本属性       encode error ,dont konw why
/*$compay = "author";
$objProps = $objExcel->getProperties();       
$objProps->setCreator($compay);  
$objProps->setLastModifiedBy(urldecode($compay));     
$objProps->setTitle($compay);       
$objProps->setTitle(str2GBK(urldecode($budget[0]['projectName'])));       
$objProps->setSubject($compay);       
$objProps->setDescription($compay);       
$objProps->setKeywords($compay));       
$objProps->setCategory($compay)); */      
      
//*************************************       
//设置当前的sheet索引，用于后续的内容操作。       
//一般只有在使用多个sheet的时候才需要显示调用。       
//缺省情况下，PHPExcel会自动创建第一个sheet被设置SheetIndex=0       
$objExcel->setActiveSheetIndex(0);       
$objActSheet = $objExcel->getActiveSheet();       
      
//设置当前活动sheet的名称       
$objActSheet->setTitle(urldecode($budget[0]['projectName']));       
//Set paper size to A4
$objActSheet->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
$objActSheet->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
//设置默认边框,此处不能加,加了表头,表尾都有了.
$styleArray = array('borders' => array('allborders' => array('style' => PHPExcel_Style_Border::BORDER_THIN)));
//$objExcel->getDefaultStyle()->applyFromArray($styleArray);

//*************************************       
//       
//设置宽度，这个值和EXCEL里的不同，不知道是什么单位，略小于EXCEL中的宽度   
$objActSheet->getColumnDimension('A')->setWidth(5);    
$objActSheet->getColumnDimension('B')->setWidth(12);    
$objActSheet->getColumnDimension('C')->setWidth(5);    
$objActSheet->getColumnDimension('D')->setWidth(5);    
$objActSheet->getColumnDimension('E')->setWidth(6);    
$objActSheet->getColumnDimension('F')->setWidth(8);    
$objActSheet->getColumnDimension('G')->setWidth(6);    
$objActSheet->getColumnDimension('H')->setWidth(8);    
$objActSheet->getColumnDimension('I')->setWidth(6);    
$objActSheet->getColumnDimension('J')->setWidth(8);    
$objActSheet->getColumnDimension('K')->setWidth(6);    
$objActSheet->getColumnDimension('L')->setWidth(8);    
$objActSheet->getColumnDimension('M')->setWidth(6);    
$objActSheet->getColumnDimension('N')->setWidth(42);    
  
$objActSheet->getRowDimension(1)->setRowHeight(30);    
$objActSheet->getRowDimension(2)->setRowHeight(20);    
$objActSheet->getRowDimension(3)->setRowHeight(20);    
    
//设置单元格的值     
$objActSheet->setCellValue('A1', '佳诚装饰室内装修装饰工程 预算单');    
//合并单元格   
$objActSheet->mergeCells('A1:N1');    
//设置样式   
$objStyleA1 = $objActSheet->getStyle('A1');       
$objStyleA1->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objFontA1 = $objStyleA1->getFont();       
$objFontA1->setName('宋体');       
$objFontA1->setSize(18);     
$objFontA1->setBold(true);

// set budget information
$objActSheet->setCellValue('D2', '客户名称：');
$objActSheet->mergeCells('D2:E2');
$objActSheet->setCellValue('F2', urldecode($budget[0]["custName"]));  
$objActSheet->mergeCells('F2:G2');

$objActSheet->setCellValue('J2', '工程地址：');
$objActSheet->mergeCells('J2:K2');
$objActSheet->setCellValue('L2', urldecode($budget[0]["projectName"]));    
$objActSheet->mergeCells('L2:M2');

// start index of table content
$contentIndex = 3;
  
//设置水平居中对齐   
$objActSheet->getStyle('A'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('B'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('C'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('D'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('E'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('F'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('G'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('H'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('I'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('J'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('K'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('L'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('M'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('N'.$contentIndex)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);  

$objActSheet->getStyle('A'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('B'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('C'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('D'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('E'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('F'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('G'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('H'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('I'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('J'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('K'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('L'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('M'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   
$objActSheet->getStyle('N'.($contentIndex + 1))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);   

//设置垂直居中对齐   
$objActSheet->getStyle('A'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('B'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('C'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('D'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('E'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('F'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('G'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('H'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('I'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('J'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('K'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('L'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('M'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('N'.$contentIndex)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);  

$objActSheet->getStyle('A'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('B'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('C'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('D'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('E'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('F'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('G'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('H'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('I'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('J'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('K'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('L'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('M'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objActSheet->getStyle('N'.($contentIndex + 1))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);   

// 合并单元格
$objActSheet->mergeCells("A$contentIndex:A".($contentIndex + 1));  
$objActSheet->mergeCells("B$contentIndex:B".($contentIndex + 1));  
$objActSheet->mergeCells("C$contentIndex:C".($contentIndex + 1));  
$objActSheet->mergeCells("D$contentIndex:D".($contentIndex + 1));  
$objActSheet->mergeCells("E$contentIndex:F".($contentIndex));  
$objActSheet->mergeCells("G$contentIndex:H".($contentIndex));  
$objActSheet->mergeCells("I$contentIndex:J".($contentIndex));  
$objActSheet->mergeCells("K$contentIndex:L".($contentIndex));
$objActSheet->mergeCells("N$contentIndex:N".($contentIndex + 1));  

$objActSheet->setCellValue("A$contentIndex", '编号');
$objActSheet->setCellValue("B$contentIndex", '项目名称');    
$objActSheet->setCellValue("C$contentIndex", '单位');    
$objActSheet->setCellValue("D$contentIndex", '数量');    
$objActSheet->setCellValue("E$contentIndex", '主材');    
$objActSheet->setCellValue('E'.($contentIndex + 1), '单价');    
$objActSheet->setCellValue('F'.($contentIndex + 1), '总价');    
$objActSheet->setCellValue('G'.$contentIndex, '辅材');    
$objActSheet->setCellValue('G'.($contentIndex + 1), '单价');    
$objActSheet->setCellValue('H'.($contentIndex + 1), '总价');    
$objActSheet->setCellValue('I'.$contentIndex, '人工');    
$objActSheet->setCellValue('I'.($contentIndex + 1), '单价');    
$objActSheet->setCellValue('J'.($contentIndex + 1), '总价');    
$objActSheet->setCellValue('K'.$contentIndex, '机械');    
$objActSheet->setCellValue('K'.($contentIndex + 1), '单价');    
$objActSheet->setCellValue('L'.($contentIndex + 1), '总价');    
$objActSheet->setCellValue('M'.$contentIndex, '损耗');    
$objActSheet->setCellValue('M'.($contentIndex + 1), '单价');    
$objActSheet->setCellValue('N'.$contentIndex, '备注');
foreach(array('A','B','C','D','E','F','G','H','I','J','K','L','M','N') as $cell){
	$objActSheet->getStyle($cell.$contentIndex)->applyFromArray($styleArray);
	$objActSheet->getStyle($cell.($contentIndex+1))->applyFromArray($styleArray);
}

for ($i = 0; $i < count($budgetItems); $i++) {
    $num = $i + $contentIndex + 2;
    isset($budgetItems[$i]["itemCode"]) && $objActSheet->setCellValue("A$num", $budgetItems[$i]["itemCode"]);    
    isset($budgetItems[$i]["itemName"]) && $objActSheet->setCellValue("B$num", iconv('gbk', 'utf-8', $budgetItems[$i]["itemName"]));    
    isset($budgetItems[$i]["itemUnit"]) && $objActSheet->setCellValue("C$num", iconv('gbk', 'utf-8', $budgetItems[$i]["itemUnit"]));    
    isset($budgetItems[$i]["itemAmount"]) && $objActSheet->setCellValue("D$num", $budgetItems[$i]["itemAmount"]);    
    isset($budgetItems[$i]["mainMaterialPrice"]) && $objActSheet->setCellValue("E$num", $budgetItems[$i]["mainMaterialPrice"]);
    isset($budgetItems[$i]["mainMaterialTotalPrice"]) && $objActSheet->setCellValue("F$num", $budgetItems[$i]["mainMaterialTotalPrice"]);      
    isset($budgetItems[$i]["auxiliaryMaterialPrice"]) && $objActSheet->setCellValue("G$num", $budgetItems[$i]["auxiliaryMaterialPrice"]);    
    isset($budgetItems[$i]["auxiliaryMaterialTotalPrice"]) && $objActSheet->setCellValue("H$num", $budgetItems[$i]["auxiliaryMaterialTotalPrice"]);    
    isset($budgetItems[$i]["manpowerPrice"]) && $objActSheet->setCellValue("I$num", $budgetItems[$i]["manpowerPrice"]);    
    isset($budgetItems[$i]["manpowerTotalPrice"]) && $objActSheet->setCellValue("J$num", $budgetItems[$i]["manpowerTotalPrice"]);     
    isset($budgetItems[$i]["machineryPrice"]) && $objActSheet->setCellValue("K$num", $budgetItems[$i]["machineryPrice"]);    
    isset($budgetItems[$i]["machineryTotalPrice"]) && $objActSheet->setCellValue("L$num", $budgetItems[$i]["machineryTotalPrice"]);      
    isset($budgetItems[$i]["lossPercent"]) && $objActSheet->setCellValue("M$num", $budgetItems[$i]["lossPercent"]);    
    isset($budgetItems[$i]["remark"]) && $objActSheet->setCellValue("N$num", iconv('gbk', 'utf-8', $budgetItems[$i]["remark"])) &&  $objActSheet->getStyle("N$num")->getAlignment()->setWrapText(true);
	foreach(array('A','B','C','D','E','F','G','H','I','J','K','L','M','N') as $cell){
		$objActSheet->getStyle($cell.$num)->applyFromArray($styleArray);
	}
}

// set comments
$commentIndex = $num + 2;
$comments=urldecode($budget[0]["comments"]);
$projectComments = preg_split('/\n|\r\n|\r|\n\r/',$comments);
$commentsLines = count($projectComments);
//算法1
$objActSheet->mergeCells("B$commentIndex:I".($commentIndex+$commentsLines-1));
$objActSheet->setCellValue("B$commentIndex",$comments);
$objActSheet->getStyle("B$commentIndex")->getAlignment()->setWrapText(true);
$commentIndex = $commentIndex + $commentsLines + 1;
$objActSheet->setCellValue("B$commentIndex","注： 1、 本报价单为合同附件， 具有同等法律效力， 业主签字后生效。");
$objActSheet->mergeCells("B$commentIndex:K$commentIndex");
/** 算法2
$i = 0;
$commentsLines = $commentsLines +2;
array_push($projectComments,"");
array_push($projectComments,"注： 1、 本报价单为合同附件， 具有同等法律效力， 业主签字后生效。");
while($i<$commentsLines){
	$objActSheet->setCellValue("B".($commentIndex+$i),$projectComments[$i]); 
	$objActSheet->mergeCells('B'.($commentIndex+$i).':F'.($commentIndex+$i));
	$objActSheet->getStyle('B'.($commentIndex+$i))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
	$i++;
}
*/


// set signature
$objActSheet->setCellValue('N'.$commentIndex, '客户签名：');
$objActSheet->setCellValue('N'.($commentIndex + 2), '时间：               年      月      日');

//到文件       
#$objWriter->save($fileName);       
//下载  
header("Pragma: public");
header("Expires: 0");
header("Cache-Control:must-revalidate, post-check=0, pre-check=0");
header('Content-Disposition:attachment;filename="'.$fileName.'"');
header("Content-Transfer-Encoding: binary ");
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
$objWriter->save('php://output');

?>