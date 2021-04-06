<?php
class ContractEngineeringChangelogSvc extends BaseSvc
{

    public function add($q)
    {
        $q['@id'] = $this->getUUID();
        notNullCheck($q, '@contractId', '合同id不能为空!');
        notNullCheck($q, '@changeContent', '变更内容不能为空!');
        if (!isset($q['@creator'])) {
            $q['@creator'] = $_SESSION['realname'];
        }
        if (!isset($q['@creatorName'])) {
            $q['@creatorName'] = $_SESSION['name'];
        }
        $res = parent::add($q);
        return $res;
    }
}
