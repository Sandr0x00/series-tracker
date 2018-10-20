<?php
ignore_user_abort(true);

require_once 'DbConnectionMySql.php';

if ($_FILES['file']["error"] == 0) {
    $fp = fopen($_FILES['file']['tmp_name'], 'rb');
    $content = [];
    while (($line = fgets($fp)) !== false) {
        array_push($content, $line);
    }
    DbConnectionMySql::create_and_fill_table($content);
} else {
    echo "No file uploaded.";
}
?>
