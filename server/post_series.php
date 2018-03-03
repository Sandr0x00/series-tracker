<?php
ignore_user_abort(true);

require_once 'Helper.php';
require_once 'FileHandler.php';
require_once 'DbConnectionMySql.php';
require_once 'PostHelper.php';

if (isset($_POST[POST_TITEL]) && isset($_POST[POST_STAND])) {
    $series = new Series();
    $series->title = sanitize($_POST[POST_TITEL]);
    $series->status = sanitize($_POST[POST_STAND]);
    if ($series->valid()) {
        DbConnectionMySql::write($series);
    }
}

if (isset($_POST[POST_TITEL]) && isset($_POST[POST_IMAGE])) {
    FileHandler::writeJPG($_POST[POST_IMAGE], $_POST[POST_TITEL] . '.jpg');
}
