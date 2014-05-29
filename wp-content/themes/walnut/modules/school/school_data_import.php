<?php
require_once 'CSV.php';

function parseCSV($filepath) {

// read the csv file
    $csv = new Coseva\CSV($filepath);

// parse the csv
    $csv->parse();

//Convert parsed csv data to a json string
    $csvJson = $csv->toJSON();

    return $csvJson;
}

function getDivisionCsvContent($csvJson) {
    global $wpdb;

    //Convert json object to an array as $csvData
    $csvData = json_decode($csvJson);
    //var_dump($csvData);

    echo "<br><br/>Reading contents from Divsions csv.....<br>";

    //While there is an entry in the CSV data
    $i=1;
    while ($i <= count($csvData)-1 ) {
        $class_id = $csvData[$i][3];
        $division_id = $csvData[$i][1];
        $division = $csvData[$i][4];
        $blogId = $csvData[$i][0];
        //$blogId = 35;

        $divisionTable = $wpdb->prefix .$blogId."_class_divisions";
        echo $divisionTable;


        //Insert into division table
        $wpdb->insert($divisionTable, array(
                'id' => $division_id,
                'division' => $division,
                'class_id' => $class_id
            )
        );

        echo "=> row inserted with division ID:".$division_id."<br/>";
        $i++;
    }
}

function getStudentCsvContent($csvJson){
    //Convert json object to an array as $csvData
    $csvData = json_decode($csvJson);

    echo "<br/><br/>Reading contents from Students csv.....<br/>";
    //While there is an entry in the CSV data
    $i=1;
    while ($i <= count($csvData)-1 ) {
        $user_pass = "ajency";
        $user_login = $csvData[$i][0];
        $meta_value_rollno = $csvData[$i][1];
        $blogId = $csvData[$i][2];
        $user_email = $csvData[$i][3];
        $meta_key_division = "student_division";
        $meta_key_rollno = "roll_no";
        $meta_value_division = $csvData[$i][5];
        $role = "student";

        $userdata = array(
            'user_pass'     => $user_pass,
            'user_login'    => $user_login,
            'user_email'    => $user_email

        );

        $user_id = wp_insert_user( $userdata ) ;

        //On success
        if( !is_wp_error($user_id) ) {
            echo "<br/>User created : ". $user_id;
            //add user meta
            add_user_meta( $user_id, $meta_key_division, $meta_value_division );
            add_user_meta( $user_id, $meta_key_rollno, $meta_value_rollno);
            //add student to blog
            if(add_user_to_blog( $blogId, $user_id, $role )){
                echo "<br/>Added user - ". $user_id." to blog ".$blogId." as a ".$role;
            }

        }

        $i++;

    }
}

function getTeacherCsvContent($csvJson){
    //Convert json object to an array as $csvData
    $csvData = json_decode($csvJson);

    echo "<br/><br/>Reading contents from Teachers csv.....<br/>";
    //While there is an entry in the CSV data
    $i=1;
    while ($i <= count($csvData)-1 ) {
        $user_pass = "ajency";
        $user_login = $csvData[$i][0];
        $user_email = $csvData[$i][1];
        $blogId = $csvData[$i][2];
        $meta_key = "divisions";
        $divisionIdArray = array($csvData[$i][4],$csvData[$i][6],$csvData[$i][8],$csvData[$i][10]);
        $meta_value = maybe_serialize($divisionIdArray);
        $role = "teacher";

        echo "<br/>divisionIdArray=".$divisionIdArray;

        $userdata = array(
            'user_pass'     => $user_pass,
            'user_login'    => $user_login,
            'user_email'    => $user_email

        );

        $user_id = wp_insert_user( $userdata ) ;

        //On success
        if( !is_wp_error($user_id) ) {
            echo "<br/>Teacher created : ". $user_id;
            //add user meta
            add_user_meta( $user_id, $meta_key, $meta_value);

            //add teacher to blog
            if(add_user_to_blog( $blogId, $user_id, $role )){
                echo "<br/>Add user-". $user_id." to blog ".$blogId." as a ".$role;
            }

        }
        $i++;
    }

}

