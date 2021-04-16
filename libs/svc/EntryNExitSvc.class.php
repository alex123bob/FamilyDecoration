<?php

class EntryNExitSvc{
  
  //loan:贷款入账(loan表),financialFee:财务费用(贷款还账,loan表),staffSalary:员工工资(salary表)
  //其他都是statement_bill 表
  public function get($q){
    switch($q['type']){
      case 'companyBonus': return $this->companyBonus($q);
      case 'qualityGuaranteeDeposit': return $this->qualityGuaranteeDeposit($q);
      case 'workerSalary': return $this->workerSalary($q);
      case 'staffSalary': return $this->staffSalary($q);
      case 'materialPayment': return $this->materialPayment($q);
      case 'reimbursementItems': return $this->reimbursementItems($q);
      case 'tax': return $this->tax($q);
      case 'designDeposit': return $this->designDeposit($q);
      case 'projectFee': return $this->projectFee($q);
      case 'loan': return $this->loan($q);  //贷款入账
      case 'financialFee': return $this->financialFee($q); //贷款出账
      case 'depositOut': return $this->depositInAndOut($q, false); //投标保证金和履约保证金出账
      case 'depositIn': return $this->depositInAndOut($q, true); //投标保证金和履约保证金入账
      case 'other': return $this->other($q);
      default:throw new Exception("unknown type:  ".$q['type']);
    }
  }

  private function depositInAndOut($q, $isIn){
    $svc = BaseSvc::getSvc('StatementBill');
    $svc->appendWhere .= $isIn ? " and ( billType = 'bidbondBk' or billType = 'pmbondBk' )" : " and ( billType = 'bidbond' or billType = 'pmbond' )";
    $res = $svc->get($q);
    $newData = array();
    foreach($res['data'] as $value){
      array_push($newData, array(
        'c0'=> $value['id'],
        'c1'=> $value['projectName'],
        'c2'=> $value['accountName'].' '.$value['bank'].'('.$value['accountNumber'].')',
        'c3'=> $value['creatorRealName'],
        'c4'=> $value['paidTime'],
        'c5'=> $value['payee'],
        'c6'=> $value['phoneNumber'],
        'status'=> $value['status'],
      ));
    }
    $res['data'] = $newData;
    return $res;
  }

