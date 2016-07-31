<?php
	include_once "conn.php";

	function getAnnouncementCommentsByBulletinId ($bulletinId){
		global $mysql;
		$res = array();
		// get all comments belonging to the same bulletin item in the first level without attaching to any other parent comment.
		$commentArrInFirstLevel = $mysql->DBGetAsMap("select * from `announcement_comment` where `bulletinId` = '$bulletinId' and `parentId` IS NULL");
		// get all comments belonging to each first level comment.
		for ($i=0; $i < count($commentArrInFirstLevel); $i++) { 
			$item = $commentArrInFirstLevel[$i];
			$parentId = $item["id"];
			$subCommentArr = $mysql->DBGetAsMap("select * from `announcement_comment` where `bulletinId` = '$bulletinId' and `parentId` = '$parentId' ORDER BY `createTime` ASC");
			array_push($res, $item);
			for ($j=0; $j < count($subCommentArr); $j++) { 
				array_push($res, $subCommentArr[$j]);
			}
		}
		return $res;
	}

	function addCommentUnderAnnouncement ($bulletinId, $content, $commenterName){
		global $mysql;
		$parentId = isset($_POST["parentId"]) ? $_POST["parentId"] : '';
		$previousCommenterName = isset($_POST["previousCommenterName"]) ? $_POST["previousCommenterName"] : '';
		$commenter = $mysql->DBGetAsMap("select `realname` from `user` where `name` = '$commenterName' ");
		if (count($commenter) > 0) {
			$commenter = $commenter[0]["realname"];
		}
		$previousCommenter = $mysql->DBGetAsMap("select `realname` from `user` where `name` = '$previousCommenterName' ");
		if (count($previousCommenter) > 0) {
			$previousCommenter = $previousCommenter[0]["realname"];
		}
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"bulletinId" => $bulletinId,
			"content" => $content,
			"commenterName" => $commenterName,
			"commenter" => $commenter
		);
		if ($parentId != '') {
			$obj["parentId"] = $parentId;
		}
		if ($previousCommenterName != '') {
			$obj["previousCommenterName"] = $previousCommenterName;
			$obj["previousCommenter"] = $previousCommenter;
		}
		$mysql->DBInsertAsArray("`announcement_comment`",$obj);
		return array('status'=>'successful', 'errMsg' => '','id'=>$obj['id']);
	}
?>