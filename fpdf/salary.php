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
//ȫ������
$GfontSize		= 10;
$GfontStyle		= ''; // B bold,U:underline


include_once "../libs/conn.php";
include_once 'chinese.php';
include_once 'pdf_chinese_salary.php';

$salarySvc = BaseSvc::getSvc('StaffSalary');
$salaries = $salarySvc->get($_REQUEST);
$action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "view";
$pdf=new PDF('P','mm', 'A4'); //�����µ�FPDF���� 
$pdf->AddGBFont(); //������������ 
$pdf->AddPage(); //����һҳ 
$pdf->SetFont("GB",$GfontStyle,$GfontSize); //����������ʽ 
$pdf->AliasNbPages("__totalPage__");
$pdf->ln();
$titles = array('����','��н','���','ȫ��','����','Υ��','�ϼ�','����','������','��˰','����','ʵ��');
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
$name = '�ѳ�װ��'.$_REQUEST['year'].'��'.$_REQUEST['month'].'��'.str2GBK($_REQUEST['depasName']).'���ʱ�.pdf';
$pdf->Output($name, $action == "view" ? "I" : "D" );
?>  