<?php
	//createTime,updateTime,isDeleted 不用写
	$TableMapping = array(
		"profession_type"=>array('id','name','value','cname'),
		"statement_bill"=>array('id','creator','billName','billValue','status','checker','isPaid','billType','payee','projectId','projectName','phoneNumber','totalFee','claimAmount','payedTimes','projectProgress','professionType'),
		"statement_bill_item"=>array('id','billId','serialNumber','billItemName','unit','amount','unitPrice','subtotal','referenceItems','professionType','checkedNumber'),
		"statement_basic_item"=>array('id','serialNumber','billItemName','unit','amount','unitPrice','subtotal','referenceItems','professionType'),
		"statement_bill_audit"=>array('id','billId','operator','orignalStatus','newStatus','comments'),
		'project'=>array('projectId','projectName'),
		'plan'=>array('id','projectId','conCleaHeatDefine','bottomDig','toiletBalCheck','plumbElecCheck','knockWall','tileMarbleCabiDefine','waterElecCheck','waterElecConstruct','waterElecPhoto','tilerMateConstruct','tilerProCheck','woodMateCheck','woodProConstruct','woodProCheck','paintMateCheck','paintProConstruct','cabiInstall','toilKitchSuspend','paintProCheck','switchSocketInstall','lampSanitInstall','floorInstall','paintRepair','wallpaperPave','housekeepingClean','elecInstall','curtainFuniInstall'),
		"user"=>array('name','phone','mail','projectId','realname','password','level','priority','profileImage','priorityTitle')
	);

	foreach ($TableMapping as $key => &$value) {
		array_push($value, 'createTime');
		array_push($value, 'isDeleted');
		array_push($value, 'updateTime');
	}
?>