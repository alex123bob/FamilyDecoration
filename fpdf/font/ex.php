<?php
require('chinese.php');

$pdf=new PDF_Chinese();
$pdf->AddBig5Font();
$pdf->AddPage();
$pdf->SetFont('Big5','',20);
$pdf->Write(10,'�{�ɮ�� 18 C ��� 83 %');
$pdf->Output();
?>
