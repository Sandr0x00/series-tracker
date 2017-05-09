<?php

require_once 'Helper.php';
require_once 'Serie.php';

/**
 * only use with dirname(__FILE__)
 */
const FILE_PATH = '/../status.txt';

class FileHandler {

    /**
     * Rewrites the whole file, only changes given line
     * @param string $title
     * @param string $status
     */
    public static function write(string $title, string $status) {
        $filePath = dirname(__FILE__) . FILE_PATH;

        // trim stuff
        $title = trim($title);
        $status = trim($status);

        // read current content
        $serien = file($filePath);

        // open the file for clean write
        $f = fopen($filePath, 'w');

        // write current line first when no X
        if (!Helper::endsWith($status, 'x')) {
            self::writeLine($f, $title, $status);
        }

        // write all other lines
        if ($serien) {
            // file exists
            foreach ($serien as $zeile) {
                $serie = explode(SEPARATOR, $zeile);
                if ($serie['0'] != $title) {
                    fwrite($f, $zeile);
                }
            }
        }

        // write current line last, when X
        if (Helper::endsWith($status, 'x')) {
            self::writeLine($f, $title, $status);
        }
        fclose($f);
    }

    /**
     * Appends a single line to the file
     * @param resource $f
     * @param string $title title of the series
     * @param string $status current status
     */
    public static function writeLine($f, string $title, string $status) {
        fwrite($f, $title);
        fwrite($f, SEPARATOR);
        fwrite($f, $status);
        fwrite($f, "\n");
    }

    /**
     * Reads all entries of the file
     * @return array
     */
    public static function read() {
        $filePath = dirname(__FILE__) . FILE_PATH;

        // read whole file
        $serien = file($filePath);

        $content = [];

        if (!$serien) {
            // no file found, assume clean start
            return $content;
        }

        // fill content
        foreach ($serien as $zeile) {
            // ignore comments
            if (Helper::startsWith($zeile, '#')) {
                continue;
            }

            $serie = explode(SEPARATOR, $zeile);

            $obj = new Serie();
            $obj->title = trim($serie['0']);
            $obj->status = trim($serie['1']);
            $obj->class = Helper::endsWith($obj->status, 'x') ? 'x' : '';

            $content[$obj->title] = $obj;
        }

        return $content;
    }
}


