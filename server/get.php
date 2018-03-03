<?php
require_once 'DbConnectionMySql.php';

$series = DbConnectionMySql::get_all_series();

echo json_encode($series);

