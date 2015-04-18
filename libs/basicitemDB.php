<?php
	include_once "conn.php";

	/**
	 * [get all basic items]
	 * @return [type] [description]
	 */
	function getBasicItems (){
		global $mysql;
		return $mysql->DBGetAllRows("`basic_item`", "*");
	}
	function addBunchBasicItems($data){
		$basicitems = $data;
		$basicitems = explode("<>", $basicitems["itemName"]);
		for ($i = 0; $i < count($basicitems); $i++) {
			$item = array(
				"itemId" => "basic-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
				"itemName" => $basicitems[$i]
			);
			$info = addBasicItem($item);
		}
		return array('status'=>'successful', 'errMsg' => '');
	}
	/**
	 * [add an item into basic_item table]
	 * @param array $item [description]
	 */
	function addBasicItem (array $item){
		global $mysql;
		$obj = array();
		$obj['itemId'] = $item['itemId'];
		$obj['itemName'] = $item['itemName'];
		$mysql->DBInsertAsArray("`basic_item`",$obj);
		return array('status'=>'successful', 'errMsg' => '');
	}

	/**
	 * [deleteBasicItem description]
	 * @param  [string] $itemId [description]
	 * @return [type]         [description]
	 */
	function deleteBasicItem ($itemId){
		global $mysql;
		$condition = "`itemId` = '".$itemId."'";
		$mysql->DBDelete("`basic_item`", $condition);
		return array('status'=>'successful', 'errMsg' => '');
	}

	/**
	 * [editBasicItem description]
	 * @param  [array] $item [description]
	 * @return [type]       [description]
	 */
	function editBasicItem ($item){
		global $mysql;
		$obj=array();
		foreach ($item as $key => $val) {
			if ($key == "itemId" || is_numeric ($key))
				continue;
			$obj[$key]=$val;
		}
		$mysql->DBUpdate("basic_item",$obj,"`itemId` = '?' ",array($item['itemId']));
		return array('status'=>'successful', 'errMsg' => '');
	}
?>