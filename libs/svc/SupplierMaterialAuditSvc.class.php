<?php
class SupplierMaterialAuditSvc extends BaseSvc
{
	public function add($q){
		$msg = '供应商申请新增某个材料: SupplierMaterialAudit.addMaterial\n<br />';
		$msg.= '供应商申请删除某个材料: SupplierMaterialAudit.deleteMaterial\n<br />';
		$msg.= '供应商申请修改某个材料: SupplierMaterialAudit.updateMaterial\n<br />';
		$msg.= '供应商撤销修改某个材料: SupplierMaterialAudit.revertUpdateMaterial\n<br />';
		throw new BaseException($msg);
	}

	public function update($q) {
		$msg = '供应商申请新增某个材料: SupplierMaterialAudit.addMaterial\n<br />';
		$msg.= '供应商申请删除某个材料: SupplierMaterialAudit.deleteMaterial\n<br />';
		$msg.= '供应商申请修改某个材料: SupplierMaterialAudit.updateMaterial\n<br />';
		$msg.= '供应商撤销修改某个材料: SupplierMaterialAudit.revertUpdateMaterial\n<br />';
		throw new BaseException($msg);
	}

	public function del($q) {
		$msg = '供应商申请新增某个材料: SupplierMaterialAudit.addMaterial\n<br />----';
		$msg.= '供应商申请删除某个材料: SupplierMaterialAudit.deleteMaterial\n<br />';
		$msg.= '供应商申请修改某个材料: SupplierMaterialAudit.updateMaterial\n<br />';
		$msg.= '供应商撤销修改某个材料: SupplierMaterialAudit.revertUpdateMaterial\n<br />';
		throw new BaseException($msg);
	}
	/*
		供应商申请新增某个材料
	*/
	public function addMaterial($q) {
		notNullCheck($q,'@supplierId','供应商不能为空!');
		// notNullCheck($q,'@name','材料名不能为空!');
		// notNullCheck($q,'@professionType','工种不能为空!');
		$q['@id'] = $this->getUUID();
		$q['@operation'] = 'add';
		$q['@creator'] = $_SESSION['name'];
		$res = parent::getCount(array('name'=>'','supplierId'=>$q['@supplierId']));
		if($res['count'] > 0) {
			throw new BaseException('还有未完成的材料!');
		}
		global $mysql;
		$mysql->begin();
		$svc = BaseSvc::getSvc('SupplierMaterial');
		$res = $svc->add($q);
		$q['@materialId'] = $res['data']['id'];
		$res = parent::add($q);
		$mysql->commit();
		return $res;
	}
	/*
		供应商申请删除某个材料
	*/
	public function deleteMaterial($q) {
		notNullCheck($q,'materialId','材料ID(materialId)不能为空!');
		global $mysql;
		$mysql->begin();
		//先撤销之前所有修改
		parent::del(array('materialId'=>$q['materialId']));
		//再新增此次修改
		$q['@id'] = $this->getUUID();
		$q['@operation'] = 'delete';
		$q['@materialId'] = $q['materialId'];
		$res = parent::add($q);
		$mysql->commit();
		return $res;
	}
	/*
		供应商申请修改某个材料
	*/
	public function updateMaterial($q) {
		notNullCheck($q,'materialId','材料ID(materialId)不能为空!');
		global $mysql;
		$mysql->begin();
		$res = parent::get(array('materialId'=>$q['materialId']));
		$q['@id'] = $this->getUUID();
		$q['@operation'] = 'update';
		$q['@materialId'] = $q['materialId'];
		if($res['total'] != 0) {
			// for update just  after add.
			$q['@operation'] = $res['data'][0]['operation'];
			$res = parent::update($q);
		}else{
			$res = parent::add($q);
		}
		$mysql->commit();
		return $res;
	}
	/*
		供应商撤销修改某个材料
	*/
	public function revertUpdateMaterial($q) {
		notNullCheck($q,'id','修改记录Id(id)不能为空!');
		global $mysql;
		$mysql->begin();
		$res = parent::get($q);
		if($res['total'] == 1 && $res['data'][0]['operation'] == 'add') {
			$svc = BaseSvc::getSvc('SupplierMaterial');
			$svc->del(array('id'=>$res['data'][0]['materialId']));
		}
		$res = parent::del($q);
		$mysql->commit();
		return $res;
	}

	/*
		通过供应商请求
	*/
	public function passUpdateMaterialRequest($q){
		notNullCheck($q,'id','修改记录Id(id)不能为空!');
		$supplierMaterialSvc = BaseSvc::getSvc('SupplierMaterial');
		global $mysql;
		$mysql->begin();
		$request = parent::get($q);
		if($request['total'] != 1){
			throw new BaseException('没有id为' .$q['id'].'的修改请求.');
		}
		$request = $request['data'][0];
		if($request['operation'] == 'delete') {
			$supplierMaterialSvc->del(array('id'=>$request['materialId']));
		}else{
			//add 和 update可能会被修改过
			$supplierMaterialSvc->update(array(
				'id'=>$request['materialId'],
				'@name'=>$request['name'],
				'@unit'=>$request['unit'],
				'@price'=>$request['price'],
				'@professionType'=>$request['professionType']
			));
		}
		$res = parent::del(array('id'=>$request['id']));
		$mysql->commit();
		return $res;
	}
}

?>