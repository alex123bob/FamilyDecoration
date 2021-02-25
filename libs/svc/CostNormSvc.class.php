<?php
class CostNormSvc extends BaseSvc
{
    public function add($q)
    {
        notNullCheck($q, '@name', '名称不能为空!');
        $res = parent::get(array('name'=>$q['@name']));
        if($res['total'] > 0) {
            throw new Exception($q['@name'].'已经存在');
        }
        $q['@id'] = $this->getUUID();
        return parent::add($q);
    }
}
