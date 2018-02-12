<?php
    class StaffSalaryCommissionSvc extends BaseSvc {
        public function getProjectList ($q) {
            global $mysql;
            $sql = "SELECT p.*, c.totalPrice  FROM project p left join contract_engineering c on p.businessId = c.businessId where p.`isDeleted` = 'false' ";
            $res = $mysql->DBGetAsMap($sql);
            return $res;
        }
    }
?>