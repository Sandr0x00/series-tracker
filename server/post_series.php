<?php
ignore_user_abort(true);

require_once 'Helper.php';
require_once 'FileHandler.php';
require_once 'DbConnectionMySql.php';
require_once 'PostHelper.php';

$series = new Series();
if (isset($_POST[POST_TITEL])) {
    $series->title = sanitize($_POST[POST_TITEL]);
}
if (!$series->isTitleValid()) {
    // title not valid, nothing to do here
    return;
}
if (isset($_POST[POST_STAND])) {
    $series->status = sanitize($_POST[POST_STAND]);
    if ($series->valid()) {
        DbConnectionMySql::write($series);
    }
}
if (isset($_POST[POST_IMAGE])) {
    FileHandler::writeJPG($_POST[POST_IMAGE], $series->title . '.jpg');
}
