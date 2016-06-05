<?php
class ProfessionTypeSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['@id'] = $this->getUUID();
		return parent::add($qryParams);
	}
	public function get($q){
		
		/*不能for循环查sql,用下面单语句
		$res = parent::get($q);
		if(isset($q['projectId'])){
			$statementSvc = BaseSvc::getSvc('StatementBill');
			foreach ($res['data'] as $item)
				$item['highLight'] = $statementSvc.getCount(array('projectId',$q['projectId'],$item['professionType']));
		}*/
		
		/*
		select p.* ,IFNULL(b.h,0) as highLight from profession_type p left join ( 
			select count(*) as h , professionType from statement_bill where `projectId` = '123' and `isDeleted` = 'false' group by professionType
		) b on b.professionType = p.name where 1=1  and p.`isDeleted` = 'false';
		*/
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