<?php

/**
 * Created by PhpStorm.
 * User: surajair
 * Date: 13/06/14
 * Time: 1:02 PM
 */
class UploadsExportToJSONTest extends WP_UnitTestCase {

    public function test_image_files_json() {
        $this->assertEquals(
                array(  site_url() . '/wp-content/uploads/images/file-1.png',
                        site_url() . '/wp-content/uploads/images/file-2.jpg' ),
                get_images_directory_json());
    }

    public function test_video_files_json() {
        $this->assertEquals(
                array(  site_url() . '/wp-content/uploads/videos/video-1.avi',
                        site_url() . '/wp-content/uploads/videos/video-2.avi' ),
                get_videos_directory_json());
    }
} 