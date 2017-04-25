<?php
ignore_user_abort ( true );
const FILE = "status.txt";

include 'var.php';
function startsWith($check, $startStr) {
  if (! strncmp ( $check, $startStr, strlen ( $startStr ) )) {
    return true;
  }
  return false;
}
function endsWith($check, $endStr) {
  if (! is_string ( $check ) || ! is_string ( $endStr ) || strlen ( $check ) < strlen ( $endStr )) {
    return false;
  }
  return (substr ( $check, strlen ( $check ) - strlen ( $endStr ), strlen ( $endStr ) ) === $endStr);
}

if (isset ( $_POST ['titel'] ) && isset ( $_POST ['stand'] )) {
  $margin = null;
  if (isset ( $_POST ['margin'] )) {
    $margin = $_POST ['margin'];
  }

  $serien = file ( FILE );
  $f = fopen ( FILE, "w" );
  $_POST ['titel'] = trim ( $_POST ['titel'] );
  $_POST ['stand'] = trim ( $_POST ['stand'] );
  if (! endsWith ( $_POST ['stand'], "x" )) {
    fwrite ( $f, $_POST ['titel'] . SEPARATOR . $_POST ['stand'] );
    if (isset ( $_POST ['margin'] )) {
      fwrite ( $f, SEPARATOR . $margin );
    }
    fwrite ( $f, "\n" );
  }
  foreach ( $serien as $zeile ) {
    $serie = explode ( SEPARATOR, $zeile );
    if ($serie ['0'] != $_POST ['titel']) {
      fwrite ( $f, $zeile );
    }
  }

  if (endsWith ( $_POST ['stand'], "x" )) {
    fwrite ( $f, $_POST ['titel'] . SEPARATOR . $_POST ['stand'] );
    if (isset ( $_POST ['margin'] )) {
      fwrite ( $f, SEPARATOR . $margin );
    }
    fwrite ( $f, "\n" );
  }
  fclose ( $f );
} else {
  $serien = file ( FILE );
  $f = fopen ( FILE, "w" );

  foreach ($serien as $zeile) {
    if (!startsWith($zeile, "#")) {
      $margin = '0px';
      $serie = explode(SEPARATOR, $zeile);
      $titel = trim($serie['0']);
      $stand = trim($serie['1']);
      $imgLocation = "";
      for ($h = 300; $h <= 500; $h += 100) {
        $imgLocation = "img/$h/$titel.jpg";
        if (file_exists($imgLocation)) {
          list ($width, $height, $type, $attr) = getimagesize($imgLocation);
          $margin = "-" . round(($width * DISPLAY_HEIGHT / $height - DISPLAY_WIDTH) / 2) . "px";
          break;
        }
      }
      if (!file_exists($imgLocation)) {
        $imgLocation = "img/".DISPLAY_HEIGHT."/unknown.jpg";
      }
      // write to file
      $output = $titel . SEPARATOR . $stand . SEPARATOR . $margin . "\n";
      fwrite ( $f, $output);
      echo $output."<br>";
    }
  }
}
?>