  public function getpayheader($q){
    global $mysql;
    $res = array();
    switch($q['type']){
      case 'depositOut':
      case 'depositIn':
        $svc = BaseSvc::getSvc('StatementBill');
        $svc->appendWhere .= $q['type'] == 'depositIn' ? " and ( billType = 'bidbondBk' or billType = 'pmbondBk' )" : " and ( billType = 'bidbond' or billType = 'pmbond' )";
        $qry = $svc->get($q);
        array_push($res, array('k'=>'工程名称','v'=>$qry['data'][0]['projectName']));
        array_push($res, array('k'=>'申请人','v'=>$qry['data'][0]['creatorRealName']));
        array_push($res, array('k'=>'领款人','v'=>$qry['data'][0]['accountName'].' '.$qry['data'][0]['bank'].'('.$qry['data'][0]['accountNumber'].')'));
        array_push($res, array('k'=>'付款时间','v'=>$qry['data'][0]['paidTime']));
        array_push($res, array('k'=>'联系人','v'=> $qry['data'][0]['payee']));
        array_push($res, array('k'=>'联系方式','v'=>$qry['data'][0]['phoneNumber']));
        return $res;
      case 'financialFee': return $this->financialFee($q); //贷款出账
      case 'companyBonus': 
        $sql = "select u.realName,u.phone,b.claimAmount,b.reimbursementReason,b.projectName from statement_bill b left join user u on u.name = b.payee where b.id = '?' ";
        $qry = $mysql->DBGetAsOneArray($sql,$q['id']);
        array_push($res, array('k'=>'款项名称','v'=>$qry[4]));
        array_push($res, array('k'=>'申请人','v'=>$qry[0]));
        array_push($res, array('k'=>'联系方式','v'=>$qry[1]));
        array_push($res, array('k'=>'报销金额','v'=>$qry[2].'元'));
        array_push($res, array('k'=>'报销项目','v'=>$qry[3]));
        return $res;
      case 'qualityGuaranteeDeposit':
      case 'workerSalary': 
        $qry = BaseSvc::getSvc('StatementBill')->get($q);
        array_push($res, array('k'=>'姓名','v'=>$qry['data'][0]['payee']));
        array_push($res, array('k'=>'款项名称','v'=>$qry['data'][0]['billName']));
        array_push($res, array('k'=>'核算工资','v'=>$qry['data'][0]['totalFee'].'元'));
        array_push($res, array('k'=>'联系方式','v'=>$qry['data'][0]['phoneNumber']));
        array_push($res, array('k'=>'工程名称','v'=>$qry['data'][0]['projectName']));
        array_push($res, array('k'=>'申领工资','v'=>$qry['data'][0]['claimAmount'].'元'));
        return $res;
      case 'materialPayment': 
        $sql = "select s.name,u.name,b.phoneNumber,p.projectName,b.billName,b.totalFee,b.claimAmount "
           . "from statement_bill b left join supplier s on b.supplierId = s.id left join user u on u.name = b.payee "
           . " left join project p on p.projectId = b.projectId "
           ."where b.id = '?' ";
        $qry = $mysql->DBGetAsOneArray($sql,$q['id']);
        array_push($res, array('k'=>'供应商','v'=>$qry[0]));
        array_push($res, array('k'=>'领款人','v'=>$qry[1]));
        array_push($res, array('k'=>'联系方式','v'=>$qry[2]));
        array_push($res, array('k'=>'工程名称','v'=>$qry[3]));
        array_push($res, array('k'=>'款项名称','v'=>$qry[4]));
        array_push($res, array('k'=>'核算金额','v'=>$qry[5].'元'));
        array_push($res, array('k'=>'申领金额','v'=>$qry[6].'元'));
        return $res;
      case 'reimbursementItems': 
        $sql = "select u.realName,u.phone,b.claimAmount,b.reimbursementReason from statement_bill b left join user u on u.name = b.payee where b.id = '?' ";
        $qry = $mysql->DBGetAsOneArray($sql,$q['id']);
        array_push($res, array('k'=>'报销人','v'=>$qry[0]));
        array_push($res, array('k'=>'联系方式','v'=>$qry[1]));
        array_push($res, array('k'=>'报销金额','v'=>$qry[2].'元'));
        array_push($res, array('k'=>'报销项目','v'=>$qry[3]));
        return $res;
      case 'tax': 
      case 'staffSalary': 
        $qry = BaseSvc::getSvc('StatementBill')->get($q);
        BaseSvc::getSvc('User')->appendRealName($qry['data'],'payee');
        array_push($res, array('k'=>'领款人','v'=>$qry['data'][0]['payeeRealName']));
        array_push($res, array('k'=>'款项名称','v'=>$qry['data'][0]['projectName']));
        array_push($res, array('k'=>'核算工资','v'=>$qry['data'][0]['claimAmount'].'元'));
        return $res;
      default:throw new Exception("unknown type:  ".$q['type']);
    }
    return $res;
  }

  private function parseData($sql,$q){
    global $mysql;
    if(isset($q['startTime']) && $q['startTime'] != '') {
      $sql .= ' and b.createTime >= "'.$q['startTime'].'"'; 
    }
    if(isset($q['endTime']) && $q['endTime'] != '') {
      $sql .= ' and b.createTime <= "'.$q['endTime'].'"'; 
    }
    $count = $mysql->DBGetAsOneArray("select count(1) as cnt from ( $sql ) as temp limit 0,1 ")[0];
    $thisSql = $sql;
    //sort:[{"property":"c0","direction":"ASC"}]
    if(isset($q['sort'])){
      $s = json_decode($q['sort']);
      if(count($s)>0)
        $thisSql .= ' order by '.$s[0]->property.' '.$s[0]->direction;
    }
    $thisSql = $thisSql.BaseSvc::parseLimitSql($q);
    $data = $mysql->DBGetAsMap($thisSql);
    $res = array('status'=>'successful','data'=>$data,'total'=>$count);
    return $res;
  }

  
  private function companyBonus($q){
    global $mysql;
    $sql = "select b.id as c0, ".
          " b.projectName as c1, ".
          " b.reimbursementReason as c2, ".
          " u2.realName as c3, ".
          " u2.phone as c4, ".
          " b.claimAmount as c5, ".
          " b.paidAmount as c6, ".
          " u.realName as c7, ".
          " b.paidTime as c8, ".
          " b.descpt as c9, ".
          " b.status  ".
          " from statement_bill b left join user u on u.name = b.payer left join user u2 on u2.name = b.payee ".
          " where b.billType = 'wlf' and b.isDeleted = 'false' and ( b.status = 'paid' or b.status = 'chk')";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and (b.payee like \'%'.$q['payee'].'%\' or u2.realName like \'%'.$q['payee'].'%\' or b.projectName like \'%'.$q['payee'].'%\')';
    }
    return $this->parseData($sql,$q);
  }

