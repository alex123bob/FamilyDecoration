<?php

class PDF extends PDF_Chinese{
	
	function Header(){ //����ҳü 
	
		$date = $_REQUEST['date'];
		switch($_REQUEST['scale']){
			case "M":
				$scale = '��';
				$date = substr($date,0,4).'��'.((int)substr($date,4,2)).'��';
			break;
			case "D":
				$scale = '��';
				$date = substr($date,0,4).'��'.((int)substr($date,4,2)).'��'.((int)substr($date,6,2)).'��';
			break;
			case "Y":
				$scale = '��';
				$date = substr($date,0,4).'��';
			break;
			default:
			throw new BaseException('only M,D,Y for scale');
		}
		
		
		$this->SetFont('GB','',13); 
		$this->SetLeftMargin(15);
		$this->SetRightMargin(15);
		$this->SetAutoPageBreak(true,10);
		$this->Image('../resources/img/logo.jpg',50,4,22.5,22.5); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->Text(80,15,'�ѳ�װ��');
		$this->Text(80,22,$scale."�ֽ�����ϸ�嵥( $date )");
		$this->SetFont('GB','',8); 
		$this->Text(159,28,"��ӡʱ��:".date('Y-m-d H:i:s'));
		$this->Ln(20);
	} 
	function Footer(){ //����ҳ��  
		$this->SetY(-10); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(120,10,'��'.$this->PageNo().'ҳ  ��__totalPage__ҳ',0,0,'R'); 
		//$this->Cell(220,10,date("Y-m-d"),0,0,'R'); 
	}
	// ���һ�б��
	function writeCellLine($widths,$txts,$borders,$positions,$aligns,$times=6,$fontSizes=10,$fontStyles = array()){
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