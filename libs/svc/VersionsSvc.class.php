<?php
class VersionsSvc extends BaseSvc
{
	public function add($q)
	{
		throw new BaseException("禁止新增!");
	}

	public function update($q)
	{
		throw new BaseException("禁止更新!");
	}

	public function getTableMappings()
	{
		global $mysql;
		$tables = $mysql->DBGetAsOneArray('show tables');
		$lines = array();
		foreach ($tables as $key => $tableName) {
			if (startWith($tableName, 'wp_')) {
				continue;
			}
			$fieldData = $mysql->DBGetAsMap('desc ' . $tableName);
			$fields = array();
			foreach ($fieldData as $data => $value) {
				array_push($fields, $value['Field']);
			}
			array_push($lines, "&nbsp;&nbsp;&nbsp;&nbsp;'" . $tableName . "'=>array('" . join("','", $fields) . "')");
		}
		echo '&lt?php<br />';
		echo '    $TableMapping = array(<br />';
		print_r(join(',<br />', $lines));
		echo '<br />);';
		echo '<br /><br /><br /><br />//';
	}
}
