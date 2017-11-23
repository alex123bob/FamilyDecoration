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
            return $res;
        }

        public function get ($q) {
            global $mysql;
            $arr = $this->checkSalaryByDepaMonthYear($q);
            if (count($arr) <= 0) {
                // insert
            }
            else {
                return $res;
            }
        }
    }
    ?>