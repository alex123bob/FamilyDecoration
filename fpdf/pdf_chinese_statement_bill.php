<?php

class PDF extends PDF_Chinese{
	
	function Header(){ //����ҳü 
	
		global $name,$phone,$times,$address,$totalFee,$finishPercentage,$requiredFee,$cny; 
		
		$this->SetFont('GB','B',20); 
		$this->SetLeftMargin(15);
		$this->SetRightMargin(15);
		//$this->SetTopMargin(15);
		$this->SetAutoPageBreak(true,10);
		//$this->SetTopMargin(5);
		//$this->Image('../resources/img/logo.jpg',60,4,30,30); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->Image('../resources/img/logo.jpg',30,4,22.5,22.5); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->Text(65,20,'�ѳ�װ��');
		$this->Text(65,30,'�����ʩ�����̿���ȡ������');
		$this->SetFont('GB','',8); 
		$this->Text(185,30,'��˾��');
		$this->Ln(5); //����
		$this->SetFont('GB','',10); 
		$this->Text(20,40,'�����:');
		$this->Text(37,40,$name);
		$this->Text(20,48,'��ϵ�绰:');
		$this->Text(37,48,$phone);
		$this->Text(20,56,'������:');
		$this->Text(37,56,'times'.$times);
		$this->Text(100,40,'���̵�ַ:');
		$this->Text(117,40,$address);
		$this->Text(100,48,'�ܽ��:');
		$this->Text(117,48,$totalFee.' (Ԫ)');
		$this->Text(160,48,'������:');
		$this->Text(177,48,$requiredFee.' (Ԫ)');
		$this->Text(100,56,'������:');
		$this->Text(117,56,$finishPercentage);
		$this->Text(160,56,'��д:');
		$this->Text(177,56,$cny);
		

		//$this->Line(10,50,280,50);
		$this->Ln(45);
	} 
	function Footer(){ //����ҳ��  
		$this->SetY(-10); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(170,10,'��'.$this->PageNo().'ҳ  ��__totalPage__ҳ',0,0,'R'); 
		//$this->Cell(220,10,date("Y-m-d"),0,0,'R'); 
	}
	// ���һ�б��
	function writeCellLine($widths,$txts,$borders,$positions,$aligns,$times=14,$fontSizes=10,$fontStyles = array()){
		global $lineHeight;
		$c = 0;
		$thisLineHeight = $lineHeight;
		//���������ݹ�������Ҫ�Զ����У���ˣ���ʱ�򲻽����һ�У�
		//��������ü��У��ȱ������б���ж���Ҫ���������
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
				$tmpLineHeight = ( $c == 6 ? 4 : 5);
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
		//�������б�����
		for( ; $c < $times ; $c ++){
			$this->cMargin = $c == 1 || $c == 6 ? 1 : 0;
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
				if($c == 1 || $c == 6){
					//�ڶ��к����һ�п�����롣��������
					$align = 'L';
				}
				$tmpLineHeight = ( $c == 6 ? 4 : 5);
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