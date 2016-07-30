<?php
global $billType,$statusMapping,$statusChangingMapping;

//账单类型
$billType = array('ppd'=>'预付款','reg'=>'普通账单','qgd'=>'质量保证金','mtf'=>'材料付款','rbm'=>'报销','fdf'=>'财务部门费用','wlf'=>'福利','tax'=>'税');
//账单状态
$statusMapping = array('new'=>'未提交','rdyck'=>'待财务审核','rdyck1'=>'待总经办审核','chk'=>'已审核','rbk'=>'打回','paid'=>'已付款');
//账单转换约束
$statusChangingMapping = array(
		'new->rdyck'=>1, //新创建->待审核
		'rdyck->chk'=>1, //待审核->已审核
		'rdyck->rbk'=>1, //待审核->打回
		'rbk->rdyck'=>1, //打回->待审核
		'chk->rdyck'=>1, //已审核->待审核  会计审核错了,回退到待审核状态
		'chk->paid'=>1  //已审核->已付款
);

?>