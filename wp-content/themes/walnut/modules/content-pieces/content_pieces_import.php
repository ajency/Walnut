<?php


function get_content_pieces_import_page_html_data(){
   
	if(isset($_POST['submit']) && !empty($_POST)){
		check_admin_referer( 'content-pieces-import' );
		import_content_piece($_FILES["csv_file"]);
	}
	?>
   <h2>Content Pieces Import</h2>
   
   <form enctype="multipart/form-data"  method="post" action="" >
   		
   		<label>MCQ</label>: 
   		<input type="file" name="csv_file">
   		<?php wp_nonce_field( 'content-pieces-import' );?>
   		<input name="type" type="hidden" value="mcq">
   		<input name="submit" type="submit">
   		
   </form>
   
   <?php
}

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