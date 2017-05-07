<?php
ignore_user_abort(true);
const FILE = 'status.txt';

require 'helper.php';
require 'DbConnection.php';

$serien = file(FILE);
$f = fopen(FILE, 'w');

foreach ($serien as $zeile) {
    if (!Helper::startsWith($zeile, '#')) {
        $serie = explode(SEPARATOR, $zeile);
        $title = trim($serie['0']);
        $status = trim($serie['1']);

        $serie = new Serie();
        $serie->title = $title;
        $serie->status = $status;

        // write to db
        DbConnection::getInstance()->upsert($serie);

        // write to file
        FileHandler::writeLine($f, $title, $status);
    }
}