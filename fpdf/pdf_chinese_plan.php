<?php

class PDF extends PDF_Chinese{
	
	function Header(){ //����ҳü 
	
		global $name,$phone,$times,$address,$totalFee,$finishPercentage,$requiredFee,$cny,$start,$end; 
		
		$this->SetLeftMargin(10);
		$this->SetRightMargin(10);
		//$this->SetTopMargin(15);
		$this->SetAutoPageBreak(true,10);
		//$this->SetTopMargin(5);
		//$this->Image('../resources/img/logo.jpg',60,4,30,30); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->SetFont('GB','',25); 
		$imgWidth = 17;
		$title = '  �ѳ�װ��    ʩ�����ȱ�';
		$firstLine = "�ͻ�����: $name      ���̵�ַ: $address       ��������: $start      �깤����: $end";
		$leftOffset = ($this->w - $this->getstringwidth($title) - $imgWidth)/2;
		$this->Image('../resources/img/logo.jpg',$leftOffset,2,17,17); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->Text($leftOffset+$imgWidth,15,'  �ѳ�װ��    ʩ�����ȱ�');
		$this->Ln(5); //����
		$this->SetFont('','',15); 
		$leftOffset = ($this->w - $this->getstringwidth($firstLine))/2;
		$this->Text($leftOffset,30,$firstLine);
		

		//$this->Line(10,50,280,50);
		$this->Ln(20);
	} 
	function Footer(){ //����ҳ��  
		$this->SetY(-10); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(0,10,'��'.$this->PageNo().'ҳ  ��__totalPage__ҳ',0,0,'C'); 
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
}/**


*/
function getdaysfill($startTime,$endTime,$totalNumber){
	global $start,$end;
	$days = array();
	if($start == "" || $end == ""){
		for($i = 0;$i< $totalNumber;$i++) {
			array_push($days, 0);
		}
		return $days;
	}
	for($count = 0;$count<$totalNumber;$count++){
		$d = date('Y-m-d', strtotime($start."+$count day"));
		array_push($days, $d >= $startTime && $d <= $endTime ? 1 : 0);
	}
	return $days;
}
?>
