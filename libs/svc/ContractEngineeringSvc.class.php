<?php
class ContractEngineeringSvc extends BaseSvc
{ 
  public function get($q){
    $this->appendSelect = ', left(p.period,10) as startTime,right(p.period,10) as endTime, TIMESTAMPDIFF(DAY,left(p.period,10),right(p.period,10)) as totalDays, b.customer, b.custContact, p.projectId, p.period, p.projectName, p.designer, p.designerName,
    p.captain, p.captainName , p.salesman, p.salesmanName, u.phone as captainPhone ';
    $this->appendJoin = 'left join business b on b.id = contract_engineering.businessId and ( b.isDeleted = \'false\' or b.isDeleted is null )'
                      . 'left join project p on p.businessId = b.id and ( p.isDeleted = \'false\' or p.isDeleted is null )'
                      . 'left join user u on p.captainName = u.name and ( u.isDeleted = \'false\' or u.isDeleted is null )';
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
    $additionals  = isset($item['additionals']) ? explode('/**/', trim($item['additionals'],'/**/')) : array();
    $item['additionals'] = array();
    foreach ($additionals as $k => $v) {
      $ex = explode(':', $v);
      array_push($item['additionals'], array(
        'content'=> $ex[0],
        'type'=>count($ex) == 1 ? 'default' : $ex[1]
      ));
    }
    ;
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
    $businessSvc = BaseSvc::getSvc('Business');
    $res = $projectSvc->get(array('businessId' => $q['@businessId']));
    global $mysql;
    $mysql->begin();
    $projectId = '';
    if($res['total'] == 0){
      //没有project,新建.
      require_once "businessDB.php";
      $res = transferBusinessToProject(array(
        'businessId' => $q['@businessId'],
        'customer' => $q['@customer'],
        'custContact' => $q['@custContact'],
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
      $businessSvc->update(array(
        'id' => $q['@businessId'],
        '@isTransfered' => 'true'
      ));
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

  function addAddtional($q) {
    global $mysql;
    $mysql->begin();
    $projectSvc = BaseSvc::getSvc('Project');
    switch ($q['@type']) {
      case 'default':
        // do nothing;
        break;
      case 'gongqi':
        $projectSvc->update(array(
          'projectId' => $q['projectId'],
          '@period' => $q['@beginTime'].':'.$q['@endTime']
        ));
        break;
      case 'captain':
        $projectSvc->update(array(
          'projectId' => $q['projectId'],
          '@captain' => $q['@captain'],
          '@captainName' => $q['@captainName']
        ));
        break;
      case 'designer':
        $projectSvc->update(array(
          'projectId' => $q['projectId'],
          '@designer' => $q['@designer'],
          '@disignerName' => $q['@disignerName']
        ));
        break;
      default:
        throw new BaseException("unknow @type:", $q['@type']);
    }
    $sql = "update contract_engineering set additionals = concat(additionals, '/**/','".$q['@additional'].":".$q['@type']."') where id = '".$q['id']."'";
    $res = $mysql->DBExecute($sql);
    $mysql->commit();
    return $res;
  }

  function deleteAddtional($q) {
    global $mysql;
    $mysql->begin();
    $res = parent::get(array('id'=>$q['id']));
    if($res['total'] != 1) {
      throw new BaseException("没有对应id的合同.", $q['id']);
    }
    $contract = $res['data'][0];
    $additionals = explode('/**/', $contract['additionals']);
    if(count($additionals) < $q['index'] ||  $q['index'] < 0 ){
      throw new BaseException("没有第".$q['index']."条附加条款.");
    }
    $additional = $additionals[$q['index']];
    $tmp = explode(':', $additional);
    if(count($tmp) == 2 && $tmp[1] != 'default') {
      throw new BaseException("非普通附加条款,不允许删除!".$tmp[1]);
    }
    if($tmp[0] != $q['addtional']) {
      throw new BaseException("请勿重复提交!");
    }
    unset($additionals[$q['index']]);
    $sql = "update contract_engineering set additionals = '".join($additionals,'/**/')."' where id = '".$q['id']."'";
    $res = $mysql->DBExecute($sql);
    $mysql->commit();
    return $res;
  }
}

?>