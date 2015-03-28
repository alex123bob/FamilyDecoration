<?php
	include_once "conn.php";

	/**
	 * [get all basic items]
	 * @return [type] [description]
	 */
	function getBasicItems (){
		try {
			global $mysql;
			$arr = $mysql->DBGetAllRows("`basic_item`", "*");
			if ($arr) {
				// Url encode Chinese characters and then decode them, in order to avert garbled characters.
				foreach($arr as $key => $val) {
					$arr[$key]['itemName'] = urlencode($val['itemName']);
				}
				$arr = urldecode(json_encode($arr));
			}
			else {
				$arr = json_encode(array());
			}
			
			return $arr;
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [add an item into basic_item table]
	 * @param array $item [description]
	 */
	function addBasicItem (array $item){
		try {
			global $mysql;
			$mysql->DBInsert("`basic_item`", "`itemId`, `itemName`",
			 	"'".$item['itemId']."', '".$item['itemName']."'");
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [deleteBasicItem description]
	 * @param  [string] $itemId [description]
	 * @return [type]         [description]
	 */
	function deleteBasicItem ($itemId){
		try {
			global $mysql;
			$condition = "`itemId` = '".$itemId."'";
			$mysql->DBDelete("`basic_item`", $condition);
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [editBasicItem description]
	 * @param  [array] $item [description]
	 * @return [type]       [description]
	 */
	function editBasicItem ($item){
		try {
			global $mysql;
			$setValue = "";
			foreach ($item as $key => $val) {
				if ($key == "itemId" || is_numeric ($key)) {
					continue;
				}
				else {
					$setValue .= " `".$key."` = '".$val."',";
				}
			}
			$setValue = substr($setValue, 0, -1);
			$condition = "`itemId` = '".$item['itemId']."'";
			$mysql->DBUpdateSomeCols("`basic_item`", $condition, $setValue);
			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}
?>