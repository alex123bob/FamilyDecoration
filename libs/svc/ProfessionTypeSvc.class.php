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
			$whereSql1 = parent::parseWhereSql('',$q,$params,'statement_bill');
			$whereSql2 = parent::parseWhereSql('p.',$q,$params,'profession_type');
			$orderBy = parent::parseOrderBySql($q);
			$limit = parent::parseLimitSql($q);
			$sql = "select p.* ,IFNULL(b.h,0) as highLight from profession_type p left join ( 
						select count(*) as h , professionType from statement_bill $whereSql1 group by professionType
					) b on b.professionType = p.value $whereSql2 ";
			$row = $mysql->DBGetAsMap($sql.$orderBy.$limit,$params);
			$count = $mysql->DBGetAsOneArray("select count(*) from ( $sql ) as a",$params);
			$count = $count[0];
			return array('total'=>$count,'data'=>$row);
		}else{
			return parent::get($q);
		}
	}
}
?>