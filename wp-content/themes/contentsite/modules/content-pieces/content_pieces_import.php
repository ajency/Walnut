<?php

function theme_add_csv_components($defined_csv_components){

    $defined_csv_components['mcq'] = array(
            'Question','textbook','chapter','sections','subsections','Option1','Option2','Option3','Option4','Option5','Option6','Columns','Correct','Individual Marks','Mark_1','Mark_2','Mark_3','Mark_4','Mark_5','Mark_6','Total Marks','Level','Tags','Hint','Comment','Duration'
        );
    return $defined_csv_components;

}
add_filter('add_csv_components_filter','theme_add_csv_components',10,1);

function import_csv_mcq_record($import_response,$record){

      $data= mcq_import_convert_record_to_dataset($record); 
      $validation = mcq_import_validate_data($data);

      if($validation['is_valid'])
      {
          import_content_piece($data);
      } 


      $import_response['imported'] = $validation['is_valid'];
  
      if(!$validation['is_valid'])
          $import_response['reason'] = $validation['reason'];
  
      return $import_response;
 }

add_filter('ajci_import_record_mcq','import_csv_mcq_record',10,2);



function mcq_import_convert_record_to_dataset($record){
   

    $data=array(
      
      'question' => $record[0],
      'textbook' => $record[1],
      'chapter'  => $record[2],
      'sections' => $record[3],
      'subsections' => $record[4],
      'option1' => $record[5],
      'option2' => $record[6],
      'option3' => $record[7],
      'option4' => $record[8],
      'option5' => $record[9],
      'option6' => $record[10],
      'colums' => $record[11],
      'corect' => $record[12],
      'individual_marks' => $record[13],
      'mark1' => $record[14],
      'mark2' => $record[15],
      'mark3' =>  $record[16],
      'mark4' => $record[17],
      'mark5' => $record[18],
      'mark6' => $record[19],
      'totalmarks' => $record[20],
      'level' => $record[21],
      'tags' => $record[22],
      'hint' => $record[23],
      'comment' => $record[24],
      'duration' => $record[25],
    
    );
  
  return $data;
  
}

