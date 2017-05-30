<?php

require_once 'Series.php';

class DbConnection {

    /**
     * Singleton Pattern
     * @return DbConnection|null
     */
    public static function getInstance() {
        static $inst = null;
        if ($inst === null) {
            $inst = new DbConnection();
        }
        return $inst;
    }

    /**
     * protected because of the singleton pattern.
     * DbConnection constructor.
     */
    protected function __construct() {
    }

    /**
     * @return \MongoDB\Driver\Manager
     */
    private function connect() {
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        printf('connected');
        return $manager;
    }

    /**
     * @return array
     */
    public function findSorted() {
        try {
            $manager = $this->connect();

            $filter = [];
            $options = [
                'projection' => [ '_id' => 0, 'modified' => 0 ],
                'sort' => ['modified' => -1],
            ];

            $query = new MongoDB\Driver\Query($filter, $options);
            $cursor = $manager->executeQuery('db.collection', $query);

            $documents = [];
            foreach ($cursor as $id => $value) {
                $documents[$value->serie] = $value->status;
            }
            return $documents;
        } catch (MongoDB\Driver\Exception\Exception $e) {
            $this->logException($e);
        }
    }

    /**
     * Find series matching with the given string
     * @param string $serie serie to search
     * @return array
     */
    public function find(string $serie) {
        try {
            $manager = $this->connect();

            $filter = ['Series' => $serie];
            $options = [
                'projection' => [ '_id' => 0, 'modified' => 0 ],
            ];

            $query = new MongoDB\Driver\Query($filter, $options);
            $cursor = $manager->executeQuery('db.collection', $query);

            $documents = [];
            foreach ($cursor as $id => $value) {
                $documents[$value->serie] = $value->status;
            }
            return $documents;
        } catch (MongoDB\Driver\Exception\Exception $e) {
            $this->logException($e);
        }
    }

    /**
     * Update or insert the given serie
     * @param Series $serie
     */
    public function upsert(Series $serie) {
        try {
            $manager = $this->connect();

            $bulk = new MongoDB\Driver\BulkWrite();

            $utcdatetime = new MongoDB\BSON\UTCDateTime();

            $bulk->update(['Series' => $serie->title],
                ['$set' => ['Series' => $serie->title, 'status' => $serie->status,
                    'modified' => $utcdatetime->toDateTime()]], ['multi' => false, 'upsert' => true]);

            $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
            $result = $manager->executeBulkWrite('db.collection', $bulk, $writeConcern);

            var_dump($result);

            printf("Inserted %d document(s)\n", $result->getInsertedCount());
            printf("Matched  %d document(s)\n", $result->getMatchedCount());
            printf("Updated  %d document(s)\n", $result->getModifiedCount());
            printf("Upserted %d document(s)\n", $result->getUpsertedCount());
            printf("Deleted  %d document(s)\n", $result->getDeletedCount());

            foreach ($result->getUpsertedIds() as $index => $id) {
                printf('upsertedId[%d]: ', $index);
                var_dump($id);
            }

            /* If the WriteConcern could not be fulfilled */
            if ($writeConcernError = $result->getWriteConcernError()) {
                printf("%s (%d): %s\n", $writeConcernError->getMessage(), $writeConcernError->getCode(), var_export($writeConcernError->getInfo(), true));
            }

            /* If a write could not happen at all */
            foreach ($result->getWriteErrors() as $writeError) {
                printf("Operation#%d: %s (%d)\n", $writeError->getIndex(), $writeError->getMessage(), $writeError->getCode());
            }
        } catch (MongoDB\Driver\Exception\Exception $e) {
            $this->logException($e);
        }
    }

    /**
     * @param array $series
     */
    public function bulkInsert(array $series) {
        try {
            $manager = $this->connect();

            $bulk = new MongoDB\Driver\BulkWrite();

            $utcdatetime = new MongoDB\BSON\UTCDateTime();

            // create bulk write
            foreach ($series as $title => $status) {
                $bulk->update(['Series' => $title], ['$set' => ['Series' => $title, 'status' => $status, 'modified' => $utcdatetime->toDateTime()]], ['multi' => false, 'upsert' => true]);
            }

            // write into db
            $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
            $result = $manager->executeBulkWrite('db.collection', $bulk, $writeConcern);

            printf("Inserted %d document(s)\n", $result->getInsertedCount());
            printf("Matched  %d document(s)\n", $result->getMatchedCount());
            printf("Updated  %d document(s)\n", $result->getModifiedCount());
            printf("Upserted %d document(s)\n", $result->getUpsertedCount());
            printf("Deleted  %d document(s)\n", $result->getDeletedCount());

            /* If the WriteConcern could not be fulfilled */
            if ($writeConcernError = $result->getWriteConcernError()) {
                printf("%s (%d): %s\n", $writeConcernError->getMessage(), $writeConcernError->getCode(), var_export($writeConcernError->getInfo(), true));
            }

            /* If a write could not happen at all */
            foreach ($result->getWriteErrors() as $writeError) {
                printf("Operation#%d: %s (%d)\n", $writeError->getIndex(), $writeError->getMessage(), $writeError->getCode());
            }
        } catch (MongoDB\Driver\Exception\Exception $e) {
            $this->logException($e);
        }
    }

    public function delete(Series $series) {
        // TODO!
    }

    /**
     * Dumps all series from the db to the given file.
     * @param string $filename write to this file
     */
    public function dump(string $filename) {
        try {
            $documents = $this->findSorted();
            $f = fopen($filename, 'w');

            // write all found series to to file
            foreach ($documents as $title => $status) {
                FileHandler::writeLine($f, $title, $status);
            }
        } catch (MongoDB\Driver\Exception\Exception $e) {
            $this->logException($e);
        }
    }

    /**
     * Log the exception to console
     * @param \MongoDB\Driver\Exception\Exception $e
     */
    private function logException(MongoDB\Driver\Exception\Exception $e) {
        $filename = basename(__FILE__);

        echo "The $filename script has experienced an error.\n";
        echo "It failed with the following exception:\n";

        echo "Exception:", $e->getMessage(), "\n";
        echo "In file:", $e->getFile(), "\n";
        echo "On line:", $e->getLine(), "\n";
    }

}