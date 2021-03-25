<html>
<body style="margin: 50px;">
<?php
  function getId($tableName, $qry, $returnFieldName){
    $res = BaseSvc::getSvc($tableName)->get($qry);
    global $allSuccess;
    if($res['total'] == 1){
      return $res['data'][0][$returnFieldName];
    }else if($res['total'] > 1){
      $allSuccess = false;
      return "<font style='color:red'>多个match</font>";
    }else{
      $allSuccess = false;
      return "<font style='color:red'>找不到</font>";
    }
  }

  function parseContent($PHPExcel, $filename) {
    $workTypeMap = array(
      '贴砖泥工'=>'0001',
      '木工'=>'0002',
      '油漆工'=>'0003',
      '水电工'=>'0004',
      '力工'=>'0005',
      '其他'=>'0009',
      '基础泥工'=>'0006');

    global $allSuccess, $mysql;
    $allSuccess = true;
    $objWorksheet = $PHPExcel->getActiveSheet();
    $highestRow = $objWorksheet->getHighestRow(); // 取得总行数
    $contents = array();
    $supplierName = $objWorksheet->getCell('A2')->getValue();
    $projectName = $objWorksheet->getCell('B2')->getValue();
    $times = $objWorksheet->getCell('C2')->getValue();
    $percentage = $objWorksheet->getCell('D2')->getValue() * 100;
    $creator = $objWorksheet->getCell('E2')->getValue();
    $time = $objWorksheet->getCell('F2')->getValue();
    $time = ($time - 25569) * 86400;
    $time = gmdate("Y-m-d H:i:s", $time);

    $supplierId = getId('Supplier', array('name' =>$supplierName), 'id');
    $projectId = getId('Project', array('projectName' =>$projectName), 'projectId');
    $creatorId = getId('User', array('realname' =>$creator), 'name');
    $projectSvc = BaseSvc::getSvc('Project');

    $mysql->begin();
    $supplierOrderSvc = BaseSvc::getSvc('SupplierOrder');

    $res = $supplierOrderSvc->get(array(
      'projectId' => $projectId,
      'supplierId' => $supplierId,
      'creator' => $creatorId,
      'payedTimes' => $times,
      'projectProgress' => $percentage,
      'status' => 'arch',
      'projectName' => $projectName
    ));

    if($res['total'] != 0){
      echo "<font style='color:red'>已存在 订购商：$supplierName $projectName 第$times 次申购 完成情况 $percentage% 申请人 $creator 的订购单。 请勿重复导入。</font><br /><br />";
      $allSuccess = false;
    }

    $uuid = $filename;

    $res = $allSuccess ? $supplierOrderSvc->add(array(
      '@projectId' => $projectId,
      '@supplierId' => $supplierId,
      '@creator' => $creatorId,
      '@payedTimes' => $times,
      '@projectProgress' => $percentage,
      '@status' => 'arch',
      '@projectName' => $projectName,
      '@desc' => '批量导入'.$uuid,
      '@createTime' => $time
    )) : array('data'=>array('id' => -1));

    $supplierOrderId = $res['data']['id'];
    $totalFee = 0;
    for ($row = 5; $row <= $highestRow; $row++) {
      $obj = array();
      //---name
      $name = $objWorksheet->getCell('A'.$row)->getValue();
      array_push($obj, $name);
      
      //---amount
      $amount = $objWorksheet->getCell('B'.$row)->getValue();
      if(!is_numeric($amount)){
        $allSuccess = false;
        array_push($obj, "<font style='color:red'>数量不对：".$amount.'</font>');
      }else{
        array_push($obj, $amount);
      }

      //---unit
      $unit = $objWorksheet->getCell('C'.$row)->getValue();
      array_push($obj, $unit);

      //---price
      $price = $objWorksheet->getCell('D'.$row)->getValue();
      if(!is_numeric($price)){
        $allSuccess = false;
        array_push($obj, "<font style='color:red'>价格不对：".$price.'</font>');
      }else{
        array_push($obj, $amount);
      }
      //---worktype
      $workType = $objWorksheet->getCell('E'.$row)->getValue();
      if(!isset($workTypeMap[$workType])){
        $allSuccess = false;
        array_push($obj, "<font style='color:red'>找不到:".$workType.'</font>');
      }else{
        array_push($obj, $workType);
      }

      //--- insert into db
      if($allSuccess){
        $totalFee += $price * $amount;
        BaseSvc::getSvc('SupplierOrderItem')->add(array(
          '@billId' => $supplierOrderId,
          '@supplierId' => $supplierId,
          //'@materialid' => 'TODO',
          '@billItemName' => $name,
          '@unit' => $unit,
          '@amount' => $amount,
          '@unitPrice' => $price,
          '@professionType' => $workTypeMap[$workType],
          '@remark' => '批量导入'.$uuid,
          '@createTime' => $time
        ));
      }
      array_push($contents, $obj);
    }
    $tmp = array();
    foreach ($workTypeMap as $key => $value) {
      array_push($tmp, $key);
    }
    $supplierOrderSvc->update(array('@totalFee' => $totalFee, 'id' => $supplierOrderId));
    echo '可填工种：'.join(',  ', $tmp).'<br /><br />';

$template = <<< html
<table cellpadding="0" cellspacing="0">
  <tr>
    <td></td>
    <td>A</td>
    <td>B</td>
    <td>C</td>
    <td>D</td>
    <td>E</td>
    <td>F</td>
  </tr>
  <tr>
    <td>1</td>
    <td>供应商</td>
    <td>工程地址</td>
    <td>申购次数</td>
    <td>完成情况</td>
    <td>申请人</td>
    <td>时间</td>
  </tr>
  <tr>
    <td>2</td>
    <td>$supplierName<br /><font style="color:#888; font-size: 13px;">$supplierId</font></td>
    <td>$projectName<br /><font style="color:#888; font-size: 13px;">$projectId</font></td>
    <td>$times</td>
    <td>$percentage%</td>
    <td>$creator<br /><font style="color:#888; font-size: 13px;">$creatorId</font></td>
    <td>$time</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>4</td>
    <td>材料名称</td>
    <td>数量</td>
    <td>单位</td>
    <td>单价（元）</td>
    <td>工种</td>
    <td></td>
  </tr>
html;
    echo $template;
    $i = 4;
    foreach ($contents as $value) {
      echo '<tr><td>'.(++$i).'</td>';
      echo '<td>'.$value[0].'</td>';
      echo '<td>'.$value[1].'</td>';
      echo '<td>'.$value[2].'</td>';
      echo '<td>'.$value[3].'</td>';
      echo '<td>'.$value[4].'</td>';
      echo '<td></td></tr>';
    }
    echo "</table>";
    if($allSuccess){
      echo $mysql->commit();
      echo "<div style='margin-top: 10px;width: 100%; text-align:center;'>导入成功！</div>";
    }else{
      $mysql->rollback();
      echo "<div style='margin-top: 10px;color:red;' >请修改红色单元格后重新录入！</div>";
    }
    return $allSuccess;
  }
?>
<style>
td{border:#eee 1px solid; min-width: 30px; padding: 5px 5px; text-align: right;}
.submitBtn{height: 50px; width: 300px; text-align: center;}
</style>
</body>
</html>