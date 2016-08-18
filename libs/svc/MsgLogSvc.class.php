<?php
class MsgLogSvc extends BaseSvc
{
	/*
		短信类
	*/
	public function add($q){
		$q['@id'] = $this->getUUID();
		return parent::add($q);
	}
}
?>