<?php

class PDF extends PDF_Chinese{
	
	function Header(){ //设置页眉 
	
		$endTime = $_REQUEST['endTime'];
		$startTime = $_REQUEST['startTime'];
		switch($_REQUEST['scale']){
			case "M":
				$scale = '月';
				$startTime = substr($startTime,0,4).'年'.((int)substr($startTime,4,2)).'月';
				$endTime = substr($endTime,0,4).'年'.((int)substr($endTime,4,2)).'月';
			break;
			case "D":
				$scale = '日';
				$endTime = substr($endTime,0,4).'年'.((int)substr($endTime,4,2)).'月'.((int)substr($endTime,6,2)).'日';
				$startTime = substr($startTime,0,4).'年'.((int)substr($startTime,4,2)).'月'.((int)substr($startTime,6,2)).'日';
			break;
			case "Y":
				$scale = '年';
				$endTime = substr($endTime,0,4).'年';
				$startTime = substr($startTime,0,4).'年';
			break;
			default:
			throw new BaseException('only M,D,Y for scale');
		}
		
		
		$this->SetFont('GB','',13); 
		$this->SetLeftMargin(15);
		$this->SetRightMargin(15);
		$this->SetAutoPageBreak(true,10);
		$this->Image('../resources/img/logo.jpg',50,4,22.5,22.5); //增加一张图片，文件名为sight.jpg 
		$this->Text(80,15,'佳诚装饰');
		$this->Text(80,22,$scale."现金帐统计( $startTime ~ $endTime )");
		$this->SetFont('GB','',8); 
		$this->Text(159,28,"打印时间:".date('Y-m-d H:i:s'));
		$this->Ln(20);
	} 
	function Footer(){ //设置页脚  
		$this->SetY(-10); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(120,10,'第'.$this->PageNo().'页  共__totalPage__页',0,0,'R'); 
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
			$txt = is_array($txts) ? $txts[$c] : $txts;
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