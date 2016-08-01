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
				$this->add(array('@file'=>'3'));
				throw new Exception("内部出错");
				$this->add(array('@file'=>'4'));
				$mysql->commit();
			$this->add(array('@file'=>'5'));
			$mysql->commit();
		$this->add(array('@file'=>'6'));
	}

	public function testWrap(){
		$a = "aa";
		$b="bb";
		$svc = $this;
		return $this->wrapp(function() use ($svc,$a,$b){
			return $svc->doString($a,$b);
		});
	}

	public function doString($a,$b){
		return "$a xxxx $b";
	}

	public function doString3(){
		return "xxxx";
	}

	public function wrapp($func){
		return "dy-".$func();
	}
}
?>