<?php

class Series {
    // persisted
    public $id = 0;
    public $title;
    public $status;

    // not persisted
    public $image;
    public $class;

    public function valid() {
        if ($this->title === null) {
            return false;
        }
        if ($this->status === null) {
            return false;
        }
        return true;
    }
}