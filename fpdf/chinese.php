<?php
require('fpdf.php');

$Big5_widths = array(' '=>250,'!'=>250,'"'=>408,'#'=>668,'$'=>490,'%'=>875,'&'=>698,'\''=>250,
	'('=>240,')'=>240,'*'=>417,'+'=>667,','=>250,'-'=>313,'.'=>250,'/'=>520,'0'=>500,'1'=>500,
	'2'=>500,'3'=>500,'4'=>500,'5'=>500,'6'=>500,'7'=>500,'8'=>500,'9'=>500,':'=>250,';'=>250,
	'<'=>667,'='=>667,'>'=>667,'?'=>396,'@'=>921,'A'=>677,'B'=>615,'C'=>719,'D'=>760,'E'=>625,
	'F'=>552,'G'=>771,'H'=>802,'I'=>354,'J'=>354,'K'=>781,'L'=>604,'M'=>927,'N'=>750,'O'=>823,
	'P'=>563,'Q'=>823,'R'=>729,'S'=>542,'T'=>698,'U'=>771,'V'=>729,'W'=>948,'X'=>771,'Y'=>677,
	'Z'=>635,'['=>344,'\\'=>520,']'=>344,'^'=>469,'_'=>500,'`'=>250,'a'=>469,'b'=>521,'c'=>427,
	'd'=>521,'e'=>438,'f'=>271,'g'=>469,'h'=>531,'i'=>250,'j'=>250,'k'=>458,'l'=>240,'m'=>802,
	'n'=>531,'o'=>500,'p'=>521,'q'=>521,'r'=>365,'s'=>333,'t'=>292,'u'=>521,'v'=>458,'w'=>677,
	'x'=>479,'y'=>458,'z'=>427,'{'=>480,'|'=>496,'}'=>480,'~'=>667);

$GB_widths = array(' '=>207,'!'=>270,'"'=>442,'#'=>527,'$'=>522,'%'=>600,'&'=>610,'\''=>239,
	'('=>374,')'=>374,'*'=>523,'+'=>605,','=>238,'-'=>375,'.'=>238,'/'=>334,'0'=>462,'1'=>462,
	'2'=>480,'3'=>462,'4'=>462,'5'=>462,'6'=>462,'7'=>462,'8'=>462,'9'=>462,':'=>438,';'=>438,
	'<'=>480,'='=>605,'>'=>605,'?'=>464,'@'=>608,'A'=>480,'B'=>480,'C'=>480,'D'=>480,'E'=>480,
	'F'=>480,'G'=>480,'H'=>480,'I'=>480,'J'=>480,'K'=>480,'L'=>480,'M'=>480,'N'=>480,'O'=>480,
	'P'=>480,'Q'=>480,'R'=>480,'S'=>480,'T'=>480,'U'=>480,'V'=>480,'W'=>480,'X'=>480,'Y'=>480,
	'Z'=>480,'['=>480,'\\'=>480,']'=>480,'^'=>480,'_'=>480,'`'=>480,'a'=>480,'b'=>480,'c'=>480,
	'd'=>480,'e'=>480,'f'=>480,'g'=>480,'h'=>480,'i'=>480,'j'=>480,'k'=>480,'l'=>480,'m'=>480,
	'n'=>480,'o'=>480,'p'=>480,'q'=>480,'r'=>480,'s'=>480,'t'=>480,'u'=>480,'v'=>480,'w'=>480,
	'x'=>480,'y'=>480,'z'=>480,'{'=>480,'|'=>480,'}'=>480,'~'=>480);
	
$GB_widths_for_safrai = array(' '=>407,'!'=>270,'"'=>342,'#'=>640,'$'=>562,'%'=>797,'&'=>710,'\''=>360,
	'('=>374,')'=>374,'*'=>523,'+'=>665,','=>238,'-'=>400,'.'=>300,'/'=>400,'0'=>600,'1'=>460,
	'2'=>600,'3'=>600,'4'=>600,'5'=>600,'6'=>600,'7'=>600,'8'=>600,'9'=>600,':'=>338,';'=>338,
	'<'=>600,'='=>605,'>'=>605,'?'=>444,'@'=>848,'A'=>700,'B'=>600,'C'=>740,'D'=>700,'E'=>600,
	'F'=>480,'G'=>900,'H'=>660,'I'=>400,'J'=>600,'K'=>600,'L'=>600,'M'=>900,'N'=>800,'O'=>840,
	'P'=>600,'Q'=>840,'R'=>600,'S'=>500,'T'=>500,'U'=>650,'V'=>680,'W'=>950,'X'=>680,'Y'=>600,
	'Z'=>600,'['=>600,'\\'=>600,']'=>600,'^'=>600,'_'=>600,'`'=>600,'a'=>700,'b'=>700,'c'=>700,
	'd'=>750,'e'=>650,'f'=>350,'g'=>700,'h'=>620,'i'=>300,'j'=>300,'k'=>550,'l'=>280,'m'=>950,
	'n'=>650,'o'=>700,'p'=>680,'q'=>700,'r'=>370,'s'=>450,'t'=>400,'u'=>630,'v'=>600,'w'=>900,
	'x'=>550,'y'=>600,'z'=>520,'{'=>320,'|'=>600,'}'=>400,'~'=>600);
	
