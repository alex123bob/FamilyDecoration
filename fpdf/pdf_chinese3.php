<?php

class PDF extends PDF_Chinese{
	
	function Header(){ //����ҳü 
	
		global $custName,$budgetName,$projectName,$CellWidth,$FirstCellWidth,$titleLeft,$GfontSize,$lineHeight; 
		
		$this->SetFont('GB','B',20); 
		$this->SetLeftMargin(15);
		$this->SetRightMargin(15);
		//$this->SetTopMargin(15);
		$this->SetAutoPageBreak(true,10);
		//$this->SetTopMargin(5);
		//$this->Image('../resources/img/logo.jpg',60,4,30,30); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->Image('../resources/img/logo.jpg',20,4,22.5,22.5); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->Text(55,20,$budgetName);
		$this->SetFont('GB','',$GfontSize); 
		$this->Ln(20); //���� 
		$this->Cell(10,10,"",0,0,'C');
		$this->Cell(20,10,"�ͻ����� ��",0,0,'L');
		$this->Cell(30,10,$custName,0,0,'L');
		$this->Cell(20,10,"",0,0,'C');
		$this->Cell(20,10,"���̵�ַ ��",0,0,'L');
		$this->Cell(30,10,$projectName,0,0,'L');
		$this->Ln(12); //���� 
		$titles = array('');
		$CellHeight = 6;
		$borders = array('LT','LT','LT','LT','LTR');
		$count = 0;
		$titleHeightPosition = 50;
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
		$titles 	= array('   ','   ','   ','   ','');
		$borders 	= array( 'LRB', 'BR','BR', 'BR','BR');
		$CellHeight = 6;

		$count = 0;
		foreach($titles as $title){
			$this->Cell($CellWidth[$count],$CellHeight,$title,$borders[$count++],0,'C');
		}
		$this->Ln();
	} 
	function Footer(){ //����ҳ��  
		$this->SetY(-10); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(170,10,'��'.$this->PageNo().'ҳ  ��__totalPage__ҳ',0,0,'R'); 
		//$this->Cell(220,10,date("Y-m-d"),0,0,'R'); 
	}
	// ���һ�б���
	function writeCellLine($widths,$txts,$borders,$positions,$aligns,$times=5,$fontSizes=10,$fontStyles = array()){
		global $lineHeight;
		$c = 0;
		$thisLineHeight = $lineHeight;
		//����������ݹ�������Ҫ�Զ����У���ˣ���ʱ�򲻽����һ�У�
		//��������ü��У��ȱ������б����ж���Ҫ���������
		for( ; $c < $times ; $c ++){
			$thisLineFontSize = $fontSizes;
			$thisLineFontStyle = '';
			if($fontSizes != null && is_array($fontSizes) && isset($fontSizes[$c])){
				$thisLineFontSize = $fontSizes[$c];
			}
			if($fontStyles != null && is_array($fontStyles) && isset($fontStyles[$c])){
				$thisLineFontStyle = $fontStyles[$c];
			}
			$this->SetFont('GB',$thisLineFontStyle,$thisLineFontSize);
			$txt = is_array($txts) ? $txts[$c] : $txts;
			$txt = ($txt === null || $txt === "NULL")? "" : $txt;
			$w = is_array($widths) ? $widths[$c] : $widths;
			// ������Ҫ���� .
			$linesNeed = $this->GetStringShowLines($txt,$w);
			if($linesNeed == 1){
				// do nothing , use default;
			}else{
				// multi lines.
				$tmpLineHeight = ( $c == 13 ? 4 : 5);
				if(!$this->ContainsChinese($txt)){
					//û�����ĵĻ��������и��ټ���1
					$tmpLineHeight--;
				};
				$tmp = $linesNeed * $tmpLineHeight;
				$thisLineHeight = $thisLineHeight > $tmp ?  $thisLineHeight : $tmp;
			}
		}
		
		$c = 0;
		$lastCellHeight;
		//�������б������
		for( ; $c < $times ; $c ++){
			$this->cMargin = $c == 1 || $c == 13 ? 1 : 0;
			$thisLineFontSize = $fontSizes;
			if($fontSizes != null && is_array($fontSizes) && isset($fontSizes[$c])){
				$thisLineFontSize = $fontSizes[$c];
			}
			$this->SetFont('GB',$thisLineFontStyle,$thisLineFontSize);
			$txt = is_array($txts) ? $txts[$c] : $txts;
			$txt = ($txt === null || $txt === "NULL")? "" : $txt;
			$w = is_array($widths) ? $widths[$c] : $widths;
			$border = is_array($borders) ? $borders[$c] : $borders;
			$align = is_array($aligns) ? $aligns[$c] : $aligns;
			$linesNeed = $this->GetStringShowLines($txt,$w);
			
			if($linesNeed > 1){
				$x = $this->getx();
				$y = $this->gety();
				if($c == 1 || $c == 13){
					//�ڶ��к����һ�п�����롣��������
					$align = 'L';
				}
				$tmpLineHeight = ( $c == 13 ? 4 : 5);
				if(!$this->ContainsChinese($txt)){
					//û�����ĵĻ��������и��ټ���1
					$tmpLineHeight--;
				};
				$tmp = $linesNeed * $tmpLineHeight;
				$lastCellHeight = $this->MultiCell($w,$tmpLineHeight,$txt,$border,$align,false,$thisLineHeight);
				$this->setxy($x+$w,$y);
			}else{
				$this->Cell($w,$thisLineHeight,$txt,$border,'R',$align);
				$lastCellHeight = $thisLineHeight;
			}
		}

		$x = $this->getx();
		$y = $this->gety();
		$this->setxy($x,$y+$thisLineHeight-$lastCellHeight);
		$this->Ln();
	}
}
?>