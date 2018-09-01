<?php

class Series {
    // persisted
    public $id = 0;
    public $title;
    public $status;

    // not persisted
    public $image;
    public $class;

    public function isTitleValid() {
        if ($this->title === null) {
            return false;
        }
        return true;
    }

    public function valid() {
        if ($this->status === null) {
            return false;
        }
        return $this->isTitleValid();
    }
}