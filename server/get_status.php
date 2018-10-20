<?php
require_once 'DbConnectionMySql.php';

$file = DbConnectionMySql::dump();

header("Content-Description: File Transfer");
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=\"" . basename($file) . "\"");

readfile($file);
exit();
?>