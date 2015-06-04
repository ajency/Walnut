<?php

function theme_add_csv_components($defined_csv_components){

    $defined_csv_components['mcq'] = array(
            'Textbook','Chapter','Section','Subsection','Tags','Duration','Difficulty','Instructions','Status'
        );
    return $defined_csv_components;

}
add_filter('add_csv_components_filter','theme_add_csv_components',10,1);

function import_csv_mcq_record($import_response,$record){
 
	//THEME BASED RECORD IMPORT FOR A CSV COMPONENT
	if($record[0] > 7){
            $import_response['imported'] = false;
            $import_response['reason'] = 'Roll No greater than 7';
 	}
	else{
            $import_response['imported'] = true;
	}
        
	return $import_response;
 }
add_filter('ajci_import_record_mcq','import_csv_mcq_record',10,2);

function import_content_piece($file_path){

  
   $csv = new Coseva\CSV($file_path['tmp_name']);

   // parse
   $csv->parse();

   $arr = array();
      foreach ($csv  as $row) 
      {
           array_push($arr,$row);
      }

      array_shift($arr);


      foreach($arr as $key=>$value)
      {
          
        

           $data = array();
           $term_ids = array();
           $term_ids['textbook'] = $value[0];
           $term_ids['chapter'] = $value[1];
           $term_ids['sections'][0] = $value[2];
           $term_ids['subsection'][0] = $value[3];
          
           $data['post_status'] = $value[8];
           $data['content_type']= 'student_question';
           $data['post_tags'] = $value[4];
           $data['duration'] = $value[5];
           $data['difficulty_level'] = $value[6];
           $data['instructions'] = $value[7];
           $data['hint_enable'] = 'false';
           $data['hint'] = 'fdsfdsf';
           $data['comment_enable'] = 'false';
           $data['comment'] = 'fsdfdsf';
          
           $data["term_ids"] = $term_ids;

          
           save_content_piece($data);
   }


         
}