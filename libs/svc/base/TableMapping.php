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
		'plan_making'=>array('id','projectId','projectAddress','startTime','endTime','custName','c1','c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c12','c13','c14','c15','c16','c17','c18','c19','c20','c21','c22','c23','c24','c25','c26','c27','c28','c29','c30','c31','c32','c33','c34'),
		"user"=>array('name','phone','mail','projectId','realname','password','level','priority','profileImage','priorityTitle'),
		"project_progress"=>array('id','columnName','projectId','content','committer'),
		"project_progress_audit"=>array('id','columnName','projectId','content','auditor'),
		"potential_business_detail"=>array('id','potentialBusinessId','comments','committer'),
		"log_list"=>array('id','content','committer','logType','isFinished'),
		"error_log"=>array('user','detail','file','line','url','ip','refer','useragent'),
		"salary"=>array('user','basicSalary','positionSalary','meritSalary','socialTax','balance','paid','paidTime','payee'),
		"account"=>array('id','name','accountType')
	);

	foreach ($TableMapping as $key => &$value) {
		array_push($value, 'createTime');
		array_push($value, 'isDeleted');
		array_push($value, 'updateTime');
	}
?>