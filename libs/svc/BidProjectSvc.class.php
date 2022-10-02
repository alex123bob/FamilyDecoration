<?php
class BidProjectSvc extends BaseSvc
{
	public function add($q){
        notNullCheck($q,'@name','投标名称不能为空!');
		$q['@id'] = $this->getUUID();
		return parent::add($q);
    }

	public function get($q){
		if (isset($q['regionId'])) {
			$this->appendWhere = " and bid_project.regionId = '".$q['regionId']."' ";
		}
		$this->appendSelect = ', b.status as billStatus, region.name as regionName';
		$this->appendJoin = " left join statement_bill b on bid_project.id = b.refId and b.billType = 'bidbond'  "
						  . " left join bid_project_region region on region.id = bid_project.regionId";

		global $downloadFields;
		$downloadFields = array(
			'编号'=>'id',
			'工程名称'=>'name',
			'开标时间'=>'startTime',
			'具体时间'=>'specificTime',
			'项目负责人要求'=>'requirement',
			'开标地点'=>'location',
			'保证金属性'=>'depositProperty',
			'代理机构'=>'agency',
			'bidA'=>'bidderA',
			'bidB'=>'bidderB',
			'预算造价'=>'budgetCost',
			'中标人'=>'perferredBidder',
			'标的价格'=>'bidPrice',
			'下浮率'=>'floatDownRate',
			'录入时间'=>'createTime',
			'最后更新时间'=>'updateTime',
			'标的状态'=>'billStatus',
			'区域'=>"regionName"
		);
		return parent::get($q);
	}
}
?>