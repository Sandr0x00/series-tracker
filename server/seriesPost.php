<?php
ignore_user_abort(true);

require_once 'Helper.php';
require_once 'FileHandler.php';

const POST_TITEL = 'titel';
const POST_STAND = 'stand';

if (isset($_POST[POST_TITEL]) && isset($_POST[POST_STAND])) {
    FileHandler::write($_POST[POST_TITEL], $_POST[POST_STAND]);
}