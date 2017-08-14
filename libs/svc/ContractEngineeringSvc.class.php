<?php
class ContractEngineeringSvc extends BaseSvc
{	
	public function get($q){
		$this->appendSelect = ', b.customer, b.custContact ';
		$this->appendJoin = 'left join business b on b.id = contract_engineering.businessId ';
		$this->appendWhere .= " and ( b.isDeleted = 'false' or b.isDeleted is null)";
		$res = parent::get($q);
		foreach ($res['data'] as $key => &$value) {
			$this->transformStage($value);
			$this->transformAddtionals($value);
		}
		return $res;
	}

	private function transformAddtionals(&$item) {
		$item['additionals']  = isset($item['additionals']) ? explode('/**/', trim($item['additionals'],'/**/')) : array();
	}

	private function transformStage(&$item) {
		$stages = isset($item['stages']) ? explode('/**/', trim($item['stages'],'/**/')) : array();
		$s = array('一','二','三','四','五','六','七','八','九','十');
		$newArray = array();
		$i = 0;
		foreach ($stages as $k => $v) {
			$ex = explode(':', $v);
			array_push($newArray, array(
				'id'=> 'stage'.$i,
				'name'=>'第'.$s[$i].'期',
				'time'=>$ex[0],
				'amount'=>$ex[1]
			));
			++ $i;
		}
		$item['stages'] = $newArray;
	}

	public function add($q){
		$q['@id'] = $this->getUUID();
		notNullCheck($q,'@accountId','账户编号不能为空!');
		notNullCheck($q,'@type','类型不能为空!');
		notNullCheck($q,'@amount','金额不能为空!');
		notNullCheck($q,'@balance','余额不能为空!');
		notNullCheck($q,'@refId','关联单据编号不能为空!');
		notNullCheck($q,'@refType','关联单据类型不能为空!');
		$q['@operator'] = $_SESSION['name'];
		return parent::add($q);
	}

	public function update($q){
		return parent::update(array('id'=>$q['id'],'@refId'=>$q['@refId']));
	}
}

?>E