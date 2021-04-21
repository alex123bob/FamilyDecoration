<?php
global $CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight,$UserBrowserClient,$budgetName; 
if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari") && !strpos($_SERVER["HTTP_USER_AGENT"],"Chrome") ){
	$UserBrowserClient = 'safari';
}else if(strpos($_SERVER["HTTP_USER_AGENT"],"Mac") && strpos($_SERVER["HTTP_USER_AGENT"],"Chrome")){
	$UserBrowserClient = 'chrome_mac';
}else{
	$UserBrowserClient = 'default';
}

$lineHeight 	= 6;
//全局字体
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_salary.php';

$salarySvc = BaseSvc::getSvc('StaffSalary');
$salaries = $salarySvc->get($_REQUEST);
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";
$pdf=new PDF('P','mm', 'A4'); //创建新的FPDF对象 
$pdf->AddGBFont(); //设置中文字体 
$pdf->AddPage(); //增加一页 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //设置字体样式 
$pdf->AliasNbPages("__totalPage__");
$pdf->ln();
$titles = array('姓名','底薪','提成','全勤','奖励','违扣','合计','五险','公积金','个税','其他','实发');
$widths = array(20,15,15,15,15,15,15,15,15,15,15,15,15);
$aligns = array('C','C','C','C','C','C','C','C','C','C','C','C');
$pdf->writeCellLine($widths,$titles,'LTBR','',$aligns,12,10,$fontStyles = array());
$pdf->SetFont('GB','',8); 
foreach($salaries['data'] as $record) {
	$data = array(
		str2GBK($record['staffNameRealName']),
		$record['basicSalary'],
		$record['commission'],
		$record['fullAttendanceBonus'],
		$record['bonus'],
		'-'.$record['deduction'],
		$record['total'],
		$record['insurance'],
		$record['housingFund'],
		$record['incomeTax'],
		$record['others'],
		$record['actualPaid']
	);
	$pdf->writeCellLine($widths,$data,'LTBR','',$aligns,12,10,$fontStyles = array());
}
$name = '佳诚装饰'.$_REQUEST['year'].'年'.$_REQUEST['month'].'月'.str2GBK($_REQUEST['depasName']).'工资表.pdf';
$pdf->Output($name, $action == "view" ? "I" : "D" );
?>  