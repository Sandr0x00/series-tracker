<?php

require_once 'Helper.php';
require_once 'Series.php';

/**
 * only use with dirname(__FILE__)
 */
const FILE_PATH = '/../status.txt';

class FileHandler {

    /**
     * Rewrites the whole file, only changes given line
     * @param Series $series series to write
     */
    public static function write(Series $series) {
        $filePath = dirname(__FILE__) . FILE_PATH;

        // trim stuff
        $title = $series->title;
        $status = $series->status;

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
     * Delete one particular entry. Writes all others to the file
     * @param Series series title of the entry to delete
     */
    public static function delete(Series $series) {
        $filePath = dirname(__FILE__) . FILE_PATH;

        // read current content
        $serien = file($filePath);

        // open the file for clean write
        $f = fopen($filePath, 'w');

        // write all other lines
        if ($serien) {
            // file exists
            foreach ($serien as $zeile) {
                $serie = explode(SEPARATOR, $zeile);
                if ($serie['0'] != $series->title) {
                    fwrite($f, $zeile);
                }
            }
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

    public static function dumpAll($series) {
        $filePath = dirname(__FILE__) . FILE_PATH;
        $f = fopen($filePath, 'w');
        
        // write all found series to to file
        foreach ($series as $serie) {
            FileHandler::writeLine($f, $serie->title, $serie->status);
        }
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

            $obj = new Series();
            $obj->title = trim($serie['0']);
            $obj->status = trim($serie['1']);
            $obj->class = Helper::endsWith($obj->status, 'x') ? 'x' : '';

            $content[$obj->title] = $obj;
        }

        return $content;
    }

    /**
     * Converts a base 64 string into a image and saves it as output-file
     * @param string $base64_string image string to safe
     * @param string $output_file filename for the output file
     * @return mixed filename of the output file
     */
    public static function writeJPG(string $base64_string, string $output_file) {
        // sets the correct directory
        $output_file = dirname(__FILE__) . '/../img/' . $output_file;

        // split the string on commas
        // $data[ 0 ] == "data:image/png;base64"
        // $data[ 1 ] == <actual base64 string>
        $data = explode(',', $base64_string);

        // we could add validation here with ensuring count( $data ) > 1
        $img = imagecreatefromstring(base64_decode($data[1]));
        // write file, while stripping all exif data
        imagejpeg($img, $output_file);

        return $output_file;
    }
}


