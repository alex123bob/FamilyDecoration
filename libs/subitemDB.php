<?php
	include_once "conn.php";

	function getBasicSubItems (){
		global $mysql;
		if (isset($_GET['parentId'])) {
			return $mysql->DBGetSomeRows("`basic_sub_item`", "*", "where `parentId` = '".$_GET["parentId"]."'");	
		}
		else {
			return $mysql->DBGetSomeRows("`basic_sub_item`", "*");
		}
	}

	function getItemsByWorkCategory ($workCategory){
		global $mysql;
		return $mysql->DBGetSomeRows("`basic_sub_item`", "*", "where `workCategory` = '".$workCategory."'");
	}

	function getSortedItems ($parentId){
		global $mysql;
		$currentItemCluster = $mysql->DBGetSomeRows("`basic_sub_item`", "*", "where `parentId` = '".$_GET["parentId"]."'");	
		$otherItemCluster = $mysql->DBGetSomeRows("`basic_sub_item`", "*", "where `parentId` != '".$_GET["parentId"]."' ORDER BY parentId ");
		$res = array_merge($currentItemCluster, $otherItemCluster);
		return $res;
	}

	function addBunchBasicSubItems ($subItem){
		$count = count(explode(">>><<<", $subItem["subItemName"]));
	
		foreach($subItem as $key => $value) {
			if ($key != "parentId") {
				$subItem[$key] = explode(">>><<<", $value);
			}
		}

		$result = array();
		$addArr = array();

		for ($i = 0; $i < $count; $i++) {
			$addArr["subItemId"] = "basic-sub-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);

			// multiply 1000, forced convert price into integer.
			$addArr["subItemName"] = $subItem["subItemName"][$i];
			$addArr["subItemUnit"] = $subItem["subItemUnit"][$i];
			$addArr["mainMaterialPrice"] = $subItem["mainMaterialPrice"][$i];
			$addArr["auxiliaryMaterialPrice"] = $subItem["auxiliaryMaterialPrice"][$i];
			$addArr["manpowerPrice"] = $subItem["manpowerPrice"][$i];
			$addArr["machineryPrice"] = $subItem["machineryPrice"][$i];
			$addArr["lossPercent"] = $subItem["lossPercent"][$i];
			$addArr["parentId"] = $subItem["parentId"];
			$addArr["manpowerCost"] = $subItem["manpowerCost"][$i];
			$addArr["mainMaterialCost"] = $subItem["mainMaterialCost"][$i];
			$addArr["remark"] = $subItem["remark"][$i];
			$addArr["workCategory"] = $subItem["workCategory"][$i];

			$info = addBasicSubItem($addArr);

			if ($info["status"] != "successful") {
				array_push($result, $addArr["subItemName"]);
			}
		}

		if (count($result) <= 0) {
			return array('status'=>'successful', 'errMsg' => '');
		} else {
			$result = implode(",", $result);
			return array('status' => 'failing', 'errMsg'=> $result."未添加成功！");
		}
	}
	
	function addBasicSubItem (array $item){
		global $mysql;
		$obj = array();
		$obj['subItemId'] = isset($item['subItemId']) ? $item['subItemId'] : date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$fields = array("remark","workCategory","subItemName","subItemUnit","mainMaterialPrice", 'manpowerPrice',
		"auxiliaryMaterialPrice","machineryPrice","lossPercent","parentId","mainMaterialCost","manpowerCost");
		foreach($fields as $field){
			if(isset($item[$field])){
				$obj[$field] = $item[$field];
			}
		}
		$mysql->DBInsertAsArray("`basic_sub_item`",$obj);
		return array('status'=>'successful', 'errMsg' => '');
	}

	function deleteBasicSubItem ($itemId){
		global $mysql;
		$arr = explode(">>><<<", $itemId);
		for ($i = 0; $i < count($arr); $i++) {
			$mysql->DBExecute("delete from `basic_sub_item` where `subItemId` = '".$arr[$i]."'");
		}
	}

	function deleteBasicSubItemByParentId ($parentId){
		global $mysql;
		$mysql->DBExecute("delete from `basic_sub_item` where `parentId` = '".$parentId."'");
	}

	function editBasicSubItem (array $item){
		global $mysql;
		$obj = array();
		foreach ($item as $key => $val) {
			if ($key == "subItemId" || is_numeric ($key))
				continue;
			$obj[$key]=$val;
		}
		$mysql->DBUpdate('basic_sub_item',$obj,"`subItemId` = '?'",array($item['subItemId']));
	}
?>