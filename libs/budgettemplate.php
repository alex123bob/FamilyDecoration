<?php
	include_once "conn.php";
	include_once "budgetDB.php";
	include_once "budgettemplateDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	$isParseResut = true;
	switch($action){
		//获取所有模板id
		case "list": 	$res = getBudgetTemplates();  break;
		//获取所有模板id
		case "listIds": 	$res = getBudgetTemplateIds();  $isParseResut = false;break;
		//获取模版所有条目
		case "itemlist":$res = getBudgetTemplateItemsByBudgetId($_REQUEST["templateId"]);break;
		//从预算创建模版
		case "createTemplateFromBudget":  $res = createTemplateFromBudget($_REQUEST["budgetId"]);  break;
		//删除预算
		case "delete":	$res = delBudgetTemplate($_REQUEST["templateId"]);  break;
		//根据id获取预算模板
		case "view":	$res = getBudgetsByBudgetId($_REQUEST["templateId"]);  break;
		default: 		throw new Exception("unknown action:".$action);
	}
	if($isParseResut){
		echo (json_encode($res));
	}	
?>