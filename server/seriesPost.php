<?php
ignore_user_abort(true);

require_once 'Helper.php';
require_once 'FileHandler.php';

const POST_TITEL = 'titel';
const POST_STAND = 'stand';
const POST_IMAGE = 'image';

if (isset($_POST[POST_TITEL]) && isset($_POST[POST_STAND])) {
    FileHandler::write($_POST[POST_TITEL], $_POST[POST_STAND]);
}

if (isset($_POST[POST_TITEL]) && isset($_POST[POST_IMAGE])) {
    FileHandler::writeJPG($_POST[POST_IMAGE], $_POST[POST_TITEL] . '.jpg');
}