  private function tax($q){
    global $mysql;
    $sql = "select b.id as c0, ".
          " b.projectName as c1, ".
          " b.reimbursementReason as c2, ".
          " u2.realName as c3, ".
          " u2.realName as c4, ".
          " u2.phone as c5, ".
          " b.totalFee as c6, ".
          " b.paidAmount as c7, ".
          " u.realName as c8, ".
          " b.paidTime as c9, ".
          " b.descpt as c10, ".
          " b.status ".
          " from statement_bill b left join user u on u.name = b.payer left join user u2 on u2.name = b.payee ".
          " where b.billType = 'tax' and b.isDeleted = 'false' and ( b.status = 'paid' or b.status = 'chk')";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and (b.payee like \'%'.$q['payee'].'%\' or b.projectName like \'%'.$q['payee'].'%\' or u2.realName like \'%'.$q['payee'].'%\' )';
    }
    return $this->parseData($sql,$q);
  }

  private function qualityGuaranteeDeposit($q){
    global $mysql;
    $sql = "SELECT  b.id as c0, ".
            "b.projectName as c1, ".
            "b.payee as c2, ".
            "b.phoneNumber as c3, ".
            "b.totalFee as c4, ".
            "b.paidAmount as c5, ".
            "b.paidTime as c6, ".
            "u.realName as c7, ".
            "b.descpt as c8, ".
            "b.status  ".
        "FROM statement_bill b left join user u on u.name = b.payer WHERE b.isDeleted = 'false' AND b.billType = 'qgd' and (status = 'paid' or status = 'chk') ";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and b.payee like \'%'.$q['payee'].'%\'';
    }
    $res = $this->parseData($sql,$q);
    return $res;
  }

  private function workerSalary($q){
    global $mysql;
    $sql = "select b.id as c0, ".
          "payee as c1, ".
          "phoneNumber as c2, ".
          "projectName as c3, ".
          "t.cname as c4, ".
          "totalFee as c5, ".
          "claimAmount as c6, ".
          "paidAmount as c7, ".
          "totalFee-paidAmount as c8, ".
          "'' as c9, ".
          "paidTime as c10, ".
          "b.status, ".
          "u.realName as c11 from statement_bill b left join profession_type t on b.professionType = t.value left join user u on u.name = b.payer ". 
          "where b.isDeleted = 'false' and (b.billType = 'reg' or b.billType = 'ppd') ";
    $appendStatus = " and ( b.status = 'paid' or b.status = 'chk')";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
      $appendStatus = '';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and b.payee like \'%'.$q['payee'].'%\'';
      $appendStatus = '';
    }
    $sql .= $appendStatus;
    if(!isset($q['sort']))
      $q['sort'] = '[{"property":"status","direction":"asc"}]';
    $res = $this->parseData($sql,$q);
    foreach ($res['data'] as &$item) {
      $item['c8'] = round($item['c8'],2);
    }
    return $res;
  }

  private function staffSalary($q){
    global $mysql;
    $sql = "select b.id as c0, ".
          "s.staffLevel as c1, ".
          "u.realName as c2, ".
          "s.basicSalary as c3, ".
          "s.basicSalary as c4, ".
          "s.commission as c5, ".
          "(s.insurance + s.housingFund + s.incomeTax + s.others) as c6, ".
          "s.actualPaid as c7, ".
          "b.paidAmount as c8, ".
          "'' as c9, ".
          "b.paidTime as c10, ".
          "u1.realName as c11, ".
          "b.status ".
          "from statement_bill b left join staff_salary s on b.staffSalaryId = s.id left join user u on u.name = b.payee left join user u1 on b.payer = u1.name where b.isDeleted = 'false' and b.billType='stfs' and ( b.status = 'paid' or b.status = 'chk')";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and u.realName like \'%'.$q['payee'].'%\'';
    }
    $res = $this->parseData($sql,$q);
    $userSvc = BaseSvc::getSvc('User');
    foreach ($res['data'] as &$item) {
      $item['c1'] = $userSvc->getDepartementByLevel($item['c1']);
    }
    return $res;
  }

  private function materialPayment($q){
    global $mysql;
    $sql = "select b.id as c0, ".
          "s.name as c1, ".
          "b.projectName as c2, ".
          "s.phone as c3, ".
          "b.payee as c4, ".
          "b.reimbursementReason as c5, ".
          "b.totalFee as c6, ".
          "b.claimAmount as c7, ".
          "b.paidAmount as c8, ".
          "b.claimAmount-b.paidAmount as c9, ".
          "'' as c10, ".
          "b.paidTime as c11,".
          "u.realName as c12, ".
          "b.status ".
          "from statement_bill b left join supplier s on b.supplierId = s.id ".
          "left join user u on u.name = b.payer ".
          "where b.billType = 'mtf' and b.isDeleted = 'false' and ( b.status = 'paid' or b.status = 'chk') and u.isDeleted = 'false' ";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and ( b.payee like \'%'.$q['payee'].'%\' or s.name like \'%'.$q['payee'].'%\')';
    }
    return $this->parseData($sql,$q);
  }

  private function reimbursementItems($q){
    global $mysql;
    $sql = "select b.id as c0, ".
          "u2.realName as c1, ".
          "b.projectName as c2, ".
          "u2.phone as c3, ".
          "b.claimAmount as c4, ".
          "b.paidAmount as c5, ".
          "'' as c6, ".
          "b.paidTime as c7, ".
          "u.realName as c8, ".
          "b.reimbursementReason as c9, ".
          "b.status ".
          "from statement_bill b left join user u on u.name = b.payer left join user u2 on u2.name = b.payee  ".
          "where b.billType = 'rbm' and b.isDeleted = 'false' ";
    $appendStatus = " and ( b.status = 'paid' or b.status = 'chk')";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
      $appendStatus = '';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and (b.payee like \'%'.$q['payee'].'%\' or u2.realName like \'%'.$q['payee'].'%\') ';
      $appendStatus = '';
    }
    if(isset($q['status']) && $q['status'] != ""){
      $appendStatus = " and b.status = '".$q['status']."'";
    }

    $sql .=  $appendStatus;
    return $this->parseData($sql,$q);
  }
  //贷款出账
  private function financialFee($q){
    global $mysql;
    $sql = "select l.id as c0, ".
          "l.id as c1, ".
          "l2.projectName as c2, ".
          "l.bankName as c3, ".
          "u.realName as c4, ".
          "l.interest as c5, ".
          "l.projectName as c6, ".
          "l.amount as c7, ".
          "u2.realName as c8, ".
          "l.createTime as c9, ".
          "l.status ".
          "from loan l " .
          "left join user u on u.name = l.assignee ".
          "left join user u2 on u2.name = l.dealer ".
          "left join loan l2 on l2.id = l.relevantId ".
          "where l.isDeleted = 'false' and l.type = '1' and l.status != 'arch'";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and l.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and u.realName like \'%'.$q['payee'].'%\'';
    }
    return $this->parseData($sql,$q);
  }
  //贷款入账
  private function loan($q){
    global $mysql;
    $sql = "select l.id as c0, ".
          "l.projectName as c1, ".
          "l.bankName as c2, ".
          "u.realName as c3, ".
          "u.phone as c4, ".
          "l.amount as c5, ".
          "u2.realName as c6, ".
          "l.createTime as c7, ".
          "l.interest as c8, ".
          "l.period as c9, ".
          "l.loanTime as c10, ".
          "l.status ".
          "from loan l left join user u on u.name = l.assignee left join user u2 on u2.name = l.dealer ".
          "where l.isDeleted = 'false' and l.type = '0' and l.status != 'arch'";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and l.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and u.realName like \'%'.$q['payee'].'%\'';
    }
    return $this->parseData($sql,$q);
  }
  //设计定金入账
  private function designDeposit($q){
    global $mysql;
    $sql = "select b.id as c0, ".
          "p.projectName as c2, ".
          "CONCAT(r.name,' ',bs.address) as c1, ".
          "bs.salesman as c3, ".
          "bs.designer as c4, ".
          "bs.customer as c5, ".
          "bs.custContact as c6, ".
          "b.paidAmount as c7, ".
          "u.realName as c8, ".
          "b.status ".
          "from statement_bill b ".
          " left join user u on u.name = b.payer ".
          " left join business bs on bs.id = b.businessId ".
          " left join project p on p.businessId = bs.id ".
          " left join region r on r.id = bs.regionId ".
          "where b.billType = 'dsdpst' and b.isDeleted = 'false' and  b.status = 'accepted'";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and b.payee like \'%'.$q['payee'].'%\'';
    }
    return $this->parseData($sql,$q);
  }
  //其他入账
  private function other($q){
    global $mysql;
    $sql = "select b.id as c0, ".
          "b.projectName as c1, ".
          "b.reimbursementReason as c2, ".
          "u2.realName as c3, ".
          "u2.phone as c4, ".
          "b.paidAmount as c5, ".
          "u.realName as c6, ".
          "b.paidTime as c7, ".
          "b.descpt as c8, ".
          "b.status ".
          "from statement_bill b left join user u on u.name = b.payer left join user u2 on u2.name = b.payee ".
          "where b.billType = 'other' and b.isDeleted = 'false' and b.status = 'accepted'";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and b.payee like \'%'.$q['payee'].'%\'';
    }
    return $this->parseData($sql,$q);
  }
  //工程款入账
  private function projectFee($q){
    global $mysql;
    $sql = "select b.id as c0, ".
          "p.projectName as c1, ".
          "p.captain as c2, ".
          "p.designer as c3, ".
          "bs.customer as c4, ".
          "bs.custContact as c5, ".
          "b.paidAmount as c8, ".
          "b.paidTime as c10, ".
          "b.reimbursementReason as c9, ".
          "b.status, ".
          "p.projectId ".
          "from statement_bill b ".
          " left join user u on u.name = b.payer ".
          " left join project p on p.projectId = b.projectId ".
          " left join business bs on bs.id = p.businessId ".
          "where b.billType = 'pjtf' and b.isDeleted = 'false' and b.status = 'accepted'";
    if(isset($q['c0']) && $q['c0'] != ""){
      $sql .= ' and b.id like \'%'.$q['c0'].'%\'';
    }
    if(isset($q['payee']) && $q['payee'] != ""){
      $sql .= ' and b.payee like \'%'.$q['payee'].'%\'';
    }
    $res = $this->parseData($sql,$q);
    $projectIds = array();
    foreach ($res['data'] as $key => $value) {
      if($value['projectId'] != null && $value['projectId'] != "" )
        array_push($projectIds, $value['projectId']);
    }
    $projectIds = join(",", $projectIds);
    if($projectIds == null || $projectIds == ""){
      return $res;
    }
    $sql = "select projectId,sum(totalFee) as totalFee from budget where  status != 1 and isDeleted = 'false' and projectId in ( $projectIds ) group by projectId ";
    $data = $projectTotalFee = $mysql->DBGetAsMap($sql);
    $projectIdBugetFeeMap = array();
    foreach ($data as $key => $value) {
      $projectIdBugetFeeMap[$value['projectId']] = $value['totalFee'];
    }
    foreach ($res['data'] as $key => &$value) {
      if($value['projectId'] == null || $value['projectId'] == "" )
        continue;
      if(!isset($projectIdBugetFeeMap[$value['projectId']])){
        $value['c7'] = '';
        $value['c6'] = '无预算';
        continue;
      }
      $totalFee = round($projectIdBugetFeeMap[$value['projectId']],2);
      $value['c6'] = $totalFee;
      $percentage = 1;
      switch ($value['c9']) {
        case '首期':$percentage = 0.2;break;
        case '二期':$percentage = 0.3;break;
        case '三期':$percentage = 0.3;break;
        case '尾期':$percentage = 0.2;break;
      }
      $value['c7'] = round($totalFee*$percentage,2)." ( ".($percentage*100)."%)";
      unset($value['projectId']);
    }
    return $res;
  }
}

?>