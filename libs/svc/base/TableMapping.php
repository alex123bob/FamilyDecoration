<?php
	//createTime,updateTime,isDeleted 不用写
	$TableMapping = array(
		"profession_type"=>array('id','name','value','cname'),
		"statement_bill"=>array('id','creator','billName','billValue','status','checker','isPaid','billType','payee','projectId','projectName','phoneNumber','totalFee','claimAmount','payedTimes','projectProgress','professionType'),
		"statement_bill_item"=>array('id','billId','serialNumber','billItemName','unit','amount','unitPrice','subtotal','referenceItems','professionType','checkedNumber'),
		"statement_basic_item"=>array('id','serialNumber','billItemName','unit','amount','unitPrice','subtotal','referenceItems','professionType'),
		"statement_bill_audit"=>array('id','billId','operator','orignalStatus','newStatus','comments'),
		'project'=>array('projectId','projectName'),
		'plan'=>array('id','projectId','projectAddress','startTime','endTime','custName','conCleaHeatDefine','bottomDig','toiletBalCheck','plumbElecCheck','knockWall','tileMarbleCabiDefine','waterElecCheck','waterElecConstruct','waterElecPhoto','tilerMateConstruct','tilerProCheck','woodMateCheck','woodProConstruct','woodProCheck','paintMateCheck','paintProConstruct','cabiInstall','toilKitchSuspend','paintProCheck','switchSocketInstall','lampSanitInstall','floorInstall','paintRepair','wallpaperPave','housekeepingClean','elecInstall','curtainFuniInstall'),
		'plan_making'=>array('id','projectId','projectAddress','startTime','endTime','custName','c1','c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c12','c13','c14','c15','c16','c17','c18','c19','c20','c21','c22','c23','c24','c25','c26','c27','c28','c29','c30','c31','c32'),
		"user"=>array('name','phone','mail','projectId','realname','password','level','priority','profileImage','priorityTitle'),
		"project_progress"=>array('id','projectId','pc1','pc2','pc3','pc4','pc5','pc6','pc7','pc8','pc9','pc10','pc11','pc12','pc13','pc14','pc15','pc16','pc17','pc18','pc19','pc20','pc21','pc22','pc23','pc24','pc25','pc26','pc27','pc28','pc29','pc30','pc31','pc32','mc1','mc2','mc3','mc4','mc5','mc6','mc7','mc8','mc9','mc10','mc11','mc12','mc13','mc14','mc15','mc16','mc17','mc18','mc19','mc20','mc21','mc22','mc23','mc24','mc25','mc26','mc27','mc28','mc29','mc30','mc31','mc32')
	);

	foreach ($TableMapping as $key => &$value) {
		array_push($value, 'createTime');
		array_push($value, 'isDeleted');
		array_push($value, 'updateTime');
	}
?>