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
}
?>