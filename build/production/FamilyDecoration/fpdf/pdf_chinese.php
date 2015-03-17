<?php
class PDF extends PDF_Chinese{
	function Header(){ //����ҳü 
		$this->SetFont('GB','B',20); 
		$this->Image('../resources/img/logo.jpg',10,10,30,30); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		//http://localhost/fd/
		global $custName,$projectName,$CellWidth,$FirstCellWidth,$titleLeft,$GfontSize ; 
		$this->Text(95,30,'�ѳ�װ������װ��װ�ι��� Ԥ�㵥');
		$this->SetFont('GB','',$GfontSize); 
		$this->Ln(26); //���� 
		$this->Cell(40,10,"",0,0,'C');
		$this->Cell(30,10,"�ͻ����� ��",0,0,'L');
		$this->Cell(30,10,$custName,0,0,'L');
		$this->Cell(60,10,"",0,0,'C');
		$this->Cell(30,10,"���̵�ַ ��",0,0,'L');
		$this->Cell(30,10,$projectName,0,0,'L');
		//$this->Line(10,50,280,50);
		$this->Ln(12); //���� 
		$titles = array('����','����','�˹�','��е','���','');
		$CellHeight = 6;
		$borders = array('LT','LT','LT','LT','LT','LT','LT','LT','LT','LTR');
		$count = 0;
		$titleHeightPosition = 55;
		$this->Cell($FirstCellWidth[$count],$CellHeight,'',$borders[$count],0,'C');
		$this->Text($titleLeft[$count++],$titleHeightPosition,'���');
		$this->Cell($FirstCellWidth[$count],$CellHeight,'',$borders[$count],0,'C');
		$this->Text($titleLeft[$count++],$titleHeightPosition,'��Ŀ����');
		$this->Cell($FirstCellWidth[$count],$CellHeight,'',$borders[$count],0,'C');
		$this->Text($titleLeft[$count++],$titleHeightPosition,'��λ');
		$this->Cell($FirstCellWidth[$count],$CellHeight,'',$borders[$count],0,'C');
		$this->Text($titleLeft[$count++],$titleHeightPosition,'����');
		foreach($titles as $title){
			$this->Cell($FirstCellWidth[$count],$CellHeight,$title,$borders[$count++],0,'C');
		}
		$this->Text($titleLeft[4],$titleHeightPosition,'��ע');
		$this->Ln();
		$titles 	= array('   ','   ','   ','   ','����','�ܼ�','����','�ܼ�','����','�ܼ�','����','�ܼ�','����','');
		$borders 	= array( 'LRB', 'BR','BR', 'BR', 'BTR', 'BTR', 'BTR', 'BTR', 'BTR', 'BTR', 'BTR', 'BTR',  'BTR', 'BR');
		$CellHeight = 6;///array(15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15);

		$count = 0;
		foreach($titles as $title){
			$this->Cell($CellWidth[$count],$CellHeight,$title,$borders[$count++],0,'C');
		}
		$this->Ln();
	} 
	function Footer(){ //����ҳ��  
		$this->SetY(-15); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(170,10,'��'.$this->PageNo().'ҳ  ��__totalPage__ҳ',0,0,'R'); 
		//$this->Cell(220,10,date("Y-m-d"),0,0,'R'); 
	}
	// ���һ�б��
	function writeCellLine($widths,$heights,$txts,$borders,$positions,$aligns,$times=14,$fontSizes=10){
		$c = 0;
		for( ; $c < $times ; $c ++){
			$thisLineFontSize = $fontSizes;
			if($fontSizes != null && is_array($fontSizes) && isset($fontSizes[$c])){
				$thisLineFontSize = $fontSizes[$c];
			}
			$this->SetFont('GB','',$thisLineFontSize);
			$txt = is_array($txts) ? $txts[$c] : $txts;
			$txt = ($txt === null || $txt === "NULL")? "" : $txt;
			if ($c == 1) {
				$x = $this->getx();
				$y = $this->gety();
				$this->MultiCell(
					is_array($widths) ? $widths[$c] : $widths ,
					is_array($heights) ? $heights[$c] : $heights ,
					$txt ,
					is_array($borders) ? $borders[$c] : $borders,
					'C',
					false
				);
				$this->setxy($x + 41,$y);
			}
			else {
				$this->Cell(
					is_array($widths) ? $widths[$c] : $widths ,
					is_array($heights) ? $heights[$c] : $heights ,
					$txt ,
					is_array($borders) ? $borders[$c] : $borders ,
					is_array($positions) ? $positions[$c] : $positions ,
					is_array($aligns) ? $aligns[$c] : $aligns
				);
			}
		}
		$this->Ln();
	}
}
?>