<?php

require_once '../../../../../bootstrap.php';

class TextBooksFunctionsTest extends WP_UnitTestCase {

    public function testIfTextBookArrayIsProper() {
        $args = array(
            'parent' => 0,
            'fetch_all' => true
        );
        //$term_id = 15;
        $textbooks = get_textbooks($args);
        $this->assertInternalType('array', $textbooks);
    }
    
    public function testIfTextBookByClassIdIsProper() {
        $args = array(
            'parent' => 0,
            'class' => 1
        );
        //$term_id = 15;
        $textbooks = get_textbooks_for_class($args);
        print_r($textbooks);
        $this->assertInternalType('array', $textbooks);
    }

}
