<?php
	//createTime,updateTime,isDeleted 不用写
	$TableMapping = array(
		"profession_type"=>array('id','name','value','cname'),
		"statement_bill"=>array('id','refId','businessId','deadline','creator','billName','billValue','status','checker','billType','payee','payer','projectId','projectName','phoneNumber','totalFee','claimAmount','payedTimes','paidAmount','paidTime','projectProgress','descpt','certs','reimbursementReason','professionType', 'supplierId'),
		"statement_bill_item"=>array('id','billId','serialNumber','billItemName','unit','amount','unitPrice','subtotal','referenceItems','professionType','checkedNumber'),
		"statement_basic_item"=>array('id','serialNumber','billItemName','unit','amount','unitPrice','subtotal','referenceItems','professionType'),
		"statement_bill_audit"=>array('id','drt','billId','operator','orignalStatus','newStatus','comments'),
		"supplier_order_audit"=>array('id','drt','billId','operator','orignalStatus','newStatus','comments'),
		'project'=>array('settled','projectId','projectName','captain','isFrozen','captainName'),
		'plan'=>array('id','projectId','projectAddress','startTime','endTime','custName','conCleaHeatDefine','bottomDig','toiletBalCheck','plumbElecCheck','knockWall','tileMarbleCabiDefine','waterElecCheck','waterElecConstruct','waterElecPhoto','tilerMateConstruct','tilerProCheck','woodMateCheck','woodProConstruct','woodProCheck','paintMateCheck','paintProConstruct','cabiInstall','toilKitchSuspend','paintProCheck','switchSocketInstall','lampSanitInstall','floorInstall','paintRepair','wallpaperPave','housekeepingClean','elecInstall','curtainFuniInstall'),
		'plan_making'=>array('id','projectId','projectAddress','startTime','endTime','custName','c1','c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c12','c13','c14','c15','c16','c17','c18','c19','c20','c21','c22','c23','c24','c25','c26','c27','c28','c29','c30','c31','c32','c33','c34'),
		"user"=>array('name','phone','mail','projectId','realname','password','level','priority','profileImage','priorityTitle'),
		"project_progress"=>array('id','columnName','projectId','content','committer'),
		"project_progress_audit"=>array('id','columnName','projectId','content','pics','auditor','pass'),
		"potential_business_detail"=>array('id','potentialBusinessId','comments','committer'),
		"log_list"=>array('id','content','committer','logType','isFinished'),
		"error_log"=>array('params','user','detail','file','line','url','ip','refer','useragent','type'),
		"salary"=>array('id','socialTaxCorp','period','payee','basicSalary','positionSalary','meritSalary','socialTax','balance','amount','paidTime','payer','status'),
		"account"=>array('id','name','accountType','balance'),
		"account_log"=>array('id','accountId','type','amount','balance','refId','refType','operator','desc'),
		"account_log_monthly_check"=>array('id','accountId','scale','checkMonth','income','outcome','balance','checker','status','checkername'),
		"loan"=>array('id','relevantId','type','projectName','bankName','assignee','mobile','amount','dealer','dealTime','interest','period','loanTime','status'),
		"upload_files"=>array('id','refType','refId','name','path','size','type','desc','other','uploader'),
		"business_goal"=>array('id','user','c1','c2','c3','c4','targetMonth'),
		'long_request_log'=>array('url','user','ip','useragent','createTime','time','params'),
		'statement_bill_item_remark'=>array('id','content','refId','committer'),
		'mail'=>array('id','mailSubject','mailContent','mailSender','mailReceiver','senderAddress','receiverAddress','isRead','result','status'),  //邮件发送
		'msg_log'=>array('id','sender','reciever','recieverPhone','status','result','content'),  //短信发送
		'supplier'=>array('id','name','boss','address','email','phone'),
		'supplier_material'=>array('id','supplierId','name','unit','price','professionType'),
		'supplier_material_audit'=>array('approver','approved','id','materialId','name','unit','price','professionType','operation','creator'),
		'supplier_order'=>array('id','projectName','paymentId','status','totalFee','projectId','supplierId','creator','payee','payedTimes','projectProgress'),
		'supplier_order_item'=>array('id','referenceNumber','amount','billId','supplierId','materialId','billItemName','unit','unitPrice','professionType'),
		"versions"=>array('id','desc'),
		"contract_engineering"=>array('id','businessId' ,'customer','totalPrice','discount','additionalProvisions','sid', 'address', 'stages','additionals'),
		"supplier_order_template"=>array('id','supplierId','templateName','supplierId'),
		"supplier_order_item_template"=>array('id','templateId','materialId','referenceNumber'),
		"statement_bill_tag"=>array('id','tag','billId','committer'));

	foreach ($TableMapping as $key => &$value) {
		array_push($value, 'createTime');
		array_push($value, 'isDeleted');
		array_push($value, 'updateTime');
	}
?>