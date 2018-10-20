<?php
$servername = $_SERVER["SERIES_SERVER"];
$username = $_SERVER["SERIES_USER"];
$password = $_SERVER["SERIES_PASS"];
$database = $_SERVER["SERIES_DB"];
echo $servername . ". " . $username . ", " . $password . ", " . $database;
?>