<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
		<link href="../favicon.ico" type="image/x-icon" rel="shortcut icon" /> 
		<meta charset="utf-8">
		<title>奖状</title>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="renderer" content="webkit">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script type="text/javascript" src="../tools/jquery-1.11.1.min.js"></script>
</head>
<style>
#left{float:left;width:300px;}
#right{float:left;width:900px;}
#text{position:absolute;left:300px;top:300px;}

</style>
<body style="width:900px;height:600px;">
	<img src="jiangzhuang.jpg" style="width:900px;height:600px;" />	
	<div id="text"><?php echo $_REQUEST['text']; ?></div>	
</body>
</html>