<?php
class VersionsSvc extends BaseSvc
{
	public function add($q){
		throw new BaseException("禁止新增!");
	}

	public function update($q){
		throw new BaseException("禁止更新!");
	}
}

?>