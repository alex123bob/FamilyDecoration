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
            $userSvc = parent::getSvc('User');
            $userSvc->appendRealName($arr["data"], "staffName");
            return $arr;
        }

        public function calculateCommission ($q) {
            global $mysql;
            $sql = "SELECT * from staff_salary_commission where staffSalaryId = '?' and isDeleted = 'false'";
            $arr = $mysql->DBGetAsMap($sql, $q["id"]);
            $commission = 0;
            foreach ($arr as $key => $obj) {
                if (is_numeric($obj["commissionAmount"])) {
                    $commission += $obj["commissionAmount"];
                }
            }
            $q["@commission"] = $commission;
            parent::update($q);
        }

        public function update ($q) {
            $q["@total"] = (isset($q["@basicSalary"]) ? $q["@basicSalary"] : 0) + (isset($q["@fullAttendanceBonus"]) ? $q["@fullAttendanceBonus"] : 0) + (isset($q["@bonus"]) ? $q["@bonus"] : 0) - (isset($q["@deduction"]) ? $q["@deduction"] : 0);
            $q["@actualPaid"] = $q["@total"] - (isset($q["@insurance"]) ? $q["@insurance"] : 0) - (isset($q["@housingFund"]) ? $q["@housingFund"] : 0) - (isset($q["@incomeTax"]) ? $q["@incomeTax"] : 0) - (isset($q["@others"]) ? $q["@others"] : 0);
            parent::update($q);
        }
    }
?>