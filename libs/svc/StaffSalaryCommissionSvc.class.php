<?php
    class StaffSalaryCommissionSvc extends BaseSvc {
        public function getProjectList ($q) {
            global $mysql;
            $limitSql = "";
            if (isset($q["start"]) && isset($q["limit"])) {
                $limitSql .= " LIMIT ".$q["start"].", ".$q["limit"];
            }

			$params = array();
            $whereSql = parent::parseWhereSql('p.',$q,$params,'project');
            $sql = "SELECT p.*, c.totalPrice  FROM project p left join contract_engineering c on p.businessId = c.businessId ".$whereSql.$limitSql;
            $countSql = "SELECT count(*) total FROM project p left join contract_engineering c on p.businessId = c.businessId ".$whereSql;
            $total = $mysql->DBGetAsMap($countSql, $params);
            $total = $total[0]["total"];
            $data = $mysql->DBGetAsMap($sql, $params);
            return array("data" => $data, "total" => $total, "status" => "successful");
        }

        public function add ($q) {
            $projectIds = explode(",", $q["@projectIds"]);
            foreach ($projectIds as $key => $projectId) {
                $q["@id"] = $this->getUUID();
                $q["@projectId"] = $projectId;
                $res = parent::add($q);
            }
            return $res;
        }

        public function get ($q) {
            global $mysql;
            $sql = "select s.*, p.projectName from staff_salary_commission s left join project p on s.projectId = p.projectId where s.isDeleted = 'false'";
            if (isset($q["projectId"])) {
                $projectIds = explode(",", $q["projectId"]);
                if (count($projectIds) > 1) {
                    $sql .= " and s.projectId in (?) ";
                    $res = $mysql->DBGetAsMap($sql, implode(",", $projectIds));
                }
                else {
                    $sql .= " and s.projectId = '?' ";
                    $res = $mysql->DBGetAsMap($sql, $q["projectId"]);
                }
            }
            else if (isset($q["staffSalaryId"])) {
                $sql .= " and s.staffSalaryId = '?' ";
                $res = $mysql->DBGetAsMap($sql, $q["staffSalaryId"]);
            }
            else {
                $res = parent::get($q);
            }
            return $res;
        }
    }
?>