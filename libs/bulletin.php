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
		$title = $_POST["title"];
		$content = $_POST["content"];
		if (isset($_POST["id"])) {
			$mysql->DBUpdate('bulletin',array('content'=>$content, 'title'=>$title), "`id` = ?",array($_POST["id"]));
		}else {
			$mysql->DBInsertAsArray('bulletin',array('content'=>$content, 'title'=>$title));
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
		global $mysql;
		$content = $mysql->DBDelete("`bulletin`", "`id` = $id");
		return json_encode(array('status'=>'successful', 'errMsg' => ''));
	}

	function stickBulletinOnTop ($id){
		global $mysql;
		$content = $mysql->DBUpdate('bulletin',array('isStickTop'=>false), " ",array());
		$content = $mysql->DBUpdate('bulletin',array('isStickTop'=>true), "`id` = ?",array($id));
		return json_encode(array('status'=>'successful', 'errMsg' => ''));
	}

	function unstickBulletinOnTop ($id){
		global $mysql;
		$content = $mysql->DBUpdate("bulletin",array('isStickTop'=>"false"),"`id` = ? ",array($id));
		return json_encode(array('status'=>'successful', 'errMsg' => ''));
	}
?>