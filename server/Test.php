<?php

require_once 'Helper.php';
require_once 'FileHandler.php';

$series = new Series();
$series->title = trim("A");
$series->status = trim("E00001");
FileHandler::write($series);