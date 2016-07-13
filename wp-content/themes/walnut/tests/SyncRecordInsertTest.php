<?php
/**
 * Created by PhpStorm.
 * User: surajair
 * Date: 06/06/14
 * Time: 12:51 PM
 */

class SyncRecordInsertTest extends WP_UnitTestCase{

    public function setUp(){
        parent::setUp();

        $this->school_id = $this->factory->blog->create();

    }

} 