function getTeacherTextbookCsvContent($csvJson){
    global $wpdb;
    $userTable = $wpdb->prefix ."users";
    //Convert json object to an array as $csvData
    $csvData = json_decode($csvJson);

    echo "<br/><br/>Reading contents from Teacher Textbook csv.....<br/>";
    //While there is an entry in the CSV data
    $i=1;
    while ($i <= count($csvData)-1 ) {
        $meta_key = "textbooks";
        $teacherEmailId = $csvData[$i][0];
        $textbookIdArray = array($csvData[$i][2],$csvData[$i][4],$csvData[$i][6],$csvData[$i][8],$csvData[$i][10]);
        $meta_value = maybe_serialize($textbookIdArray);
        $teacherUserId = -1;


        //echo "<br/>select * from $userTable where user_email ='". $teacherEmailId."'";
        //Find userid of teachers based on emailid
        $selectQuery = $wpdb->get_row("select * from $userTable where user_email like '%" . $teacherEmailId . "%'");

        if ($selectQuery != null) {
            $teacherUserId = $selectQuery->ID;
            //echo "<br/>Teacher user id : ". $teacherUserId;
            echo "<br/>Added Meta key=>".$metakey." with meta value => ".$meta_value." for teacher user id => ".$teacherUserId;
            update_user_meta( $teacherUserId, $meta_key, $meta_value);

        }
        else{
            echo "Could not fetch users with that emailid";
        }


        $i++;
    }

}

function getTextbookCsvContent($csvJson){
    global $wpdb;
    //Convert json object to an array as $csvData
    $csvData = json_decode($csvJson);

    echo "<br/><br/>Reading contents from Textbook csv.....<br/>";
    //While there is an entry in the CSV data
    $i=1;
    while ($i <= count($csvData)-1 ) {
        $textBookName = $csvData[$i][1];
        $textbookDescription = $csvData[$i][3];
        $textbookParent_term_id = 0;
        $textbookClassesArray = array($csvData[$i][7],$csvData[$i][9],$csvData[$i][11],$csvData[$i][13],$csvData[$i][15]);
        $textbookClasses = maybe_serialize($textbookClassesArray);
        $attachmentId = $csvData[$i][4];
        $subjectTags = maybe_serialize($csvData[$i][2]);
        $textbookAuthor = $csvData[$i][5];


        //Update wp_terms table
        $returnTerm =  wp_insert_term(
            $textBookName, // the term
            'textbook', // the taxonomy
            array(
                'description'=> $textbookDescription ,
                'parent'=> $textbookParent_term_id
            )
        );
        if( is_wp_error( $returnTerm ) ) {
            echo $returnTerm->get_error_message();
        }
        else{
            echo "<br/>Term added:".$returnTerm['term_id']."------Taxonomy added:".$returnTerm['term_taxonomy_id'];
            //Update wp_options table

            $termId = $returnTerm['term_id'];
            $term_meta = get_option("taxonomy_$termId");
            $term_meta = array(
                'img'=>$attachmentId,
                'author'=>$textbookAuthor
            );

            //save the option array
            update_option("taxonomy_$termId", $term_meta);
            $classes = $textbookClasses;
            $tags=  $subjectTags;

            $check_exists=$wpdb->query("select id from {$wpdb->prefix}textbook_relationships where textbook_id=" . $termId);
            if($check_exists){
                echo "<br>Update textbook_relationships: termid => ".$termId;
                $textbooks_query="update {$wpdb->prefix}textbook_relationships set class_id= '".$classes."', tags='".$tags."'
                        where textbook_id=" . $termId;
            }
            else{
                echo "<br>Insert into textbook_relationships: termid => ".$termId;
                $textbooks_query="insert into {$wpdb->prefix}textbook_relationships values ('','".$termId."', '".$classes."','".$tags."')";
            }

            $wpdb->query($textbooks_query);
        }

        $i++;
    }

}