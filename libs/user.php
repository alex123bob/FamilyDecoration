<?php
	include_once "conn.php";
	include_once "userDB.php";
	include_once "userOnlineDB.php";
	$action = $_GET["action"];
	$res = "";
	switch($action){
		case "register": 				$res = register();  break;
		case "login":					$res = login(); break;
		case "logout":					$res = logout(); break;
		case "edit":					$res = edit(); break;
		case "modify":					$res = modify(); break;
		case "delete":					$res = delete($_POST['name']); break;
		case "view":					$res = getList(); break;
		case "getrealname":				$res = getUserRealName($_REQUEST['name']); break;
		case "getuserphone":			$res = getUserPhone($_REQUEST['name']); break;
		case "getuseremail":			$res = getUserEmail($_REQUEST['name']); break;
		case "getuserbylevel":			$res = getUserByLevel($_REQUEST['level']); break;
		case "reset":					$res = resetAccount(); break;
		case "checkUserOnlineUniqueness":$res = checkUserOnlineUniqueness();break;
		case "modifyPhoneNumber":		$res = modifyPhoneNumber();break;
		case "modifyEmail":				$res = modifyEmail();break;
		case "modifyProfileImage":		$res = modifyProfileImage();break;
		case "modifyPriority":			$res = modifyPriority();break;
		case "getUserByName":			$res = getUserByName($_GET["name"]);break;
		//TODO   user.php?action=getOnlineUsers&page=xxx&limit=xxx&orderBy=xxx&order=desc/asc
		//user.php?action=getOnlineUsers&beginTime=xxx&endTime=xxx&page=xxx&limit=xxx&orderBy=xxx&order=desc/asc

		//{total:35,page=4,limit=5,users:[{userName,onlineTime,offlineTime,lastUpdateTime}...]}
		case "getOnlineUsers":
			$timeFilter = isset($_REQUEST['timeFilter']) && $_REQUEST['timeFilter'] == "offlineTime" ? "offlineTime" : "onlineTime";
			$beginTime = isset($_REQUEST['beginTime']) ? $_REQUEST['beginTime'] : date('Y-m-d H:i:s',time() - 3600*24*7);
			$endTime = isset($_REQUEST['endTime']) ? $_REQUEST['endTime'] : date('Y-m-d H:i:s');
			$page = isset($_REQUEST['page']) ? $_REQUEST['page'] : '1';
			$orderBy = isset($_REQUEST['orderBy']) ? $_REQUEST['orderBy'] : 'onlineTime';
			$order  = isset($_REQUEST['order']) && $_REQUEST['order']=="desc" ? "desc" :"asc";
			$count = getOnlineUsersCount($beginTime,$endTime);
			$limit = isset($_REQUEST['limit']) ? $_REQUEST['limit'] : $count;

			$res = array();
			$res['total'] = $count;
			$res['page'] = $page;
			$res['limit'] = $limit;
			$res['orderBy'] = $orderBy;
			$res['order'] = $order;
			$res['data'] = getOnlineUsers($timeFilter,$beginTime,$endTime,$page,$limit,$orderBy,$order);
			break;
		//TODO
		case "getUserOnlineInfo":			$res = getUserOnlineInfo();break;
		//TODO
		case "getUserDepartments":			$res = getUserDepartments();break;
		case "getFullUserListByDepartment": $res = getFullUserListByDepartment($_REQUEST["department"]);break;
		case "getUserListByDepartment":		$res = getUserListByDepartment($_REQUEST["department"]);break;
		case "getAdminMembers":				$res = getAdminMembers();break;
		case "getValidateCode": 			$res = getValidateCode();break;
		default: 		throw new Exception("unknown action:".$action);
	}
	if(!$res) $res = array('status'=>'successful', 'errMsg' => '');
	echo json_encode($res);
?>