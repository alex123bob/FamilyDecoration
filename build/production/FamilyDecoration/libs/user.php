<?php
	session_start();
	include_once "conn.php";

	$action = $_GET["action"];

	$prefix = "familydecoration-";
	$res = "";

	switch($action){
		case "register": 				$res = register();  break;
		case "login":					$res = login(); break;
		case "logout":					$res = logout(); break;
		case "edit":					$res = edit(); break;
		case "modify":					$res = modify(); break;
		case "view":					$res = getList(); break;
		case "reset":					$res = resetAccount(); break;
		default: 		throw new Exception("unknown action:".$action);
	}
	echo $res;

	/**
	 * [register]
	 * @param array $user [consists of name, password]
	 */
	function register (){
		try {
			$name = $_POST["name"];
			$password = $_POST["password"];
			$level = $_POST["level"];

			global $mysql, $prefix;

			$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name'");

			if ($user) {
				return json_encode(array("status"=>"failing", "errMsg"=>"用户已经存在"));
			}
			else {
				$password = md5($prefix.$password);

				$mysql->DBInsert("`user`", "`name`, `password`, `level`",
				 	"'".$name."', '".$password."', ".$level);

				return json_encode(array('status'=>'successful', 'errMsg' => ''));
			}
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [login description]
	 * @return [type]       [description]
	 */
	function login (){
		try {
			$name = $_POST["name"];
			$password = $_POST["password"];

			global $mysql, $prefix;

			$password = md5($prefix.$password);

			$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name'");

			if ($user["name"] == $name) {
				if ($user["password"] == $password) {

					$_SESSION["name"] = $user["name"];
					$_SESSION["password"] = $user["password"];
					$_SESSION["level"] = $user["level"];

					return json_encode(array('status'=>'successful', 'errMsg'=>''));
				}
				else {
					return json_encode(array('status'=>'failing', 'errMsg'=>'密码不正确！'));
				}
			}
			else {
				return json_encode(array('status'=>'failing', 'errMsg'=>'用户不存在！'));
			}
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [logout description]
	 * @return [type] [description]
	 */
	function logout() {
		session_unset();
		session_destroy();
		return json_encode(array('status'=>'successful', 'errMsg'=>''));
	}

	/**
	 * [edit password by current account user]
	 * @return [type] [description]
	 */
	function edit (){
		try {
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
					return json_encode(array('status'=>'successful', 'errMsg'=>''));
				}
				else {
					return json_encode(array('status'=>'failing', 'errMsg'=>'原密码输入不正确！'));
				}
			}
			else {
				return json_encode(array('status'=>'failing', 'errMsg'=>'用户不存在！'));
			}
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [edit password by administrator]
	 * @param array $user [consists of name, password]
	 */
	function modify (){
		try {
			$name = $_POST["name"];
			$password = $_POST["password"];
			$level = $_POST["level"];

			global $mysql, $prefix;

			$password = md5($prefix.$password);

			$mysql->DBUpdateSomeCols("`user`", "`name` = '$name'", "`password` = '$password', `level` = '$level'");

			return json_encode(array('status'=>'successful', 'errMsg' => ''));
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * [reset account's password]
	 * @return [type] [description]
	 */
	function resetAccount (){
		try {
			$name = $_POST["name"];

			global $mysql, $prefix;

			$newpassword = md5($prefix."666666");

			$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name'");

			if ($user["name"] == $name) {
				$mysql->DBUpdateOneCol("`user`", "`name` = '".$user["name"]."'", "`password`", $newpassword);
				return json_encode(array('status'=>'successful', 'errMsg'=>''));
			}
			else {
				return json_encode(array('status'=>'failing', 'errMsg'=>'用户不存在！'));
			}
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * get all user in a list.
	 * @return json user json string
	 */
	function getList (){
		try {
			global $mysql, $prefix;

			$res = $mysql->DBGetAllRows("`user`", "*");

			return json_encode($res);
		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}
?>