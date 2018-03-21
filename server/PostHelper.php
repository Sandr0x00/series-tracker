<?php

const POST_TITEL = 'titel';
const POST_STAND = 'stand';
const POST_IMAGE = 'image';

function sanitize(string $text) {
    $text = trim($text);
    $text = htmlspecialchars($text, ENT_DISALLOWED, 'utf-8');
    if (!preg_match("/^[a-zA-Z0-9 ]*$/", $text)) {
        echo 'Text: ' . $text . 'contains special characters, which are not allowed.';
        return null;
    }
    return $text;
}