$GB_widths_for_chrome_mac = array(' '=>407,'!'=>270,'"'=>342,'#'=>800,'$'=>562,'%'=>900,'&'=>710,'\''=>360,
	'('=>374,')'=>374,'*'=>523,'+'=>665,','=>238,'-'=>400,'.'=>300,'/'=>550,'0'=>600,'1'=>460,
	'2'=>500,'3'=>500,'4'=>500,'5'=>560,'6'=>500,'7'=>500,'8'=>500,'9'=>500,':'=>338,';'=>338,
	'<'=>650,'='=>605,'>'=>605,'?'=>444,'@'=>890,'A'=>750,'B'=>700,'C'=>780,'D'=>800,'E'=>700,
	'F'=>580,'G'=>800,'H'=>844,'I'=>500,'J'=>500,'K'=>600,'L'=>600,'M'=>900,'N'=>800,'O'=>840,
	'P'=>600,'Q'=>840,'R'=>650,'S'=>500,'T'=>600,'U'=>700,'V'=>720,'W'=>950,'X'=>720,'Y'=>700,
	'Z'=>650,'['=>600,'\\'=>600,']'=>380,'^'=>600,'_'=>600,'`'=>600,'a'=>500,'b'=>520,'c'=>420,
	'd'=>520,'e'=>480,'f'=>420,'g'=>520,'h'=>580,'i'=>300,'j'=>300,'k'=>550,'l'=>280,'m'=>730,
	'n'=>550,'o'=>530,'p'=>570,'q'=>550,'r'=>430,'s'=>420,'t'=>400,'u'=>520,'v'=>480,'w'=>700,
	'x'=>500,'y'=>450,'z'=>450,'{'=>560,'|'=>500,'}'=>400,'~'=>680);
	
global $isClientSafari;

switch($UserBrowserClient){
	case "safari":$GB_widths = $GB_widths_for_safrai;break;
	case "chrome_mac":$GB_widths = $GB_widths_for_chrome_mac;break;
	default:/*do nothing,using default;*/break;
	
}


