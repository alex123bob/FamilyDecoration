<?php
class CostRefNormItemSvc extends BaseSvc
{
    public function add($q)
    {
        notNullCheck($q, '@norm_id', '成本定额id不能为空!');
        notNullCheck($q, '@item_id', '清单项目id不能为空!');
        notNullCheck($q, '@version', '清单项目version不能为空!');
        return parent::add($q);
    }
}
