<?php
	include_once "conn.php";
	
	$prefix = "familydecoration-";
	function delete($nameToDelete){
		global $mysql;
		$name = $_SESSION["name"];
		$level = $_SESSION["level"];
		if($name == $nameToDelete)
			throw new BaseException('不能删除自己！');
		if(!startWith($level,'001-'))
			throw new BaseException('只有管理员可以删除用户！');
		$mysql->DBUpdate('user',array('isDeleted'=>true,'updateTime'=>'now()')," `name` = '?' ",array($nameToDelete));
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
			$phone = isset($_POST["phone"]) ? $_POST["phone"] : '' ;
			$mail = isset($_POST["mail"]) ? $_POST["mail"] : '' ;
			$profileImage = isset($_POST["profileImage"]) ? $_POST["profileImage"] : '' ;
			$securePass = isset($_POST["securePass"]) ? $_POST["securePass"] : '' ;
			$supplierId = isset($_POST["supplierId"]) ? $_POST["supplierId"] : '' ;
			global $mysql;
			$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name'");
			if($user){
				throw new BaseException('用户已经存在！');
			}
			$obj = array(
				'name'=>$name,
				'realname'=>$realname,
				'password'=>$password,
				'level'=>$level,
				'projectId'=>$projectId,
				'phone'=>$phone,
				'mail'=>$mail,
				'securePass' => $securePass,
				'supplierId' => $supplierId
			);
			$mysql->DBInsertAsArray("`user`",$obj);
			return (array('status'=>'successful', 'errMsg' => ''));
	}

	/**
	 * [login description]
	 * @return [type]       [description]
	 */
	function login (){
		//兼容旧的app,下一个版本可以删掉
		if(!isset($_REQUEST["name"])){
			throw new BaseException('请前往 https://dqjczs.sinaapp.com/app/ 升级到最新版app!');
		}
		//兼容旧的app,下一个版本可以删掉

		$name = $_REQUEST["name"];
		$password = $_REQUEST["password"];
		global $mysql;
		$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name' and `isDeleted` = 'false' ");
		if ($user["name"] == $name && $user["password"] == $password) {
			if ($user["isLocked"] == "true") {
				throw new BaseException('用户被锁定，无法登陆!');
			}
			$sessionId = session_id();
			$userName = $user["name"];
			$_SESSION["name"] = $userName;
			$_SESSION["realname"] = $user["realname"];
			$_SESSION["password"] = $user["password"];
			$_SESSION["level"] = $user["level"];
			$_SESSION["phone"] = $user["phone"];
			$_SESSION["mail"] = $user["mail"];
			$_SESSION["profileImage"] = $user["profileImage"];
			!empty($user["supplierId"]) && ($_SESSION["supplierId"] = $user["supplierId"]);
			$ip = getIP();
			$userAgent = $_SERVER['HTTP_USER_AGENT'];
			//update
			$mysql->DBUpdate('online_user',array('lastUpdateTime'=>'now()','offlineTime'=>'now()'),"`userName` = '?' and `offlineTime` is null ",array($userName));
			$obj = array('userName'=>$name,'onlineTime'=>'now()','sessionId'=>$sessionId,'lastUpdateTime'=>'now()','ip'=>$ip,'userAgent'=>$userAgent);
			if(isset($_REQUEST["app"]) && ($_REQUEST["app"] == true || $_REQUEST["app"] == 'true')) {
				$obj['app'] = 1;
				$obj['manufacturer'] = $_REQUEST["manufacturer"];
				$obj['model'] = $_REQUEST["model"];
				$obj['platform'] = $_REQUEST["platform"];
				$obj['version'] = $_REQUEST["version"];
			}
			$mysql->DBInsertAsArray("`online_user`",$obj);
			return (array('status'=>'successful', 'errMsg'=>'','token'=>$sessionId, 'level'=>$user["level"]));
		}
		throw new BaseException('用户或密码不正确！');
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
		$mysql->DBUpdate('online_user',array('offlineTime'=>'now()'),"`userName` = '?' and `offlineTime` is null and `sessionId` = '?'",array($userName,$sessionId));
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
		global $mysql;
		$user = $mysql->DBGetOneRow("`user`", "*", "`name` = '$name'");
		if ($user["name"] == $name) {
			if ($user["password"] == $oldpassword) {
				$obj = array('password'=>$newpassword);
				if(isset($_POST['phone'])) {
					$obj['phone'] = $_POST['phone'];
				}
				if (isset($_POST['mail'])) {
					$obj['mail'] = $_POST['mail'];
				}
				if (isset($_POST['profileImage'])) {
					$obj['profileImage'] = $_POST['profileImage'];
				}
				$mysql->DBUpdate('user',$obj,"`name`= '?' ",array($user["name"]));
				return (array('status'=>'successful', 'errMsg'=>''));
			}
			throw new BaseException('原密码不正确！');
		}
		throw new BaseException('用户不存在！');
	}

	function getValidateCode(){
		$rand = rand(1000,9999);
		$_SESSION['user_validateCode'] = $rand;
		if(!isset($_SESSION['phone']) || strlen($_SESSION['phone']) != 11){
			throw new BaseException('您的手机号码不对,请联系管理员修改!');
		}
		BaseSvc::getSvc('MsgLog')->addAndSend(array('@reciever'=>$_SESSION['name'],'@content'=>'您的短信验证码是:'.$rand));
		return array('status'=>'successful', 'errMsg' => '');
	}
	/**
	 * [edit password by administrator]
	 * @param array $user [consists of name, password]
	 */
	function modify (){
		$name = $_POST["name"];
		$password = isset($_POST["password"]) ? $_POST["password"] : false;
		$level = $_POST["level"];
		$realname = $_POST["realname"];
		$projectId = isset($_POST["projectId"]) ? $_POST["projectId"] : '';
		$phone = isset($_POST["phone"]) ? $_POST["phone"] : '';
		$mail = isset($_POST["mail"]) ? $_POST["mail"] : '';
		$isLocked = isset($_POST["isLocked"]) ? $_POST["isLocked"] : false; // isLocked: 1->lock -1->unlock
		$profileImage = isset($_POST["profileImage"]) ? $_POST["profileImage"] : false;
		$priority = isset($_POST["priority"]) ? $_POST["priority"] : false;
		$priorityTitle = isset($_POST["priorityTitle"]) ? $_POST["priorityTitle"] : '';
		$securePass = isset($_POST['securePass']) ? $_POST["securePass"] : false;
		$phone = isset($_POST['phone']) ? $_POST["phone"] : false;
		$supplierId = isset($_POST['supplierId']) ? $_POST["supplierId"] : false;
		//自己修改自己的手机或者安全密码,需要重新获取短信验证码.管理员不需要.
		if(!isAdminOrAdministrationManager() && $name == $_SESSION['name'] && ( $securePass || $phone )){
			if(!isset($_POST['validateCode'])){
				throw new BaseException('修改安全验证码或者手机号时,必须输入手机短信验证码!');
			}
			if($_POST['validateCode'] != $_SESSION['user_validateCode']){
				throw new BaseException('手机短信验证码错误!');
			}
			unset($_SESSION['user_validateCode']);
		}
		global $mysql;
		$updateArr = array(
			'realname'=>$realname,
			'level'=>$level,
			'projectId'=>$projectId,
			'mail'=>$mail,  
			'priorityTitle'=>$priorityTitle
		);
		if ($password) {
			$updateArr['password'] = $password;
		}
		if ($profileImage) {
			$updateArr["profileImage"] = $profileImage;
		}
		if ($priority) {
			$updateArr["priority"] = $priority;
		}
		if ($phone) {
			$updateArr["phone"] = $phone;
		}
		if ($securePass) {
			$updateArr["securePass"] = $securePass;
		}
		if ($supplierId) {
			$updateArr["supplierId"] = $supplierId;
		}
		if ($isLocked !== false) {
			$updateArr["isLocked"] = ($isLocked == 1 ? 'true' : 'false');
		}
		$mysql->DBUpdate('user',$updateArr,"`name`='?'",array($name));
		// if this operation is to lock account
		if ($isLocked !== false) {
			if ($isLocked == 1) {
				$businesses = $mysql->DBGetAsMap("select b.*, r.name from business b left join region r on b.regionId = r.id where b.salesmanName = '?' and b.isDeleted = 'false' and b.isTransfered = 'false' and b.isDead = 'false' and b.isFrozen = 'false' ", $name);
				for ($i=0; $i < count($businesses); $i++) { 
					$business = $businesses[$i];
					$mysql->DBUpdate('business',array("salesman"=>NULL,"salesmanName"=>NULL,"isWaiting"=>"true"), "`id`='?'",array($business["id"]));
					$mysql->DBInsertAsArray("`user_behavior`", 
												array(
													"userName"=>$_SESSION["name"], 
													"interfaceName"=>"lock account `".$name."`, set salesman of business `".$business["name"]." ".$business["address"]."` as null, businessId is `".$business["id"]."`"
												)
											);
				}
				$businesses = $mysql->DBGetAsMap("select b.*, r.name from business b left join region r on b.regionId = r.id where b.designerName = '?' and b.isDeleted = 'false' and b.isTransfered = 'false' and b.isDead = 'false' and b.isFrozen = 'false' ", $name);
				for ($i=0; $i < count($businesses); $i++) { 
					$business = $businesses[$i];
					$mysql->DBUpdate('business',array("designer"=>NULL,"designerName"=>NULL), "`id`='?'",array($business["id"]));
					$mysql->DBInsertAsArray("`user_behavior`", 
												array(
													"userName"=>$_SESSION["name"], 
													"interfaceName"=>"lock account `".$name."`, set designer of business `".$business["name"]." ".$business["address"]."` as null, businessId is `".$business["id"]."`"
												)
											);
				}
			}
			else if ($isLocked === -1) {

			}
		}
		return (array('status'=>'successful', 'errMsg' => '' ));
	}

	function modifyPhoneNumber (){
		$name = $_POST["name"];
		$phone = $_POST["phone"];
		//自己修改自己的手机或者安全密码,需要重新获取短信验证码.管理员不需要.
		if(!isAdminOrAdministrationManager() && $name == $_SESSION['name']){
			if(!isset($_POST['validateCode'])){
				throw new BaseException('修改手机号时,必须输入手机短信验证码!');
			}
			if($_POST['validateCode'] != $_SESSION['user_validateCode']){
				throw new BaseException('手机短信验证码错误!');
			}
			unset($_SESSION['user_validateCode']);
		}
		global $mysql;
		$mysql->DBUpdate('user',array('phone'=>$phone),"`name`='?'",array($name));
		$_SESSION["phone"] = $phone;
		return (array('status'=>'successful', 'errMsg' => ''));
	}

	function modifyEmail (){
		$name = $_POST["name"];
		$mail = $_POST["mail"];
		global $mysql;
		$mysql->DBUpdate('user',array('mail'=>$mail),"`name`='?'",array($name));
		$_SESSION["mail"] = $mail;
		return (array('status'=>'successful', 'errMsg' => ''));
	}

	function modifyProfileImage (){
		$name = $_POST["name"];
		$profileImage = $_POST["profileImage"];
		global $mysql;
		$mysql->DBUpdate('user',array('profileImage'=>$profileImage),"`name`='?'",array($name));
		$_SESSION["profileImage"] = $profileImage;
		return (array('status'=>'successful', 'errMsg' => ''));
	}

	// modify priority for designer configuration in home website
	function modifyPriority (){
		$name = $_POST["name"];
		$priority = isset($_POST["priority"]) ? $_POST["priority"] : 99;
		$priorityTitle = isset($_POST["priorityTitle"]) ? $_POST["priorityTitle"] : '';
		global $mysql;
		$mysql->DBUpdate('user',array('priority'=>$priority, 'priorityTitle'=>$priorityTitle),"`name`='?'",array($name));
		return (array('status'=>'successful', 'errMsg' => ''));
	}
	// end of modification of priority for designer configuration in home website

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
			$mysql->DBUpdate('user',array('password'=>$newpassword),"`name`='?'",array($user["name"]));
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
		$arr = $mysql->DBGetAsMap("select u.*, p.projectName, s.name as supplierName from `user` u left join project p on p.projectId = u.projectId left join supplier s on u.supplierId = s.id where u.`isDeleted` = 'false' ");
		//select u.*,p.projectName from user u left join project p on p.projectId = u.projectId;
		//$res = $mysql->DBGetAllRows("`user`", "*");
		return ($arr);
	}
	
	function getUserRealName($name){
		global $mysql;
		$names = $mysql->DBGetAsOneArray("select realname from user where name = '?' ",$name);
		$name = count($names) > 0 ? $names[0] : "";
		return array('status'=>'successful',"realname"=>$name);
	}

	function getUserPhone($name){
		global $mysql;
		$phones = $mysql->DBGetAsOneArray("select phone from user where name = '?' ",$name);
		$phone = count($phones) > 0 ? $phones[0] : "";
		return array('status'=>'successful',"phone"=>$phone);
	}

	function getUserEmail($name){
		global $mysql;
		$emails = $mysql->DBGetAsOneArray("select mail from user where name = '?' ",$name);
		$email = count($emails) > 0 ? $emails[0] : "";
		return array('status'=>'successful',"email"=>$email);
	}

	function getUserByLevel ($level) {
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`user`", "*" ,"where `level` = '".$level."' and `isDeleted` = 'false' ");
		return ($arr);
	}

	function getUserLevel($name) {
		global $mysql;
		$level = $mysql->DBGetAsOneArray("select level from user where name = '?' ",$name);
		$level = count($level) > 0 ? $level[0] : "";
		return array('status'=>'successful',"level"=>$level);
	}

	function getUserDepartments (){
		global $mysql;
		$level = $_SESSION["level"];
		$res = array();
		// market department. business department.
		if (startWith($level,'004-')) {
			array_push($res, array("department"=>"006-001"));
			array_push($res, array("department"=>$level));
		}
		// admin or administration manager
		else if (startWith($level,'001-') || $level == '005-001'){
			$groups = $mysql->DBGetAsOneArray("select DISTINCT `level` from `user` where `isDeleted` = 'false'");
			for ($i = 0; $i < count ($groups); $i++) {
				$tmp = explode("-", $groups[$i]);
				$groups[$i] = $tmp[0];
			}
			$groups = array_merge(array_unique($groups));
			for($i = 0; $i < count($groups); $i++) {
				$res[$i] = array("department"=>$groups[$i].'-001');
			}
		}
		// other people
		else {
			array_push($res, array("department"=>$level));
		}
		return $res;
	}

	function getUserListByDepartment ($department){
		global $mysql;
		$level = $_SESSION["level"];
		$userName = $_SESSION["name"];
		// admin members or administration manager
		if (startWith($level, '001-') || $level == '005-001') {
			$userList = $mysql->DBGetAsMap("select u.*, p.projectName, s.name as supplierName from `user` u left join project p on p.projectId = u.projectId left join supplier s on u.supplierId = s.id where u.`level` like '%?-%' and u.`isDeleted` = 'false' ", $department);
		}
		// market people
		else if (startWith($level, '004-')) {
			if ($department == '006') {
				$userList = $mysql->DBGetAsMap("select u.*, p.projectName, s.name as supplierName from `user` u left join project p on p.projectId = u.projectId left join supplier s on u.supplierId = s.id where u.`level` like '%?-%' and u.`isDeleted` = 'false' ", $department);
			}
			else {
				$userList = $mysql->DBGetAsMap("select u.*, p.projectName, s.name as supplierName from `user` u left join project p on p.projectId = u.projectId left join supplier s on u.supplierId = s.id where u.`name` = '?' and u.`isDeleted` = 'false' ", $userName);
			}
		}
		else {
			$userList = $mysql->DBGetAsMap("select u.*, p.projectName, s.name as supplierName from `user` u left join project p on p.projectId = u.projectId left join supplier s on u.supplierId = s.id where u.`name` = '?' and u.`isDeleted` = 'false' ", $userName);
		}
		for($i = 0; $i < count($userList); $i++) {
			$userList[$i]["department"] = $userList[$i]["level"];
		}
		return $userList;
	}

	function getFullUserListByDepartment ($department) {
		global $mysql;
		$userList = $mysql->DBGetAsMap("select u.*, p.projectName, s.name as supplierName from `user` u left join project p on p.projectId = u.projectId left join supplier s on u.supplierId = s.id where u.`level` like '%?-%' and u.`isDeleted` = 'false' ", $department);
		return $userList;
	}

	function getAdminMembers (){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`user`", "*" ,"where `level` like '001-%' and `isDeleted` = 'false' ");
		return ($arr);
	}

	function isAdminOrAdministrationManager (){
		$arr = getAdminMembers();
		$name = $_SESSION["name"];
		$level = $_SESSION["level"];
		$flag = false;
		for ($i=0; $i < count($arr); $i++) { 
			$obj = $arr[$i];
			if ($obj["name"] == $name) {
				$flag = true;
				break;
			}
		}
		return $flag || $level == "005-001";
	}

	function getUserByName ($name){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`user`", "*" ,"where `name` = '$name' and `isDeleted` = 'false' ");
		return ($arr);
	}
?>
