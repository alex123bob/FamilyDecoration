<?php
class PDF extends PDF_Chinese{
	function Header(){ //设置页眉 
		$this->SetFont('GB','B',20); 
		$this->Image('../resources/img/logo.jpg',10,10,30,30); //增加一张图片，文件名为sight.jpg 
		//http://localhost/fd/
		global $custName,$projectName,$CellWidth,$FirstCellWidth,$titleLeft,$GfontSize ; 
		$this->Text(95,30,'佳诚装饰室内装修装饰工程 预算单');
		$this->SetFont('GB','',$GfontSize); 
		$this->Ln(26); //换行 
		$this->Cell(40,10,"",0,0,'C');
		$this->Cell(30,10,"客户姓名 ：",0,0,'L');
		$this->Cell(30,10,$custName,0,0,'L');
		$this->Cell(60,10,"",0,0,'C');
		$this->Cell(30,10,"工程地址 ：",0,0,'L');
		$this->Cell(30,10,$projectName,0,0,'L');
		//$this->Line(10,50,280,50);
		$this->Ln(12); //换行 
		$titles = array('主材','辅材','人工','机械','损耗','');
		$CellHeight = 6;
		$borders = array('LT','LT','LT','LT','LT','LT','LT','LT','LT','LTR');
		$count = 0;
		$titleHeightPosition = 55;
		$this->Cell($FirstCellWidth[$count],$CellHeight,'',$borders[$count],0,'C');
		$this->Text($titleLeft[$count++],$titleHeightPosition,'编号');
		$this->Cell($FirstCellWidth[$count],$CellHeight,'',$borders[$count],0,'C');
		$this->Text($titleLeft[$count++],$titleHeightPosition,'项目名称');
		$this->Cell($FirstCellWidth[$count],$CellHeight,'',$borders[$count],0,'C');
		$this->Text($titleLeft[$count++],$titleHeightPosition,'单位');
		$this->Cell($FirstCellWidth[$count],$CellHeight,'',$borders[$count],0,'C');
		$this->Text($titleLeft[$count++],$titleHeightPosition,'数量');
		foreach($titles as $title){
			$this->Cell($FirstCellWidth[$count],$CellHeight,$title,$borders[$count++],0,'C');
		}
		$this->Text($titleLeft[4],$titleHeightPosition,'备注');
		$this->Ln();
		$titles 	= array('   ','   ','   ','   ','单价','总价','单价','总价','单价','总价','单价','总价','单价','');
		$borders 	= array( 'LRB', 'BR','BR', 'BR', 'BTR', 'BTR', 'BTR', 'BTR', 'BTR', 'BTR', 'BTR', 'BTR',  'BTR', 'BR');
		$CellHeight = 6;///array(15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15);

		$count = 0;
		foreach($titles as $title){
			$this->Cell($CellWidth[$count],$CellHeight,$title,$borders[$count++],0,'C');
		}
		$this->Ln();
	} 
	function Footer(){ //设置页脚  
		$this->SetY(-15); 
		global $GfontSize;
		$this->SetFont('GB','',$GfontSize); 
		$this->Cell(170,10,'第'.$this->PageNo().'页  共__totalPage__页',0,0,'R'); 
		//$this->Cell(220,10,date("Y-m-d"),0,0,'R'); 
	}
	// 输出一行表格
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