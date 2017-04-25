<?php
ignore_user_abort(true);
const FILE = 'status.txt';

require 'helper.php';

if (isset($_POST[POST_TITEL]) && isset($_POST[POST_STAND])) {
  $margin = null;
  if (isset($_POST['margin'])) {
    $margin = $_POST['margin'];
  }

  $serien = file(FILE);
  $f = fopen(FILE, 'w');
  $_POST[POST_TITEL] = trim($_POST[POST_TITEL]);
  $_POST[POST_STAND] = trim($_POST[POST_STAND]);
  if (! Helper::endsWith($_POST[POST_STAND], 'x')) {
    fwrite($f, $_POST[POST_TITEL] . SEPARATOR . $_POST[POST_STAND]);
    if (isset($_POST[POST_MARGIN])) {
      fwrite($f, SEPARATOR . $margin);
    }
    fwrite($f, "\n");
  }
  foreach ($serien as $zeile) {
    $serie = explode(SEPARATOR, $zeile);
    if ($serie['0'] != $_POST[POST_TITEL]) {
      fwrite($f, $zeile);
    }
  }

  if (Helper::endsWith($_POST[POST_STAND], 'x')) {
    fwrite($f, $_POST[POST_TITEL] . SEPARATOR . $_POST[POST_STAND]);
    if (isset($_POST[POST_MARGIN])) {
      fwrite($f, SEPARATOR . $margin);
    }
    fwrite($f, "\n");
  }
  fclose($f);
}
?>