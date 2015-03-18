<?php
	include_once "conn.php";
	
	$prefix = "familydecoration-";
	function delete($nameToDelete){
		global $mysql;
		$name = $_SESSION["name"];
		$level = $_SESSION["level"];
		if($name == $nameToDelete){
			throw new Exception('不能删除自己！');
		}
		if(!startWith($level,'001-')){
			throw new Exception('只有管理员可以删除用户！');
		}
		$mysql->DBUpdateSomeCols("`user`"," `name` = '$nameToDelete' ", "`isDeleted` = 'true',`updateTime` = now() ");
		return (array('status'=>'successful', 'errMsg' => ''));
	}
	/**
	 * [register]
	 * @param array $user [consists of name, password]
	 */
	function register (){
			$name = $_POST["name"];
			$password = $_POST["password"];
			$level = $_POST["level"];
			$realname = $_POST["realname"];
			$projectId = isset($_POST["projectId"]) ? $_POST["projectId"] : '' ;
			global $mysql, $prefix;
			$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name'");
			if($user){
				throw new Exception('用户已经存在！');
			}
			$password = md5($prefix.$password);
			$mysql->DBInsert("`user`", "`name`, `realname`, `password`, `level` , `projectId`" ,"'".$name."', '".$realname."', '".$password."', '".$level."','".$projectId."'");
			return (array('status'=>'successful', 'errMsg' => ''));
	}

	/**
	 * [login description]
	 * @return [type]       [description]
	 */
	function login (){
		$name = $_REQUEST["name"];
		$password = $_REQUEST["password"];
		global $mysql, $prefix;
		$password = md5($prefix.$password);
		$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name'");
		if ($user["name"] == $name && $user["password"] == $password) {
			$sessionId = session_id();
			$userName = $user["name"];
			$_SESSION["name"] = $userName;
			$_SESSION["realname"] = $user["realname"];
			$_SESSION["password"] = $user["password"];
			$_SESSION["level"] = $user["level"];
			$ip = getIP();
			$userAgent = $_SERVER['HTTP_USER_AGENT'];
			//update
			$mysql->DBUpdateSomeCols("`online_user`"," `userName` = '$userName' and `offlineTime` is null ", "`lastUpdateTime` = now(),`offlineTime` = now() ");
			$mysql->DBInsert("`online_user`", "`userName`, `onlineTime`,`sessionId`, `lastUpdateTime`,`ip`,`userAgent`" ," '$name', now(),'$sessionId', now(),'$ip','$userAgent' ");
			return (array('status'=>'successful', 'errMsg'=>'','token'=>$sessionId));
		}
		throw new Exception('用户或密码不正确！');
	}

	/**
	 * [logout description]
	 * @return [type] [description]
	 */
	function logout() {
		if (!isset($_SESSION["name"])){
			return array('status'=>'successful', 'errMsg'=>'already logout');
		}
		$sessionId = session_id();
		$userName = $_SESSION["name"];
		global $mysql;
		$mysql->DBUpdateSomeCols("`online_user`"," `userName` = '$userName' and `offlineTime` is null and `sessionId` = '$sessionId' ", "`lastUpdateTime` = now(),`offlineTime` = now() ");
		session_unset();
		session_destroy();
		return array('status'=>'successful', 'errMsg'=>'log out ok');
	}

	/**
	 * [edit password by current account user]
	 * @return [type] [description]
	 */
	function edit (){
		$name = $_POST["name"];
		$oldpassword= $_POST['oldpassword'];
		$newpassword= $_POST['newpassword'];
		$level = $_POST["level"];

		global $mysql, $prefix;

		$oldpassword = md5($prefix.$oldpassword);
		$newpassword = md5($prefix.$newpassword);

		$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name'");

		if ($user["name"] == $name) {
			if ($user["password"] == $oldpassword) {
				$mysql->DBUpdateOneCol("`user`", "`name` = '".$user["name"]."'", "`password`", $newpassword);
				return (array('status'=>'successful', 'errMsg'=>''));
			} else {
				throw new Exception('原密码不正确！');
			}
		} else {
			throw new Exception('用户不存在！');
		}
	}

	/**
	 * [edit password by administrator]
	 * @param array $user [consists of name, password]
	 */
	function modify (){
		$name = $_POST["name"];
		$password = $_POST["password"];
		$level = $_POST["level"];
		$realname = $_POST["realname"];
		$projectId = isset($_POST["projectId"]) ? $_POST["projectId"] : '';
		global $mysql, $prefix;
		$password = md5($prefix.$password);
		$mysql->DBUpdateSomeCols("`user`", "`name` = '$name'", "`realname` = '$realname', `password` = '$password', `level` = '$level' , `projectId` = '$projectId' ");
		return (array('status'=>'successful', 'errMsg' => ''));
	}

	/**
	 * [reset account's password]
	 * @return [type] [description]
	 */
	function resetAccount (){
		$name = $_POST["name"];

		global $mysql, $prefix;

		$newpassword = md5($prefix."666666");

		$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name'");

		if ($user["name"] == $name) {
			$mysql->DBUpdateOneCol("`user`", "`name` = '".$user["name"]."'", "`password`", $newpassword);
			return (array('status'=>'successful', 'errMsg'=>''));
		} else {
			return (array('status'=>'failing', 'errMsg'=>'用户不存在！'));
		}
	
	}

	/**
	 * get all user in a list.
	 * @return json user json string
	 */
	function getList (){
		global $mysql, $prefix;
		$arr = $mysql->DBGetSomeRows("`user` ", " user.*,p.projectName "," left join project p on p.projectId = user.projectId where user.isDeleted = 'false'" ,"");
		//select u.*,p.projectName from user u left join project p on p.projectId = u.projectId;
		//$res = $mysql->DBGetAllRows("`user`", "*");
		return ($arr);
	}
?>