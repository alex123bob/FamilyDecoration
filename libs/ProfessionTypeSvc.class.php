<?php
class ProfessionTypeSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['id'] = $this->getUUID();
		return parent::add($qryParams);
	}
	public function get($q){
		/*
		不能for循环查sql,用下面单语句
		$res = parent::get($q);
		if(isset($q['projectId'])){
			$statementSvc = parent::getSvc('StatementBill');
			foreach ($res['data'] as $item)
				$item['hightLight'] = $statementSvc.getCount(array('projectId',$q['projectId'],$item['professionType']));
		}
		*/
		/*

		select p.* ,IFNULL(outer_b.hightLight,0) as hightLight
		from profession_type p 
		left join 
		( 
			select count(*) as hightLight , professionType from statement_bill b
			where b.`projectId` = '123' 
			and b.`isDeleted` = 'false'
			group by b.professionType
		) outer_b on outer_b.professionType = p.name where 1=1  and p.`isDeleted` = 'false';

		*/
		if(isset($q['projectId'])){
			global $mysql;
			$params = array();
			$whereSql1 = parent::parseWhereSql('b.','statement_bill',$q,$params);
			$whereSql2 = parent::parseWhereSql('p.','profession_type',$q,$params);
			$sql = "select p.* ,IFNULL(outer_b.hightLight,0) as hightLight
					from profession_type p 
					left join 
					( 
						select count(*) as hightLight , professionType from statement_bill b
						where 1=1 $whereSql1
						group by b.professionType
					) outer_b on outer_b.professionType = p.name where 1=1 $whereSql2 ";
			$orderBy = isset($qryParams['orderby']) && trim($qryParams['orderby']) != "" ? " order by  ".$q['orderby'] : "";
			$limit = isset($qryParams['limit']) && trim($qryParams['limit']) != "" ? " limit ".$q['limit'] : "";
			$row = $mysql->DBGetAsMap($sql.$orderBy.$limit,$params);
			$count = $mysql->DBGetAsOneArray("select count(*) from ( $sql ) as a",$params)[0];
			return array('total'=>$count,'data'=>$row);
		}else{
			return parent::get($q);
		}
	}
}
?>