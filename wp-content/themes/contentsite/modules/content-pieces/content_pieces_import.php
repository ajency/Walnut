<?php

function theme_add_csv_components($defined_csv_components){

   $defined_csv_components['mcq'] = array(
      'Question','textbook','chapter','sections','subsections','total marks','Multiple Correct Answers','Correct','Option1','mark1','Option2','mark2','Option3','mark3','Option4','mark4','Option5','mark5','Option6','mark6','Columns','Level','Tags','Hint','Comment','Duration'
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

      $section = $record[4];
      $sectionsubArray = explode(",",$section);

      $section = $record[3];
      $sectionArray = explode(",",$section);
    
     $data=array(
        'question'      => $record[0],
        'textbook'      => $record[1],
        'chapter'       => $record[2],
        'sections'      => $sectionArray,
        'subsections'   => $sectionsubArray,
        'totalmarks'    => $record[5],
        'multiple'      => $record[6],
        'correct'       => $record[7],
        'columns'       => $record[20],
        'level'         => $record[21],
        'tags'          => $record[22],
        'hint'          => $record[23],
        'comment'       => $record[24],
        'duration'      => $record[25],
    );

    $data['options']= array();

      if(!empty($record[8])){
        $data['options'][]=array(
                                'option'=> $record[8],
                                'mark'=> $record[9]   
                              );
      }
      if(!empty($record[10])){
        $data['options'][]=array(
                                'option'=> $record[10],
                                'mark'=> $record[11]  
                              );
      }
      if(!empty($record[12])){
        $data['options'][]=array(
                                'option'=> $record[14],
                                'mark'=> $record[15] 
                              );
      }
      if(!empty($record[16])){
        $data['options'][]=array(
                                'option'=> $record[16],
                                'mark'=> $record[17]    
                              );
      }
      if(!empty($record[18])){
        $data['options'][]=array(
                                'option'=> $record[18],
                                'mark'=> $record[19]    
                              );
      }
      if(!empty($record[8])){
        $data['options'][]=array(
                                'option'=> $record[8],
                                'mark'=> $record[9]   
                              );
      }

    if(!$data['columns']) $data['columns']=2;
    
    $data['multiple']= (strtolower($data['multiple'])=='yes')?'true':'false';
    
    return $data;
 
}

function mcq_import_validate_data($record)
{
      $validation= array();
      
      $validation['is_valid']=true;
      $validation['reason']=array();

      if(sizeof($record['options']) <= 2 )
      {
              $validation['is_valid']=false;
              $validation['reason'][] ='please enter at least two options.';
      }

     
      if( (int)$record['totalmarks'] <= 1 )
      {
              $validation['is_valid']=false;
              $validation['reason'][] ='total marks should be greater than or equal to one';
      }

      $validateArry = array('question'=>'please enter question.','correct' =>'Please enter correct vaues.');

      foreach ($validateArry as $columnname => $reason)
      {
          if(empty($record[$columnname]))
          {
                  $validation['is_valid']= false;
                  $validation['reason'][] = $reason;

          }
      }

      $validateArry = array('textbook'=>'please enter textbookid as integer.', 'chapter'=>'Please enter chapter id as integer.');

      foreach ($validateArry as $columnname => $reason)
      {
          if(!is_numeric($record[$columnname]))
          {
                  $validation['is_valid']= false;
                  $validation['reason'][] = $reason;

          }
      }

     $validation['reason'] = implode(" ",$validation['reason']);

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
      $data = array(
              'style'=>'',
              'draggable' => 'true',
              'element' => 'Text',
              'content' => $record['question'],
              'bottom_margin' => '',
              'top_margin' => '',
              'left_margin' => '',
              'right_margin' => '',
             );
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
        foreach ($record['options'] as $arr)
        {
            if(!empty($arr['option']))
            {
                $count++;
                $singleOptionArray = array();
                $singleOptionArray['optionNo'] = $count;
                $singleOptionArray['class'] = '4';
                $singleOptionArray['marks'] = $arr['mark'];
                $singleOptionArray['text'] = $arr['option'];
                array_push($optionArray,$singleOptionArray);
            }
        }    

        $data['optioncount'] = $count;

        $data['columncount'] = $record['columns'];

        $data['options'] = $optionArray;
        
        $correct = $record['correct'];
        $correctArray = explode(",",$correct);

        $data['marks'] = $record['totalmarks']; 
        $data['multiple'] = $record['multiple'];
        $data['correct_answer'] = $correctArray;
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

       foreach ($record['options'] as $arr)
      {
        if(!empty($arr['option']))
        {
                $data['style'] = '';
                $data['draggable'] = 'true';
                $data['element'] = 'Text';
                $data['content'] = $arr['option']; 
                $data['bottom_margin'] = '';
                $data['top_margin']   = '';
                $data['left_margin']  = '';
                $data['right_margin']   = '';

                $OPTION_ID = save_content_element($data);

                $layout = array();
                $layout[0]['element'] = 'Text';
                $layout[0]['meta_id'] = $OPTION_ID;

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
                                  'sections' => $record['sections'],
                                  'subsections' => $record['subsections'],
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
        $data['hint_enable'] = (!empty($data['hint']))?'true':'false';

        $data['comment_enable'] = (!empty($data['comment']))?'true':'false';  
        $data['json'] = $content_layout;
        save_content_piece($data);
        
}




