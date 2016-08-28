<?php
class ProfessionTypeSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['@id'] = $this->getUUID();
		return parent::add($qryParams);
	}
	public function get($q){
		if(isset($q['projectId'])){
			global $mysql;
			$params = array();
			$whereSql0 = parent::parseWhereSql('',$q,$params,'statement_bill');
			$whereSql1 = parent::parseWhereSql('',$q,$params,'statement_bill');
			$whereSql2 = parent::parseWhereSql('p.',$q,$params,'profession_type');
			$orderBy = parent::parseOrderBySql($q);
			$limit = "";//parent::parseLimitSql($q);
			$sql = "select p.* ,IFNULL(b.h,0) as highLight,IFNULL(b2.h,0) as rdyck1 from profession_type p".
					" left join ( ".
						"select count(1) as h , professionType from statement_bill $whereSql0 group by professionType".
					") b on b.professionType = p.value ".
					"left join ( ".
						"select count(1) as h , professionType from statement_bill $whereSql1 and status = 'rdyck1' group by professionType".
					") b2 on b2.professionType = p.value $whereSql2 ";
			$row = $mysql->DBGetAsMap($sql.$orderBy.$limit,$params);
			//$count = $mysql->DBGetAsOneArray("select count(1) from ( $sql ) as a",$params);
			//$count = $count[0];
			return array('total'=>count($row),'data'=>$row);
		}else{
			return parent::get($q);
		}
	}
}
?>