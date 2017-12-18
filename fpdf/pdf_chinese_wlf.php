<?php

class PDF extends PDF_Chinese{
	
	function Header(){ //����ҳü 
	
		global $bill, $auditstr;
		
		$this->SetFont('GB','',13); 
		$this->SetLeftMargin(15);
		$this->SetRightMargin(15);
		//$this->SetTopMargin(15);
		$this->SetAutoPageBreak(true,10);
		//$this->SetTopMargin(5);
		
		//$this->Image('../resources/img/logo.jpg',60,4,30,30); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->Image('../resources/img/logo.jpg',50,4,22.5,22.5); //����һ��ͼƬ���ļ���Ϊsight.jpg 
		$this->Text(80,15,'');
		$this->Text(80,22,'�ѳ�װ�� Ա��������');
		$this->SetFont('GB','',8); 
		$this->Text(148,30,'');
		$this->Text(148,30,"���ţ�".$bill['id']);
		$this->Ln(5); //����
		$this->SetFont('GB','',10); 
		$this->Text(35,40,'������:');
		$this->Text(50,40,str2GBK($bill['creatorRealName']));
		$this->Text(83,40,'��������:');
		$this->Text(100,40,str2GBK($bill['projectName']));
		$this->Text(140,40,'������:');
		$this->Text(160,40,str2GBK($bill['claimAmount']).' (Ԫ)');
		$this->Text(35,50,'����:');
		$this->Text(45,50,str2GBK($bill['reimbursementReason']));
		$this->Text(140,50,'��д:');
		$this->Text(150,50,str2GBK(cny($bill['claimAmount'])));
		$this->Text(35,60,'����ʱ��:');
		$this->Text(52,60,str2GBK(substr($bill['createTime'],0,10)));
		$this->Text(35,70,'��ע:');
		$this->Text(50,70,str2GBK($bill['descpt']));
		$this->Ln(45);
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