<?php
ignore_user_abort(true);

require_once 'Helper.php';
require_once 'FileHandler.php';
require_once 'PostHelper.php';

// DO NOT USE THIS ANYMORE

if (isset($_POST[POST_TITEL])) {
    $series = new Series();
    $series->title = sanitize($_POST[POST_TITEL]);
    //FileHandler::delete($series);
}
