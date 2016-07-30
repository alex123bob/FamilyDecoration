<?php
class LoanSvc extends BaseSvc
{
	public function add($qryParams){
		$qryParams['@id'] = $this->getUUID();
		return parent::add($qryParams);
	}

}

?>