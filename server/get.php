<?php
require_once 'DbConnectionMySql.php';

$series = DbConnectionMySql::get_all_series();

$seriesJson = json_encode($series);

$md5 = md5($seriesJson);

if ($md5 !== $_GET['md5']) {
    echo $seriesJson;
} else {
    http_response_code(206);
}
?>