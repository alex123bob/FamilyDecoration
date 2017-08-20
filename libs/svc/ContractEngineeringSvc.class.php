<?php
class ContractEngineeringSvc extends BaseSvc
{ 
  public function get($q){
    $this->appendSelect = ', b.customer, b.custContact, p.projectId, p.period, p.projectName, p.designer, p.designerName,
    p.captain, p.captainName , p.salesman, p.salesmanName ';
    $this->appendJoin = 'left join business b on b.id = contract_engineering.businessId and ( b.isDeleted = \'false\' or b.isDeleted is null )'
                      . 'left join project p on p.businessId = b.id and ( p.isDeleted = \'false\' or p.isDeleted is null )';
    if(isset($q['projectId'])){
      $this->appendWhere .= " and p.projectId = '".$q['projectId']."' ";
    }
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
    notNullCheck($q,'@businessId','业务ID不能为空!');
    notNullCheck($q,'@totalPrice','合同总价不能为空!');
    notNullCheck($q,'@sid','身份证号不能为空!');
    notNullCheck($q,'@address','装修地址不能为空!');
    notNullCheck($q,'@stages','合同期不能为空!');
    $res = $this->getCount(array('businessId' => $q['@businessId']));
    if($res['count'] > 0){
      throw new BaseException('该业务已有合同!');
    }
    $projectSvc = BaseSvc::getSvc('Project');
    $res = $projectSvc->get(array('businessId' => $q['@businessId']));
    global $mysql;
    $mysql->begin();
    $projectId = '';
    if($res['total'] == 0){
      //没有project,新建.
      require_once "businessDB.php";
      $res = transferBusinessToProject(array(
        'businessId' => $q['@businessId'],
        'period' => $q["@startTime"].":".$q["@endTime"],
        'projectTime' => date("Y-m-d"),
        'projectName' => $q['@businessName'],
        'designer' => $q['@designer'],
        'designerName' => $q['@designerName'],
        'captain' => $q['@captain'],
        'captainName' => $q['@captainName'],
        'salesman' => $q['@salesman'],
        'salesmanName' => $q['@salesmanName'],
        'isWaiting' => 'false',
        'isLocked' => 'false'
      ));
      $projectId = $res['projectId'];
    } else if($res['total'] == 1){
      $projectSvc->update(array(
        'businessId' => $q['@businessId'],
        '@period' => $q["@startTime"].":".$q["@endTime"],
        '@projectName' => $q['@businessName'],
        '@designer' => $q['@designer'],
        '@designerName' => $q['@designerName'],
        '@captain' => $q['@captain'],
        '@captainName' => $q['@captainName'],
        '@salesman' => $q['@salesman'],
        '@salesmanName' => $q['@salesmanName']
      ));
      $projectId = $res['data'][0]['projectId'];
    } else {
      throw new BaseException('该业务有多个有效工程,请联系管理员!');
    }
    $res = parent::add($q);
    $res['data']['projectId'] = $projectId;
    $res['data']['captainName'] = $q['@captainName'];
    $res['data']['captain'] = $q['@captain'];
    $mysql->commit();
    return $res;
  }
}

?>