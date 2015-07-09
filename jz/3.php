<?php  
header("Content-type: image/png");  
$img = imagecreatefromjpeg("http://alex123bob.sinaapp.com/fd/jz/jiangzhuang.jpg");  

//设置字体颜色  
$textcolor = imagecolorallocate($img,0,0,0);  

//把字符串写在图像左上角  

$font = "./simhei.ttf";

$fontSize = isset($_REQUEST['fontsize']) && is_numeric($_REQUEST['fontsize']) ? $_REQUEST['fontsize'] : 5;
$labelFontSize = 15;
$valueFontSize = 15;
$x = isset($_REQUEST['x']) && is_numeric($_REQUEST['x']) ? $_REQUEST['x'] : 350;
$y = isset($_REQUEST['y']) && is_numeric($_REQUEST['y']) ? $_REQUEST['y'] : 150;
$text = isset($_REQUEST['text']) ? $_REQUEST['text'] : "http://alex123bob.sinaapp.com/fd/jz/jiangzhuang.jpg";

imagettftext($img, $labelFontSize, 0, 150, 170, $black, $font, "业务之坑");
imagettftext($img, $labelFontSize, 0, 150, 220, $black, $font, "签单之坑");
imagettftext($img, $labelFontSize, 0, 150, 270, $black, $font, "项目之坑");

imagettftext($img, $labelFontSize, 0, 370, 170, $black, $font, "张泽南");
imagettftext($img, $labelFontSize, 0, 370, 220, $black, $font, "张泽南");
imagettftext($img, $labelFontSize, 0, 370, 270, $black, $font, "张泽南");


imagepng($img);  
imagedestroy($img);    
?>