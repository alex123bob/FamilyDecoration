<?php

class PDF extends PDF_Chinese{
	
	function Header(){ //设置页眉 
	
		global $phone,$times,$totalFee,$finishPercentage,$requiredFee,$cny,$start,$end,$professionTypes; 
		
		$this->SetLeftMargin(10);
		$this->SetRightMargin(10);
		//$this->SetTopMargin(15);
		$this->SetAutoPageBreak(true,10);
		//$this->SetTopMargin(5);
		//$this->Image('../resources/img/logo.jpg',60,4,30,30); //增加一张图片，文件名为sight.jpg 
		$this->SetFont('GB','',25); 
		$imgWidth = 17;
		$title = '  佳诚装饰    '.$professionTypes[$_REQUEST['professionType']].'用工计划时间表';
		$firstLine = "开始时间: $start      结束时间: $end";
		$leftOffset = ($this->w - $this->getstringwidth($title) - $imgWidth)/2;
		$this->Image('../resources/img/logo.jpg',$leftOffset,2,17,17); //增加一张图片，文件名为sight.jpg 
		$this->Text($leftOffset+$imgWidth,15,$title);
		$this->Ln(2); //换行
		$this->SetFont('','',11); 
		$leftOffset = ($this->w - $this->getstringwidth($firstLine))/2;
		$this->Text($leftOffset,25,$firstLine);
		

		//$this->Line(10,50,280,50);
		$this->Ln(20);
	} 
	function Footer(){ //设置页脚  
		$this->SetY(-10); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(0,10,'第'.$this->PageNo().'页  共__totalPage__页',0,0,'C'); 
		//$this->Cell(220,10,date("Y-m-d"),0,0,'R'); 
	}
}
?>
