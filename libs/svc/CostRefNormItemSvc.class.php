<?php
class CostRefNormItemSvc extends BaseSvc
{
    public function add($q)
    {
        notNullCheck($q, '@normId', '成本定额id不能为空!');
        notNullCheck($q, '@itemId', '清单项目id不能为空!');
        notNullCheck($q, '@version', '清单项目version不能为空!');

        $costItem = parent::getSvc('CostListItem')->parentGet(array('id' => $q['@itemId'], 'version' => $q['@version']));
        if ($costItem['total'] == 0) {
            throw new Exception('找不到id为：' . $q['@itemId'] . ', 版本号为：' . $q['@version'] . '的项目清单');
        }
        $costNorm = parent::getSvc('CostNorm')->get(array('id' => $q['@normId']));
        if ($costNorm['total'] == 0) {
            throw new Exception('找不到id为：' . $q['@normId'] . '的成本定额');
        }
        return parent::add($q);
    }

    public function bulkAdd($q)
    {
        notNullCheck($q, '@normIds', '成本定额ids不能为空!');
        notNullCheck($q, '@itemIds', '清单项目ids不能为空!');
        notNullCheck($q, '@versions', '清单项目versions不能为空!');
        $normIds = explode(',', $q['@normIds']);
        $itemIds = explode(',', $q['@itemIds']);
        $versions = explode(',', $q['@versions']);
        if (count($normIds) != count($itemIds) || count($normIds) != count($versions)) {
            throw new Exception('normIds or itemIds or versions size not match.' . count($normIds) . ' ' . count($itemIds) . ' ' . count($versions));
        }
        $res = array('data' => array());
        global $mysql;
        $mysql->begin();
        foreach ($normIds as $k =>  $normId) {
            $added = $this->add(array('@normId' =>  $normId, '@itemId' =>  $itemIds[$k], '@version' =>  $versions[$k]));
            array_push($res['data'],  $added['data']);
        }
        $mysql->commit();
        $res['total'] = count($res['data']);
        $res["status"] = "successful";
        return $res;
    }

    public function get($q)
    {
        $this->appendSelect = ', b.* ';
        $this->appendJoin = 'left join cost_list_item b on b.id = ' . $this->tableName . '.itemId and b.version = ' . $this->tableName . '.version and ( b.isDeleted = \'false\' or b.isDeleted is null )';
        $res1 = parent::get($q);

        $this->appendSelect = ', p.* ';
        $this->appendJoin = 'left join cost_norm p on p.id = ' . $this->tableName . '.normId and ( p.isDeleted = \'false\' or p.isDeleted is null )';
        $res2 = parent::get($q);

        $res = array();
        foreach ($res1['data'] as $v) {
            $key = $v['normId'] . '-' . $v['itemId'] . '-' . $v['version'];
            $res[$key] = array('normId' => $v['normId'], 'itemId' => $v['itemId'], 'version' => $v['version']);
            unset($v['normId']);
            unset($v['itemId']);
            unset($v['version']);
            $res[$key]['item'] = $v;
        }
        foreach ($res2['data'] as $v) {
            $key = $v['normId'] . '-' . $v['itemId'] . '-' . $v['version'];
            unset($v['normId']);
            unset($v['itemId']);
            unset($v['version']);
            $res[$key]['norm'] = $v;
        }
        return array('total' => $res1['total'], 'data' => array_values($res), "status" => "successful");
    }
}
