<?php
	include_once "conn.php";

	$action = $_GET["action"];

	$res = "";

	switch($action){
		case "publish": 				$res = publish();  break;
		case "view":					$res = view($_GET["start"], $_GET["limit"], $_GET["page"]); break;
		case "delete":					$res = deleteBulletin($_POST["bulletinId"]); break;
		case "stick":					$res = stickBulletinOnTop($_POST["bulletinId"]); break;
		case "unstick":					$res = unstickBulletinOnTop($_POST["bulletinId"]); break;
		default: 		throw new Exception("unknown action:".$action);
	}
	echo $res;

	/**
	 * publishes announcement only by administrator
	 * @return [type] [description]
	 */
	function publish (){
		global $mysql;
		$content = $_POST["content"];
		if (isset($_POST["id"])) {
			$id = $_POST["id"];
			$mysql->DBUpdateSomeCols("`bulletin`", "`id` = $id", "`content` = \"$content\" ");
		}else {
			$mysql->DBInsertAsArray('bulletin',array('content'=>$content));
		}
		return json_encode(array('status'=>'successful', 'errMsg' => ''));
	}

	/**
	 * view the announcement
	 * @return string
	 */
	function view ($oriStart, $limit, $page){
		try {
			global $mysql;

			$count = count($mysql->DBGetAllRows("`bulletin`", "*"));

			$start = $oriStart + $limit * ($page - 1);

			$topBulletin = $mysql->DBGetOneRow("`bulletin`", "*", "`isStickTop` = \"true\" ");

			// stick information on top.
			if (!empty($topBulletin) && ($page == 1)) {
				$content = $mysql->DBGetSomeRows("`bulletin`", "*", "WHERE `isStickTop` = \"false\" ", "ORDER by `id` DESC limit $start , $limit");
				array_unshift($content, $topBulletin);
				if (count($content) > $limit) {
					array_pop($content);
				}
			}
			else if (!empty($topBulletin) && ($page != 1)) {
				$content = $mysql->DBGetSomeRows("`bulletin`", "*", "WHERE `isStickTop` = \"false\" ", "ORDER by `id` DESC limit $start , $limit");
				$start = $oriStart + $limit * ($page - 2);
				$lastPage = $mysql->DBGetSomeRows("`bulletin`", "*", "WHERE `isStickTop` = \"false\" ", "ORDER by `id` DESC limit $start , $limit");
				$lastOne = array_pop($lastPage);
				array_unshift($content, $lastOne);
				if (count($content) > $limit) {
					array_pop($content);
				}
			}
			else if (empty($topBulletin)) {
				$content = $mysql->DBGetAllRows("`bulletin`", "*", "ORDER by `id` DESC limit $start , $limit");
			}

			$res = array("totalCount" => $count, "resultSet" => $content);

			return json_encode($res);

		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function deleteBulletin ($id){
		try {
			global $mysql;
			
			$content = $mysql->DBDelete("`bulletin`", "`id` = $id");

			return json_encode(array('status'=>'successful', 'errMsg' => ''));

		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function stickBulletinOnTop ($id){
		try {
			global $mysql;
			
			$content = $mysql->DBUpdateSomeCols("`bulletin`", "", "`isStickTop` = \"false\" ");
			$content = $mysql->DBUpdateSomeCols("`bulletin`", "`id` = $id", "`isStickTop` = \"true\" ");

			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	function unstickBulletinOnTop ($id){
		try {
			global $mysql;
			
			$content = $mysql->DBUpdateSomeCols("`bulletin`", "`id` = $id", "`isStickTop` = \"false\" ");

			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}
?>