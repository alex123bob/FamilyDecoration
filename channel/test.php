<html>
<head>
<title>test channel</title>
<style>
#message{
	float: left;
    border: #000 1px solid;
    width: 60%;
    height: 600px;
	overflow:auto;
}
#send{
	float: left;
    width: 25%;
    margin-left: 5px;
}
</style>
<script type="text/javascript" src="../tools/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="http://channel.sinaapp.com/api.js"></script>
<script>
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/gm,'');
}
var R = (function(){
	var url = location.href;
	if(url.indexOf("?") == -1)
		return {};
	var params = url.substring(url.indexOf("?")+1).split("&");
	var obj = {};
	for(var i in params){
		var pair = params[i].split("=");
		var key = decodeURIComponent(pair[0]);
		var value = decodeURIComponent(pair[1]);
		obj[key] = value;
	}
	return obj;
})();


<?php
	
	$channel = new SaeChannel();
	//$user = 'private'.rand(1000,100000);
	//$privateCh = $channel->createChannel($user,60);
	$publicCh = $channel->createChannel('publicChannel',60);
?>

var $msg;
var privateChannel = '<?php echo $user;?>';
publicSocket = new sae.Channel('<?php echo $publicCh;?>');


publicSocket.onopen = function(){
	console.log('publicChannel' + " opened");
};

publicSocket.onclose  = function(){
	console.log('publicChannel' + " closed");
};

publicSocket.onerror   = function(){
	console.log('publicChannel' + " error");
};

publicSocket.onmessage = function(m){
	console.log(m);
	$("#message").html($("#message").html()+"<br />"+(new Date()).toLocaleTimeString().replace(" PM","")+":"+decodeURIComponent(m.data));
};


/*
privateSocket = new sae.Channel('<?php echo $privateCh;?>');
privateSocket.onopen = function(){
	console.log(privateChannel + " opened");
};
privateSocket.onmessage = function(m){
	console.log(m);
	$("#message").html($("#message").html()+"<br />"+privateChannel + " : "+m.data);
};
privateSocket.onclose  = function(){
	console.log(privateChannel + " closed");
};

privateSocket.onerror = function(){
	console.log(privateChannel + " error");
};
*/
var $form;
$(function(){
	$form = $("#form");
	$("#btnSend").on("click",function(){
		$.ajax("message.php?"+$form.serialize());
		return false;		
	});
});

setInterval(function() {
  var elem = document.getElementById('message');
  elem.scrollTop = elem.scrollHeight;
}, 100);
</script>
</head>
<body>

<div id="message"></div>
<div id="send">
<form id="form">
	
	content : <input type="text" id="txt" name="message"/><br />
	<button id="btnSend">send</button>
</form>
</div>
</body>
</html>