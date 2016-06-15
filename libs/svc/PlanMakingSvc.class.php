<?php

Class PlanMakingSvc extends BaseSvc{

	public static $map = array(
		'conCleaHeatDefine'=>'空调、洁具、热水器确定',
		'bottomDig'=>'底层下挖',
		'toiletBalCheck'=>'卫生间、阳台养水验房',
		'plumbElecCheck'=>'上下水、电路检查',
		'knockWall'=>'敲墙',
		'tileMarbleCabiDefine'=>'瓷砖、大理石、橱柜确定',
		'waterElecCheck'=>'水电材料进场、验收',
		'waterElecConstruct'=>'水电施工',
		'waterElecPhoto'=>'水电工程验收、拍照',
		'tilerMateConstruct'=>'泥工材料进场、施工',
		'tilerProCheck'=>'泥工工程验收',
		'woodMateCheck'=>'木工材料进场、验收',
		'woodProConstruct'=>'木工工程施工',
		'woodProCheck'=>'木工工程验收',
		'paintMateCheck'=>'油漆材料进场、验收',
		'paintProConstruct'=>'油漆工程施工',
		'cabiInstall'=>'橱柜安装',
		'toilKitchSuspend'=>'卫生间、厨房吊顶',
		'paintProCheck'=>'油漆工程验收',
		'switchSocketInstall'=>'开关、插座安装',
		'lampSanitInstall'=>'灯具、洁具安装',
		'floorInstall'=>'地板安装',
		'paintRepair'=>'油漆修补',
		'wallpaperPave'=>'墙纸铺贴',
		'housekeepingClean'=>'家政保洁',
		'elecInstall'=>'电器安装',
		'curtainFuniInstall'=>'窗帘、家具安装'
	);

	public static $pmap = array(
		'conCleaHeatDefine'=>'空调、洁具、热水器确定',
		'bottomDig'=>'底层下挖',
		'toiletBalCheck'=>'卫生间、阳台养水验房',
		'plumbElecCheck'=>'上下水、电路检查',
		'knockWall'=>'敲墙',
		'tileMarbleCabiDefine'=>'瓷砖、大理石、橱柜确定',
		'waterElecCheck'=>'水电材料进场、验收',
		'waterElecConstruct'=>'水电施工',
		'waterElecPhoto'=>'水电工程验收、拍照',
		'tilerMateConstruct'=>'泥工材料进场、施工',
		'tilerProCheck'=>'泥工工程验收',
		'woodMateCheck'=>'木工材料进场、验收',
		'woodProConstruct'=>'木工工程施工',
		'woodProCheck'=>'木工工程验收',
		'paintMateCheck'=>'油漆材料进场、验收',
		'paintProConstruct'=>'油漆工程施工',
		'cabiInstall'=>'橱柜安装',
		'toilKitchSuspend'=>'卫生间、厨房吊顶',
		'paintProCheck'=>'油漆工程验收',
		'switchSocketInstall'=>'开关、插座安装',
		'lampSanitInstall'=>'灯具、洁具安装',
		'floorInstall'=>'地板安装',
		'paintRepair'=>'油漆修补',
		'wallpaperPave'=>'墙纸铺贴',
		'housekeepingClean'=>'家政保洁',
		'elecInstall'=>'电器安装',
		'curtainFuniInstall'=>'窗帘、家具安装'
	);

	//get,横标转纵表
	public function getItems($q){
		$res = parent::get($q);
		if($res['total'] == 0)
			throw new Excpetion("没有找到项目计划!");
		$plan = $res['data'][0];
		$res = array();
		$count = 0;
		foreach (PlanSvc::$map as $key => $value) {
			$time = explode("~",isset($plan[$key]) ? 'none~none':$plan[$key]);
			$startTime = $time[0];
			$endTime = $time[1];
			$item = array(
				'serialNumber'=>++$count,
				'parentItemName'=>PlanSvc::$pmap[$key],
				'itemName'=>$value,
				'startTime'=>$startTime,
				'endTime'=>$endTime,
				'professionType'=>'xxx',
				'projectId'=>$plan['projectId'],
				'id'=>$plan['projectId'].'-'.$key);
			array_push($res, $item);
		}
		return $res;
	}

	public function updateItem($q){
		$temp = explode("-",$q['id']);   // projectId-columnName
		$update = array('@'.$temp[1]=>$q['@time'],'projectId'=>$temp[0]);
		return parent::update($update);
	}

	public function add($q){
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}
}
?>