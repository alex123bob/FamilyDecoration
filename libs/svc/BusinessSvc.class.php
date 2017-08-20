<?php
class BusinessSvc extends BaseSvc
{

  public function add($q){
    $q['@id'] = $this->getUUID();
    $res = parent::add($q);
    return $res;
  }
}

?>