<?php

class PDF extends PDF_Chinese{
	
	function Header(){ //����ҳü 
	
		global $phone,$times,$totalFee,$finishPercentage,$requiredFee,$cny,$start,$end,$professionTypes; 
		
		$this->SetLeftMargin(10);
		$this->SetRightMargin(10);
		$this->SetAutoPageBreak(true,5);
		$this->SetFont('GB','',25); 
		$imgWidth = 17;
		$title = '  �ѳ�װ��    '.$professionTypes[$_REQUEST['professionType']].'�ù��ƻ�ʱ���';
		$firstLine = "��ʼʱ��: $start      ����ʱ��: $end";
		$leftOffset = ($this->w - $this->getstringwidth($title) - $imgWidth)/2;
		$this->Image('../resources/img/logo.jpg',$leftOffset,2,17,17); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->Text($leftOffset+$imgWidth,15,$title);
		$this->Ln(2); //����
		$this->SetFont('','',11); 
		$leftOffset = ($this->w - $this->getstringwidth($firstLine))/2;
		$this->Text($leftOffset,25,$firstLine);
		$this->Ln(20);
	} 
	function Footer(){ //����ҳ��  
		//$this->SetY(-10); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(0,10,'��'.$this->PageNo().'ҳ  ��__totalPage__ҳ',0,0,'C'); 
		//$this->Cell(220,10,date("Y-m-d"),0,0,'R'); 
	}
}
?>