class PDF_Chinese extends FPDF
{
function AddCIDFont($family, $style, $name, $cw, $CMap, $registry)
{
	$fontkey = strtolower($family).strtoupper($style);
	if(isset($this->fonts[$fontkey]))
		$this->Error("Font already added: $family $style");
	$i = count($this->fonts)+1;
	$name = str_replace(' ','',$name);
	$this->fonts[$fontkey] = array('i'=>$i, 'type'=>'Type0', 'name'=>$name, 'up'=>-130, 'ut'=>40, 'cw'=>$cw, 'CMap'=>$CMap, 'registry'=>$registry);
}

function AddCIDFonts($family, $name, $cw, $CMap, $registry)
{
	$this->AddCIDFont($family,'',$name,$cw,$CMap,$registry);
	$this->AddCIDFont($family,'B',$name.',Bold',$cw,$CMap,$registry);
	$this->AddCIDFont($family,'I',$name.',Italic',$cw,$CMap,$registry);
	$this->AddCIDFont($family,'BI',$name.',BoldItalic',$cw,$CMap,$registry);
}

function AddBig5Font($family='Big5', $name='MSungStd-Light-Acro')
{
	// Add Big5 font with proportional Latin
	$cw = $GLOBALS['Big5_widths'];
	$CMap = 'ETenms-B5-H';
	$registry = array('ordering'=>'CNS1', 'supplement'=>0);
	$this->AddCIDFonts($family,$name,$cw,$CMap,$registry);
}

function AddBig5hwFont($family='Big5-hw', $name='MSungStd-Light-Acro')
{
	// Add Big5 font with half-witdh Latin
	for($i=32;$i<=126;$i++)
		$cw[chr($i)] = 500;
	$CMap = 'ETen-B5-H';
	$registry = array('ordering'=>'CNS1', 'supplement'=>0);
	$this->AddCIDFonts($family,$name,$cw,$CMap,$registry);
}

function AddGBFont($family='GB', $name='STSongStd-Light-Acro')
{  
	// Add GB font with proportional Latin
	$cw = $GLOBALS['GB_widths'];
	$CMap = 'GBKp-EUC-H';
	$registry = array('ordering'=>'GB1', 'supplement'=>2);
	$this->AddCIDFonts($family,$name,$cw,$CMap,$registry);
}

function AddGBhwFont($family='GB-hw', $name='STSongStd-Light-Acro')
{
	// Add GB font with half-width Latin
	for($i=32;$i<=126;$i++)
		$cw[chr($i)] = 500;
	$CMap = 'GBK-EUC-H';
	$registry = array('ordering'=>'GB1', 'supplement'=>2);
	$this->AddCIDFonts($family,$name,$cw,$CMap,$registry);
}

function GetStringWidth($s)
{
	if($this->CurrentFont['type']=='Type0')
		return $this->GetMBStringWidth($s);
	else
		return parent::GetStringWidth($s);
}

function GetMBStringWidth($s){
	// Multi-byte version of GetStringWidth()
	$l = 0;
	$cw = &$this->CurrentFont['cw'];
	$nb = strlen($s);
	$i = 0;
	while($i<$nb){
		$c = $s[$i];
		if(ord($c)<128){
			$l += isset($cw[$c]) ? $cw[$c] : 480; 
			$i++;
		}else{
			$l += 1000;
			$i += 2;
		}
	}
	$res = $l*$this->FontSize/1000;
	return $res;
}

function MultiCell($w, $h, $txt, $border=0, $align='L', $fill=0,$thisLineHeight)
{
	if($this->CurrentFont['type']=='Type0'){
		return $this->MBMultiCell($w,$h,$txt,$border,$align,$fill,$thisLineHeight);
	}else{
		parent::MultiCell($w,$h,$txt,$border,$align,$fill,$thisLineHeight);
	}
}

function ContainsChinese($string=''){
	$strLen = strlen($string);
	for($count = 0;$count < $strLen;$count++){
		if(ord($string[$count])>=128)
			return true;
	}
	return false;
}
//返回显示字符串需要多少行,最少为1.空也为1行。
function GetStringShowLines($string='',$w){
	//原来的算法，碰到计算宽度有问题。
	// G-1 墙上漆 px 0.00 12.00 0.00 213.00 0.00 123.00 0.00 113.00 0.00 204.75
	// 实际只需一行，计算是两行。不解。
	/*if($string==='')
		return 1;
	$widthForShow = ($w - $this->cMargin*2);
	//echo "widthForShow:$widthForShow<br />";
	$strLen = strlen($string);
	$linesNeed = 0;
	$line = '';
	for($count = 0;$count < $strLen;$count++){
		$char = $string[$count];
		if($char == '\n'){
			$linesNeed++;
			$line = '';
			continue;
		}
		$line .= $char;
		$tmpLineWidth = $this->GetStringWidth($line);
		if($tmpLineWidth > $widthForShow){
			$line = $char;
			$linesNeed++;
		}else if($tmpLineWidth == $widthForShow){
			$line = '';
			$linesNeed++;
		}else{
			//continue next char.
		}
	}
	if($line !== ''){
		$linesNeed ++;
	}
	return $linesNeed;
	*/
	
	// Multi-byte version of MultiCell()
	// 用multicell里面的方法计算行数。
	$linesNeed = 0;
	$currentFont = &$this->CurrentFont['cw'];
	$wmax = ($w-2*$this->cMargin)*1000/$this->FontSize;
	//echo "wmax:$wmax<br />";
	$string = str_replace("\r",'',$string);
	$slength = strlen($string);
	if($slength>0 && $string[$slength-1] == "\n"){
		$slength--;
	}
	$sep = -1;
	$i = 0;
	$j = 0;
	$l = 0;
	$nl = 1;
	while($i<$slength){
		$char = $string[$i];  // Get next character
		$ascii = (ord($char)<128);  // Check if ASCII or MB
		if($char == "\n"){ // Explicit line break
			$linesNeed++;
			//echo "linesNeed1 ";
			$i++;
			$sep = -1;
			$j = $i;
			$l = 0;
			$nl++;
			continue;
		}
		if(!$ascii){
			$sep = $i;
			$ls = $l;
		}elseif($char==' '){
			$sep = $i;
			$ls = $l;
		}
		$l += $ascii ? $currentFont[$char] : 1000;
		if($l>$wmax){
			// Automatic line break
			if($sep==-1 || $i==$j){
				if($i==$j)
					$i += $ascii ? 1 : 2;
			}else{
				$i = ($string[$sep]==' ') ? $sep+1 : $sep;
			}
			$linesNeed++;
			$sep = -1;
			$j = $i;
			$l = 0;
			$nl++;
		}else{
			$i += $ascii ? 1 : 2;
		}
	}
	return ++$linesNeed;
}

function MBMultiCell($w, $h, $txt, $border=0, $align='L', $fill=0,$thisLineHeight)
{
	// Multi-byte version of MultiCell()
	$currentFont = &$this->CurrentFont['cw'];
	if($w==0)
		$w = $this->w-$this->rMargin-$this->x;
	$wmax = ($w-2*$this->cMargin)*1000/$this->FontSize;
	$string = str_replace("\r",'',$txt);
	$slength = strlen($string);
	if($slength>0 && $string[$slength-1] == "\n"){
		$slength--;
	}		
	$b = 0;
	if($border){
		if($border==1){
			$border = 'LTRB';
			$b = 'LRT';
			$b2 = 'LR';
		}else{
			$b2 = '';
			if(is_int(strpos($border,'L')))
				$b2 .= 'L';
			if(is_int(strpos($border,'R')))
				$b2 .= 'R';
			$b = is_int(strpos($border,'T')) ? $b2.'T' : $b2;
		}
	}
	$sep = -1;
	$i = 0;
	$j = 0;
	$l = 0;
	$nl = 1;
	$headBlankLineHeight = 0;
	$tailBlankLineHeight = 0;
	if($thisLineHeight > $h){		
		//如果预期行高比实际行高高，则要在前后各输出空行，做到垂直居中
		$linesActualNeed = $this->GetStringShowLines($txt,$w);
		$blankHeight = $thisLineHeight - $linesActualNeed * $h;
		$headBlankLineHeight = floor($blankHeight/2);
		$tailBlankLineHeight = $blankHeight - $headBlankLineHeight;
		$this->Cell($w,$headBlankLineHeight,'',$b,2,$align,$fill);
	}
	$ssssss = "";
	while($i<$slength){
		$char = $string[$i];  // Get next character
		$ascii = (ord($char)<128);  // Check if ASCII or MB
		if($char == "\n"){ // Explicit line break
			$this->Cell($w,$h,substr($string,$j,$i-$j),$b,2,$align,$fill);
			$i++;
			$sep = -1;
			$j = $i;
			$l = 0;
			$nl++;
			if($border && $nl==2){
				$b = $b2;
			}
			continue;
		}
		if(!$ascii){
			$sep = $i;
			$ls = $l;
		}elseif($char==' '){
			$sep = $i;
			$ls = $l;
		}
		$l += $ascii ? $currentFont[$char] : 1000;
		if($l>$wmax)
		{
			// Automatic line break
			if($sep==-1 || $i==$j)
			{
				if($i==$j)
					$i += $ascii ? 1 : 2;
				$this->Cell($w,$h,substr($string,$j,$i-$j),$b,2,$align,$fill);
			}
			else
			{
				$this->Cell($w,$h,substr($string,$j,$sep-$j),$b,2,$align,$fill);
				$i = ($string[$sep]==' ') ? $sep+1 : $sep;
			}
			$sep = -1;
			$j = $i;
			$l = 0;
			$nl++;
			if($border && $nl==2)
				$b = $b2;
		}
		else
			$i += $ascii ? 1 : 2;
	}
	$lastLineHeight = $h;
	if($tailBlankLineHeight == 0){
		// Last chunk
		if($border && is_int(strpos($border,'B')))
			$b .= 'B';
		$this->Cell($w,$h,substr($string,$j,$i-$j),$b,2,$align,$fill);
	}else{
		// Last chunk
		$this->Cell($w,$h,substr($string,$j,$i-$j),$b,2,$align,$fill);
		if($border && is_int(strpos($border,'B')))
			$b .= 'B';
		$this->Cell($w,$tailBlankLineHeight,'',$b,2,$align,$fill);
		$lastLineHeight = $tailBlankLineHeight;
	}
	$this->x = $this->lMargin;	
	return $lastLineHeight;
}

function Write($h, $txt, $link='')
{
	if($this->CurrentFont['type']=='Type0')
		$this->MBWrite($h,$txt,$link);
	else
		parent::Write($h,$txt,$link);
}

function MBWrite($h, $txt, $link)
{
	// Multi-byte version of Write()
	$cw = &$this->CurrentFont['cw'];
	$w = $this->w-$this->rMargin-$this->x;
	$wmax = ($w-2*$this->cMargin)*1000/$this->FontSize;
	$s = str_replace("\r",'',$txt);
	$nb = strlen($s);
	$sep = -1;
	$i = 0;
	$j = 0;
	$l = 0;
	$nl = 1;
	while($i<$nb)
	{
		// Get next character
		$c = $s[$i];
		// Check if ASCII or MB
		$ascii = (ord($c)<128);
		if($c=="\n")
		{
			// Explicit line break
			$this->Cell($w,$h,substr($s,$j,$i-$j),0,2,'',0,$link);
			$i++;
			$sep = -1;
			$j = $i;
			$l = 0;
			if($nl==1)
			{
				$this->x = $this->lMargin;
				$w = $this->w-$this->rMargin-$this->x;
				$wmax = ($w-2*$this->cMargin)*1000/$this->FontSize;
			}
			$nl++;
			continue;
		}
		if(!$ascii || $c==' ')
			$sep = $i;
		$l += $ascii ? $cw[$c] : 1000;
		if($l>$wmax)
		{
			// Automatic line break
			if($sep==-1 || $i==$j)
			{
				if($this->x>$this->lMargin)
				{
					// Move to next line
					$this->x = $this->lMargin;
					$this->y += $h;
					$w = $this->w-$this->rMargin-$this->x;
					$wmax = ($w-2*$this->cMargin)*1000/$this->FontSize;
					$i++;
					$nl++;
					continue;
				}
				if($i==$j)
					$i += $ascii ? 1 : 2;
				$this->Cell($w,$h,substr($s,$j,$i-$j),0,2,'',0,$link);
			}
			else
			{
				$this->Cell($w,$h,substr($s,$j,$sep-$j),0,2,'',0,$link);
				$i = ($s[$sep]==' ') ? $sep+1 : $sep;
			}
			$sep = -1;
			$j = $i;
			$l = 0;
			if($nl==1)
			{
				$this->x = $this->lMargin;
				$w = $this->w-$this->rMargin-$this->x;
				$wmax = ($w-2*$this->cMargin)*1000/$this->FontSize;
			}
			$nl++;
		}
		else
			$i += $ascii ? 1 : 2;
	}
	// Last chunk
	if($i!=$j)
		$this->Cell($l/1000*$this->FontSize,$h,substr($s,$j,$i-$j),0,0,'',0,$link);
}

function _putType0($font)
{
	// Type0
	$this->_newobj();
	$this->_out('<</Type /Font');
	$this->_out('/Subtype /Type0');
	$this->_out('/BaseFont /'.$font['name'].'-'.$font['CMap']);
	$this->_out('/Encoding /'.$font['CMap']);
	$this->_out('/DescendantFonts ['.($this->n+1).' 0 R]');
	$this->_out('>>');
	$this->_out('endobj');
	// CIDFont
	$this->_newobj();
	$this->_out('<</Type /Font');
	$this->_out('/Subtype /CIDFontType0');
	$this->_out('/BaseFont /'.$font['name']);
	$this->_out('/CIDSystemInfo <</Registry '.$this->_textstring('Adobe').' /Ordering '.$this->_textstring($font['registry']['ordering']).' /Supplement '.$font['registry']['supplement'].'>>');
	$this->_out('/FontDescriptor '.($this->n+1).' 0 R');
	if($font['CMap']=='ETen-B5-H')
		$W = '13648 13742 500';
	elseif($font['CMap']=='GBK-EUC-H')
		$W = '814 907 500 7716 [500]';
	else
		$W = '1 ['.implode(' ',$font['cw']).']';
	$this->_out('/W ['.$W.']>>');
	$this->_out('endobj');
	// Font descriptor
	$this->_newobj();
	$this->_out('<</Type /FontDescriptor');
	$this->_out('/FontName /'.$font['name']);
	$this->_out('/Flags 6');
	$this->_out('/FontBBox [0 -200 1000 900]');
	$this->_out('/ItalicAngle 0');
	$this->_out('/Ascent 800');
	$this->_out('/Descent -200');
	$this->_out('/CapHeight 800');
	$this->_out('/StemV 50');
	$this->_out('>>');
	$this->_out('endobj');
}
}
?>
