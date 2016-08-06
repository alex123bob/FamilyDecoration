<?php
class UploadFilesSvc extends BaseSvc
{

	private static $type = array(
		'img'=>'图片',
		'video'=>'视频',
		'file'=>'文件',
		'other'=>'其他');
	
	public function get($q){
		$res = parent::get($q);
		$prefix = defined("SAE_MYSQL_HOST_M") ? "http://".$_SERVER['HTTP_APPNAME'].'-certs.stor.sinaapp.com/' : str_replace("libs/api.php", "",$_SERVER['SCRIPT_NAME']).'resources/certs/';
		foreach ($res['data'] as &$item) {
			$item['path'] = $prefix.$item['path'];
		}
		return $res;
	}

	public function add($q){
		$q['@id'] = $this->getUUID();
		notNullCheck($q,'@type','文件类型不能为空!');
		notNullCheck($q,'@size','文件大小不能为空!');
		notNullCheck($q,'@path','存储路径不能为空!');
		notNullCheck($q,'@refId','关联对象ID不能为空!');
		notNullCheck($q,'@refType','关联对象不能为空!');
		notNullCheck($q,'@name','图片名称不能为空!');
		$q['@uploader'] = $_SESSION['name'];
		return parent::add($q);
	}
}

?>