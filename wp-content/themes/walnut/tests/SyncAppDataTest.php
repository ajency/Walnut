<?php
/**
 * Created by PhpStorm.
 * User: surajair
 * Date: 06/06/14
 * Time: 12:27 PM
 */

class SyncAppDataTest extends WP_UnitTestCase{

    public function setUp(){
        parent::setUp();
    }

    public function test_if_file_not_present_condition_returns_false() {

        $this->assertEquals( false, sync_app_data_to_db( 0 ) );
    }

    public function test_if_file_present() {

        $this->assertEquals( false, sync_app_data_to_db( 0 ) );
    }


} 