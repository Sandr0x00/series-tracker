<?php
ignore_user_abort(true);
const FILE = 'status.txt';

require 'helper.php';

$serien = file(FILE);
$f = fopen(FILE, 'w');

foreach ($serien as $zeile) {
    if (!Helper::startsWith($zeile, '#')) {
        $serie = explode(SEPARATOR, $zeile);
        $titel = trim($serie['0']);
        $stand = trim($serie['1']);
        $imgLocation = '';
        for ($h = 300; $h <= 500; $h += 100) {
            $imgLocation = "img/$h/$titel.jpg";
            if (file_exists($imgLocation)) {
                list ($width, $height, $type, $attr) = getimagesize($imgLocation);
                break;
            }
        }
        // write to file
        $output = $titel . SEPARATOR . $stand . "\n";
        fwrite($f, $output);
        echo $output . '<br>';
    }
}