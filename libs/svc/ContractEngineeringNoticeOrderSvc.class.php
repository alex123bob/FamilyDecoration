<?php
class ContractEngineeringNoticeOrderSvc extends BaseSvc
{

    public function add($q)
    {
        $q['@id'] = $this->getUUID();
        notNullCheck($q, '@contractId', '合同id不能为空!');
        notNullCheck($q, '@content', '联系单内容不能为空!');
        notNullCheck($q, '@title', '联系单标题不能为空!');
        notNullCheck($q, '@price', '联系金额不能为空!');
        if (!isset($q['@creator'])) {
            $q['@creator'] = $_SESSION['name'];
        }
        if (!isset($q['@creatorName'])) {
            $q['@creatorName'] = $_SESSION['realname'];
        }
        $res = parent::add($q);
        return $res;
    }
}
