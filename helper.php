<?php
const SEPARATOR = ';';

const POST_TITEL = 'titel';
const POST_STAND = 'stand';

class Helper {

  public static function startsWith($check, $startStr) {
    if (! strncmp($check, $startStr, strlen($startStr))) {
      return true;
    }
    return false;
  }

  public static function endsWith($check, $endStr) {
    if (! is_string($check) || ! is_string($endStr) || strlen($check) < strlen($endStr)) {
      return false;
    }
    return (substr($check, strlen($check) - strlen($endStr), strlen($endStr)) === $endStr);
  }
}
