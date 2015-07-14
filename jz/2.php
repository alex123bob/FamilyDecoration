<?php  
header("Content-type: image/png");  
$img = imagecreatefromjpeg("jiangzhuang.jpg");  
date_default_timezone_set('PRC');

$businessStar = $_GET["businessStar"];
$signStar = $_GET["signStar"];

//设置字体颜色  
$textcolor = imagecolorallocate($img,0,0,0);  

//把字符串写在图像左上角  

$font = "./simhei.ttf";

$fontSize = isset($_REQUEST['fontsize']) && is_numeric($_REQUEST['fontsize']) ? $_REQUEST['fontsize'] : 5;
$labelFontSize = 25;
$valueFontSize = 15;
$x = isset($_REQUEST['x']) && is_numeric($_REQUEST['x']) ? $_REQUEST['x'] : 350;
$y = isset($_REQUEST['y']) && is_numeric($_REQUEST['y']) ? $_REQUEST['y'] : 150;
$text = isset($_REQUEST['text']) ? $_REQUEST['text'] : "http://alex123bob.sinaapp.com/fd/jz/jiangzhuang.jpg";

imagettftext($img, $labelFontSize, 0, 300, 320, $black, $font, "业务之星");
imagettftext($img, $labelFontSize, 0, 300, 420, $black, $font, "签单之星");
imagettftext($img, $labelFontSize, 0, 300, 520, $black, $font, "项目之星");

imagettftext($img, $labelFontSize, 0, 600, 320, $black, $font, $businessStar);
imagettftext($img, $labelFontSize, 0, 600, 420, $black, $font, $signStar);
// imagettftext($img, $labelFontSize, 0, 600, 520, $black, $font, "张泽南");


imagepng($img);  
imagedestroy($img);    
?>