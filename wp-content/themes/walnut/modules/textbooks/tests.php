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
        print_r($textbooks);
        $this->assertInternalType('array', $textbooks);
    }

}