function mcq_import_validate_data($record)
{
      $validation= array();
      
      $validation['is_valid']=true;
      $validation['reason']=array();
      
      


      if(empty($record['question']))
      {
              $validation['is_valid']=false;
              $validation['reason']='please enter question';

      }
      else if(!is_numeric($record['textbook']))
      {
              $validation['is_valid']=false;
              $validation['reason']='textbook id needs to be integer';

      }
      else if(!is_numeric($record['chapter']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'chapter id needs to be an integer';
      }
      else if(!is_numeric($record['sections']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'section id needs to be an integer';
      }
      else if(!is_numeric($record['subsections']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'subsection needs to be integer';
      }
      else if(!is_numeric($record['colums']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'columns needs to be integer';
      }
      else if(empty($record['individual_marks']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'Pleas enter individual marks';
      }
      else if(empty($record['option1']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'Pleas enter option';
      }
      else if(empty($record['option2']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'Pleas enter option';
      }
      else if(!is_numeric($record['mark1']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'marks needs to be an integer';
      }
      else if(!is_numeric($record['mark2']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'marks needs to be an integer';
      }
      else if(!is_numeric($record['totalmarks']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'totalmarks needs to be an integer';
      }
      else if(!is_numeric($record['level']))
      {
              $import_response['imported'] = false;
              $import_response['reason'] = 'level needs to be an integer';
      }
      else
      {
         $validation['is_valid']=true;
      }
      
      return $validation;
  
}

function import_content_piece($record)
{
    $question_text_id = get_question_text_id($record);

    $mcq_outline_id = get_mcq_outline_id($record);

    content_layout($question_text_id,$mcq_outline_id,$record);
      
}

function get_question_text_id($record)
{
        $data = array();
        $data['style'] = '';
        $data['draggable'] = 'true';
        $data['element'] = 'text';
        $data['content'] = $record['question'];
        $data['bottom_margin'] = '';
        $data['top_margin'] = '';
        $data['top_margin'] = '';
        $data['left_margin'] = '';
        $data['right_margin'] = '';
        $question_text_id = save_content_element($data);
        return $question_text_id;
}

function get_mcq_outline_id($record)
{

        $data = array();
        $optionArray = array();
        $correctAnswerArray = array();
        $count = 0;

        $data['style'] = '';
        $data['draggable'] = 'true';
        $data['element'] = 'Mcq';

        if(!empty($record['option1']))
        {
            $count++;
            $singleOptionArray = array();
            $singleOptionArray['optionNo'] = '1';
            $singleOptionArray['class'] = '4';
            $singleOptionArray['marks'] = $record['mark1'];
            $singleOptionArray['text'] = $record['option1'];
            array_push($optionArray,$singleOptionArray);
        }
        if(!empty($record['option2']))
        {
            $count++;
            $singleOptionArray = array();
            $singleOptionArray['optionNo'] = '2';
            $singleOptionArray['class'] = '4';
            $singleOptionArray['marks'] = $record['mark2'];
            $singleOptionArray['text'] = $record['option2'];
            array_push($optionArray,$singleOptionArray);
        }  
        if(!empty($record['option3']))
        {
            $count++;
            $singleOptionArray = array();
            $singleOptionArray['optionNo'] = '3';
            $singleOptionArray['class'] = '4';
            $singleOptionArray['marks'] = $record['mark3'];
            $singleOptionArray['text'] = $record['option3'];
            array_push($optionArray,$singleOptionArray);
        } 
        if(!empty($record['option4']))
        {
            $count++;
            $singleOptionArray = array();
            $singleOptionArray['optionNo'] = '4';
            $singleOptionArray['class'] = '4';
            $singleOptionArray['marks'] = $record['mark4'];
            $singleOptionArray['text'] = $record['option4'];
            array_push($optionArray,$singleOptionArray);
        }
        if(!empty($record['option5']))
        {
            $count++;
            $singleOptionArray = array();
            $singleOptionArray['optionNo'] = '5';
            $singleOptionArray['class'] = '4';
            $singleOptionArray['marks'] = $record['mark5'];
            $singleOptionArray['text'] = $record['option5'];
            array_push($optionArray,$singleOptionArray);
        } 
        if(!empty($record['option6']))
        {
            $count++;
            $singleOptionArray = array();
            $singleOptionArray['optionNo'] = '5';
            $singleOptionArray['class'] = '4';
            $singleOptionArray['marks'] = $record['mark6'];
            $singleOptionArray['text'] = $record['option6'];
            array_push($optionArray,$singleOptionArray);
        }   

        $data['optioncount'] = $count;

        $data['columncount'] = $record['colums'];

        $data['options'] = $optionArray;

        $tmarks = $record['corect'];
        $a = explode(",",$tmarks);

        $data['marks'] = $record['totalmarks']; 
        $data['multiple'] = 'false';
        $data['correct_answer'] = $a;
        $data['complete'] = true;
        $data['bottom_margin'] = '';
        $data['top_margin'] = '';
        $data['left_margin'] = '';
        $data['right_margin'] = '';

        $mcq_layout_id = save_content_element($data);

        return  $mcq_layout_id;
}

function content_layout($question_text_id,$mcq_outline_id,$record)
{

        $question_text_id = (array)$question_text_id;
        $mcq_outline_id = (array)$mcq_outline_id; 
        $data = array($mcq_outline_id);

        $options_layout = array();

        for($i=0;$i<6;$i++)
        {
            $data=  array();
            $optionKey = array('option1','option2','option3','option4','option5','option6');
          if(!empty($record[$optionKey[$i]]))
            {
                $data['style'] = '';
                $data['draggable'] = 'true';
                $data['element'] = 'text';
                $data['content'] = $record[$optionKey[$i]]; 
                $data['bottom_margin'] = '';
                $data['top_margin']   = '';
                $data['left_margin']  = '';
                $data['right_margin']   = '';

                $OPTION_ID = save_content_element($data);

                $layout = array();
                $layout['element'] = 'Text';
                $layout['meta_id'] = $OPTION_ID;

                array_push($options_layout,$layout);
           }
        }

        

        

        $content_layout = array();
        $content_layout[0] = array('element' => 'Text','meta_id'=> $question_text_id[0]);
        $content_layout[1] = array('element' => 'Mcq','meta_id'=> $mcq_outline_id[0],'elements'=>$options_layout);

       

        $data = array();
        $data = array(
                      'post_status'=>'pending',
                      'content_type'=>'student_question',
                      'term_ids'=>array(
                                  'textbook' => $record['textbook'],
                                  'chapter' => $record['chapter'],
                                  'sections' => array($record['sections']),
                                  'subsections' => array($record['subsections']),
                                  ),
                      'post_tags'=>$record['tags'],
                      'duration'=> $record['duration'],
                      'difficulty_level'=>$record['level'],
                      'instructions'=>'',
                      'hint_enable'=>'false',
                      'hint'=>$record['hint'],
                      'comment_enable'=>'false',
                      'comment'=>$record['comment'],
                     );
        $data['json'] = $content_layout;

         //_log('*******************');
         //_log($data);

         save_content_piece($data);


}




