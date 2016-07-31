<?php

Class ErrorLogSvc extends BaseSvc{

	public function testTransaction(){
		global $mysql;
		$this->add(array('@file'=>'1'));
			$mysql->begin();
			$this->add(array('@file'=>'2'));		
				$mysql->begin();
				$this->add(array('@file'=>'3'));
				$mysql->commit();
			$this->add(array('@file'=>'4'));
			$mysql->rollback();
		$this->add(array('@file'=>'5'));
	}

	public function testTransaction2(){
		global $mysql;
		$this->add(array('@file'=>'1'));
			$mysql->begin();
			$this->add(array('@file'=>'2'));		
				$mysql->begin();
				$this->add(array('@file'=>'5'));
				throw new Exception("内部出错");
				$this->add(array('@file'=>'3'));
				$mysql->commit();
			$this->add(array('@file'=>'4'));
			$mysql->commit();
		$this->add(array('@file'=>'5'));
	}
}
?>