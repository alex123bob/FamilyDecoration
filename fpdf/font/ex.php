<?php
require('chinese.php');

$pdf=new PDF_Chinese();
$pdf->AddBig5Font();
$pdf->AddPage();
$pdf->SetFont('Big5','',20);
$pdf->Write(10,'現時氣溫 18 C 濕度 83 %');
$pdf->Output();
?>
