<?php
    class StaffSalarySvc extends BaseSvc
    {
        public function add ($q){
            if (!isset($q["@year"]) || !isset($q["@month"]) || !isset($q["@depa"])) {
                throw new Exception("需要工资的年份，月份或部门信息来初始化部门工资表!");
            }
            $memebers = $this->getMembersByDepa($q["@depa"]);
            foreach ($memebers as $key => $obj) {
                $q["@staffName"] = $obj["name"];
                $q["@staffLevel"] = $obj["level"];
                $q["@salaryDate"] = implode("-", array($q["@year"], $q["@month"], "01"));
                $q["@id"] = $this->getUUID();
                $res = parent::add($q);
            }
            return array("status" => "successful", "errMsg" => "初始化成功!");
        }

        public function getDepas (){
            global $mysql;
            $sql = "select DISTINCT(SUBSTRING(`level`, 1, 3)) AS depa from user where isDeleted = 'false' and isLocked = 'false' ORDER BY level ASC";
            $res = $mysql->DBGetAsMap($sql);
            return $res;
        }

        public function getMembersByDepa ($depa){
            global $mysql;
            $sql = "SELECT * FROM user WHERE SUBSTR(`level`, 1, 3) = '?' and isDeleted = 'false' ";
            $res = $mysql->DBGetAsMap($sql, $depa);
            return $res;
        }

        public function checkSalaryByDepaMonthYear ($q){
            global $mysql;
            if (!isset($q["year"]) || !isset($q["month"]) || !isset($q["depa"])) {
                throw new Exception("缺少查询工资的年份，月份或部门信息!");
            }
            $year = $q["year"];
            $month = $q["month"];
            $depa = $q["depa"];
            $sql = "SELECT * FROM `staff_salary` WHERE SUBSTR(`staffLevel`, 1, 3) = '?' and YEAR(`salaryDate`) = '?' and MONTH(`salaryDate`) = '?'";
            $res = $mysql->DBGetAsMap($sql, $depa, $year, $month);
            return array("status" => "successful", "data" => $res, "total" => count($res));
        }

        public function get ($q) {
            global $mysql;
            $arr = $this->checkSalaryByDepaMonthYear($q);
            return $arr;
        }
    }
?>