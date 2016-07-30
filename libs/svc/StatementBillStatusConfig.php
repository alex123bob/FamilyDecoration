<?php
global $BILLTYPE,$STATUSMAPPING,$STATUSTRANSFER,$ALL_STATUS;

//账单类型
$BILLTYPE = array('ppd'=>'预付款','reg'=>'工人工资','qgd'=>'质量保证金','mtf'=>'材料付款','rbm'=>'报销','fdf'=>'财务部门费用','wlf'=>'福利','tax'=>'税');
$ALL_STATUS = array('new'=>'未提交','rdyck'=>'待一审','rdyck2'=>'待二审','rdyck3'=>'待三审','rdyck4'=>'待终审','chk'=>'审核通过','paid'=>'已付款' );

//账单状态
$STATUSMAPPING = array(
	'ppd'=> array('new','rdyck','rdyck2','rdyck3','rdyck4','chk','paid'),
	'reg'=> array('new','rdyck','rdyck2','rdyck3','rdyck4','chk','paid'),
	'qgd'=> array('new','rdyck','rdyck2','rdyck3','rdyck4','chk','paid'),
	'mtf'=> array('new','rdyck','rdyck2','rdyck3','rdyck4','chk','paid'),
	'rbm'=> array('new'=>'未提交','rdyck'=>'待财务审核','rdyck1'=>'待总经办审核','chk'=>'已审核','rbk'=>'打回','paid'=>'已付款'),
	'fdf'=> array('new'=>'未提交','rdyck'=>'待财务审核','rdyck1'=>'待总经办审核','chk'=>'已审核','rbk'=>'打回','paid'=>'已付款'),
	'wlf'=> array('new'=>'未提交','rdyck'=>'待财务审核','rdyck1'=>'待总经办审核','chk'=>'已审核','rbk'=>'打回','paid'=>'已付款'),
	'tax'=> array('new'=>'未提交','rdyck'=>'待财务审核','rdyck1'=>'待总经办审核','chk'=>'已审核','rbk'=>'打回','paid'=>'已付款')
);

//账单转换约束
$STATUSTRANSFER = array();
$STATUSTRANSFER['ppd'] = array(
		'new->rdyck'=>1, //新创建->待审核
		'rdyck->rdyck2'=>1,
		'rdyck2->rdyck3'=>1,
		'rdyck3->rdyck4'=>1,
		'rdyck4->chk'=>1,
		'rdyck4->rdyck3'=>-1,
		'rdyck2->rdyck'=>-1,
		'rdyck3->rdyck2'=>-1,
		'rdyck->new'=>-1, //待审核->打回
		'chk->rdyck4'=>-1, //已审核->待审核  会计审核错了,回退到待审核状态
		'chk->paid'=>1  //已审核->已付款
);
$STATUSTRANSFER['ppd'] = $STATUSTRANSFER['ppd'];
$STATUSTRANSFER['reg'] = $STATUSTRANSFER['ppd'];
$STATUSTRANSFER['qgd'] = $STATUSTRANSFER['ppd'];
$STATUSTRANSFER['mtf'] = $STATUSTRANSFER['ppd'];
$STATUSTRANSFER['rbm'] = $STATUSTRANSFER['ppd'];
$STATUSTRANSFER['fdf'] = $STATUSTRANSFER['ppd'];
$STATUSTRANSFER['wlf'] = $STATUSTRANSFER['ppd'];
$STATUSTRANSFER['tax'] = $STATUSTRANSFER['ppd'];
?>