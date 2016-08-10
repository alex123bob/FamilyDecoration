<?php

class PDF extends PDF_Chinese{
	
	function Header(){ //设置页眉 
	
		global $name,$phone,$times,$address,$captain,$totalFee,$finishPercentage,$requiredFee,$cny,$professionTypeName,$billId; 
		
		$this->SetFont('GB','',13); 
		$this->SetLeftMargin(15);
		$this->SetRightMargin(15);
		//$this->SetTopMargin(15);
		$this->SetAutoPageBreak(true,10);
		//$this->SetTopMargin(5);
		//$this->Image('../resources/img/logo.jpg',60,4,30,30); //增加一张图片，文件名为sight.jpg 
		$this->Image('../resources/img/logo.jpg',50,4,22.5,22.5); //增加一张图片，文件名为sight.jpg 
		$this->Text(80,15,'佳诚装饰');
		$this->Text(80,22,'单项工程施工工程款领取审批单');
		$this->SetFont('GB','',8); 
		$this->Text(158,30,"公司联-$billId($professionTypeName)");
		$this->Ln(5); //换行
		$this->SetFont('GB','',10); 
		$this->Text(35,40,'领款人:');
		$this->Text(47,40,$name);
		$this->Text(35,48,'联系电话:');
		$this->Text(51,48,$phone);
		$this->Text(35,56,'领款次数:');
		$this->Text(51,56,$times);
		$this->Text(80,40,'项目经理:');
		$this->Text(97,40,$captain);
		$this->Text(130,40,'工程地址:');
		$this->Text(148,40,$address);
		$this->Text(80,48,'总金额:');
		$this->Text(93,48,$totalFee.' (元)');
		$this->Text(80,56,'完成情况:');
		$this->Text(97,56,$finishPercentage);
		$this->Text(130,48,'申领金额:');
		$this->Text(147,48,$requiredFee.' (元)');
		$this->Text(130,56,'大写:');
		$this->Text(140,56,$cny);
		

		//$this->Line(10,50,280,50);
		$this->Ln(45);
	} 
	function Footer(){ //设置页脚  
		$this->SetY(-10); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(120,10,'第'.$this->PageNo().'页  共__totalPage__页',0,0,'R'); 
		//$this->Cell(220,10,date("Y-m-d"),0,0,'R'); 
	}
	// 输出一行表格
	function writeCellLine($widths,$txts,$borders,$positions,$aligns,$times=6,$fontSizes=10,$fontStyles = array()){
		global $lineHeight;
		$c = 0;
		$thisLineHeight = $lineHeight;
		//如果表格内容过大，则需要自动换行，因此，有时候不仅输出一行，
		//而是输出好几行，先遍历所有表格，判断需要输出多少行
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
			//echo $c;
			if(is_array($txts) && !isset($txts[$c])){
				var_dump($txt);
				//echo "eee";
				//exit;
			}
			$txt = is_array($txts) ? (isset($txts[$c]) ? $txts[$c] :'TODO'): $txts;
			$txt = ($txt === null || $txt === "NULL")? "" : $txt;
			$w = is_array($widths) ? $widths[$c] : $widths;
			// 计算需要几行 .
			$linesNeed = $this->GetStringShowLines($txt,$w);
			if($linesNeed == 1){
				// do nothing , use default;
			}else{
				// multi lines.
				$tmpLineHeight = ( $c == 6 ? 4 : 5);
				if(!$this->ContainsChinese($txt)){
					//没有中文的话，可以行高再减少1
					$tmpLineHeight--;
				};
				$tmp = $linesNeed * $tmpLineHeight;
				$thisLineHeight = $thisLineHeight > $tmp ?  $thisLineHeight : $tmp;
			}
		}
		
		$c = 0;
		$lastCellHeight;
		//遍历所有表格，输出
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
					//第二列和最后一列靠左对齐。其他居中
					$align = 'L';
				}
				$tmpLineHeight = ( $c == 6 ? 4 : 5);
				if(!$this->ContainsChinese($txt)){
					//没有中文的话，可以行高再减少1
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