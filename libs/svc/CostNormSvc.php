<?php
class CostNormSvc extends BaseSvc
{
    public function add($q)
    {
        notNullCheck($q, '@name', '名称不能为空!');
        $q['@id'] = $this->getUUID();
        return parent::add($q);
    }
}
