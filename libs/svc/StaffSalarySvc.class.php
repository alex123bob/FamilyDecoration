<?php
    class StaffSalarySvc extends BaseSvc
    {
        public function add ($q){
            $q["@id"] = $this->getUUID();
            $res = parent::add($q);
            return $res;
        }

        public function getDepas (){
            global $mysql;
            $sql = "select DISTINCT(SUBSTRING(`level`, 1, 3)) AS depa from user where isDeleted = 'false' and isLocked = 'false' ORDER BY level ASC";
            $res = $mysql->DBGetAsMap($sql);
            return $res;
        }
    }
?>