<?php
	//createTime,updateTime,isDeleted 不用写
	$TableMapping = array(
		"profession_type"=>array('id','name','value','cname'),
		"statement_bill"=>array('id','creator','billName','billValue','isChecked','checker','isPaid','payee','projectId','projectName','phoneNumber','totalFee','claimAmount','payedTimes','projectProgress','professionType'),
		"statement_bill_item"=>array('id','billId','serialNumber','billItemName','unit','amount','unitPrice','subtotal','referenceItems','professionType'),
		"statement_basic_item"=>array('id','serialNumber','billItemName','unit','amount','unitPrice','subtotal','referenceItems','professionType'),
		"statement_bill_audit"=>array('id','billId','checker','comments','isChecked'),
		"user"=>array('name','phone','mail','projectId','realname','password','level','priority','profileImage','priorityTitle')
	);

	foreach ($TableMapping as $key => &$value) {
		array_push($value, 'createTime');
		array_push($value, 'isDeleted');
		array_push($value, 'updateTime');
	}
?>