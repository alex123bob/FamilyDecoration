<?php
class BidProjectSvc extends BaseSvc
{
	public function add($q){
        notNullCheck($q,'@name','投标名称不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
    }

	public function get($q){
		// $this->appendSelect = ', b.*';
		// $this->appendJoin = ' left join StatementBill b on bid_project.id = b.refId';
		// return $this->get($q);

		$res = parent::get($q);
		foreach ($res['data'] as $key => &$obj) {
			$bill = parent::getSvc('StatementBill')->get(array('refId'=>$obj['id'])); // involve corresponding bill item, need display bill status in front-end grid.
			if ($bill['total'] > 0) {
				$obj['statementBill'] = $bill['data'][0];
			}
		}
		return $res;
	}
}
?>