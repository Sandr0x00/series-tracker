<?php

require_once 'Helper.php';
require_once 'FileHandler.php';
require_once 'DbConnectionMySql.php';

$series = new Series();
$series->title = trim("One Piece");
$series->status = trim("E00001");

//DbConnectionMySql::upsert($series);
//DbConnectionMySql::get_all_series();
DbConnectionMySql::create_and_fill_table();
//FileHandler::write($series);
