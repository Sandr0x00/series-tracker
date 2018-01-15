<?php

require_once 'Series.php';
require_once 'FileHandler.php';
mysqli_report(MYSQLI_REPORT_STRICT);

class DbConnectionMySql
{

    /**
     * @return connection
     */
    private static function connect()
    {
        $servername = "127.0.0.1";
        $username = "root";
        $password = "";
        $database = "series";

        // Create connection
        try {
            $conn = new mysqli($servername, $username, $password, $database, 3306);
            return $conn;
        } catch (Exception $e) {
            echo "Could not connect to database";
            exit;
        }
        // Check connection
        /*if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }*/
    }

    /**
     * Do not use in normal programm, just for migrating from file to db.
     */
    public static function create_and_fill_table()
    {
        $conn = self::connect();

        // sql to create table
        $sql = "CREATE TABLE series (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );";
        
        if ($conn->query($sql) === false) {
            die("Error creating table: " . $conn->error);
        }

        $series = FileHandler::read();

        $sql = "";
        $year = 2016;
        $month = 12;
        $day = 27;
        foreach ($series as $serie) {
            $sql .= "INSERT INTO series (title, status, date_modified)
            VALUES ('$serie->title', '$serie->status', '$year-$month-$day 00:00:01');";
            if ($day <= 11) {
                $day = 27;
                if ($month <= 11) {
                    $month = 12;
                    $year--;
                }
                $month--;
            }
            $day--;
        }
        
        if ($conn->multi_query($sql) === true) {
            echo "New records created successfully<br>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $conn->close();
    }

    public static function get_all_series()
    {
        $conn = self::connect();

        if ($conn->connect_error) {
            return null;
        }
        
        $sql = 'SELECT * FROM series ORDER BY CASE when status LIKE "%x" THEN 2 ELSE 1 END, date_modified DESC;';
        $result = $conn->query($sql);

        $content = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $obj = new Series();
                $obj->id = $row["id"];
                $obj->title = $row["title"];
                $obj->status = $row["status"];
                $obj->class = Helper::endsWith($obj->status, 'x') ? 'x' : '';
    
                $content[$obj->title] = $obj;
            }
        }

        $conn->close();
        return $content;
    }

    public static function write(Series $series)
    {
        $conn = self::connect();

        $sql = "SELECT * FROM series WHERE title = '$series->title';";
        $result = $conn->query($sql);

        $series->id = 0;
        if ($result->num_rows === 1) {
            while ($row = $result->fetch_assoc()) {
                $series->id = $row['id'];
            }
        } else {
            // TODO?
        }
        $result->free();
        
        $sql = null;
        if ($series->id === 0) {
            $sql = "INSERT INTO series
            (title, status)
            VALUES
            ('$series->title', '$series->status');";
        } else {
            $sql = "UPDATE series
            SET
            title = '$series->title',
            status = '$series->status'
            WHERE
            `id` = $series->id;";
        }

        if ($conn->query($sql) === false) {
            echo json_encode("Could not be written.");
            //die("Error updating: " . $conn->error ."<br>");
        }

        $conn->close();

    }

    public static function dump() {
        $series = self::get_all_series();
        FileHandler::dumpAll($series);
    }
}
