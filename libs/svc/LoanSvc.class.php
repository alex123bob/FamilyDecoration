<?php
class LoanSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['@id'] = $this->getUUID();
		return parent::add($qryParams);
	}

	public function update($q){
		$id = $q['id'];
		if($q['@status'] == 'paid'){
			if(!isset($q['@dealer']))
				$q['@dealer'] = $_SESSION['name'];
			if(!isset($q['@dealTime']))
				$q['@dealTime'] = 'now()';
			notNullCheck($q,'@amount','付款金额不能为空!');
			if((int)$q['@amount'] <= 0)
				throw new Exception("付款金额错误！".$q['@amount']);
		}
		$this->appendWhere = ' and status != \'arch\'';
		$res = parent::update($q);
		if($res['affect'] == 0)
			throw new Exception("更新失败，请查看编号$id是否存在，或已被归档！");
		return $res;
	}
}

?>