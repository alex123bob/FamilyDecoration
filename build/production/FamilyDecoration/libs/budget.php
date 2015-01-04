<?php
	include_once "conn.php";
	include_once "budgetDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "list": 	$res = getBudgets();  break;
		case "itemlist":$res = getBudgetItemsByBudgetId($_REQUEST["budgetId"]); break;
		case "add":  	$res = addBudget($_REQUEST);  break;
		case "addItem":	$res = addBugetItem($_REQUEST);  break;;
		case "deleItem":$res = delBudgetItem($_REQUEST['budgetId'],$_REQUEST["ItemId"],$_REQUEST['itemCode']);  break;;
		case "edit":	$res = editBudget($_REQUEST);  break;
		case "editItem":$res = editBudgetItem($_REQUEST);  break;
		case "delBigItem":$res = delBigItem($_REQUEST['ItemId'],$_REQUEST['ItemCode']);break;
		case "delete":	$res = delBudget($_REQUEST["budgetId"]);  break;;
		case "view":	$res = getBudgetsByBudgetId($_REQUEST["budgetId"]);  break;
		case "getNextItemCode":	$res = getNextItemCode($_REQUEST["budgetId"]);  break;
		case "getBudgetsByProjectName":	$res = getBudgetsByProjectName($_REQUEST["projectName"]);  break;
		default: 		throw new Exception("unknown action:".$action);
	}
	/*foreach($res as $r){
		foreach($r as $key => $val){
			echo $key.":".$val." ";
		}
		echo "\n";
	}*/
	//print_r($res);
	echo urldecode(json_encode($res));
?>