<?php
class ImportMCQ extends ImportContentPiece {

    public function __construct($data) {
        $this->set_object_values($data);
    }

    private function set_object_values($record){

        $section = $record[5];
        $sectionArray = explode(",",$section);

        $section = $record[7];
        $subsectionsArray = explode(",",$section);

        $this->question       = $record[8];
        $this->question_media_path = $record[9];
        $this->textbook       = $record[1];
        $this->chapter        = $record[3];
        $this->sections       = $sectionArray;
        $this->subsections    = $subsectionsArray;
        $this->totalmarks     = (int) $record[10];
        $this->multiple       = $record[11];
        $this->correct        = $record[12];
        $this->columns        = (int) $record[31];
        $this->level          = $record[32];
        $this->tags           = $record[33];
        $this->hint           = $record[34];
        $this->comment        = $record[35];
        $this->duration       = (int) $record[36];

        $this->options= array();
        $optionCols = array(13,16,19,22,25,28);
        foreach($optionCols as $optCol){
            if(!empty($record[$optCol]) || !empty($record[$optCol+1])){
                $this->options[]=array(
                                    'option' => $record[$optCol],
                                    'media'  => $record[$optCol+1],
                                    'mark'   => (int) $record[$optCol+2]
                                  );
              }
        }

        if(!$this->columns) $this->columns=2;

        if(!$this->duration) $this->duration=1;

        $this->multiple= (strtolower($this->multiple)=='yes')?'true':'false';

    }

    public function import($import_response){

        $validation = $this->validate_data();

        if($validation['is_valid']){
            $this->save_content_layout();
        }

        $import_response['imported'] = $validation['is_valid'];

        if(!$validation['is_valid'])
            $import_response['reason'] = $validation['reason'];

        return $import_response;
    }

    private function validate_data(){

        $validation= array();

        $validation['is_valid']=true;
        $validation['reason']=array();

        if(sizeof($this->options) < 2 )
        {
                $validation['is_valid']=false;
                $validation['reason'][] ='please enter at least two options.';
        }


        if( $this->totalmarks < 1 )
        {
                $validation['is_valid']=false;
                $validation['reason'][] ='total marks should be greater than or equal to one';
        }

        $validateArry = array('question'=>'please enter question.','correct' =>'Please enter correct vaues.');

        foreach ($validateArry as $columnname => $reason)
        {
            if(empty($this->$columnname))
            {
                    $validation['is_valid']= false;
                    $validation['reason'][] = $reason;

            }
        }

        $validateArry = array('textbook'=>'please enter textbookid as integer.', 'chapter'=>'Please enter chapter id as integer.');

        foreach ($validateArry as $columnname => $reason)
        {
            if(!is_numeric($this->$columnname))
            {
                    $validation['is_valid']= false;
                    $validation['reason'][] = $reason;

            }
        }

       $validation['reason'] = implode(" ",$validation['reason']);

       return $validation;
    }

    private function create_mcq_outline(){
        $data = array();
        $optionArray = array();
        $correctAnswerArray = array();
        $count = 0;

        $data['style'] = '';
        $data['draggable'] = 'true';
        $data['element'] = 'Mcq';
        foreach ($this->options as $arr)
        {
            if(!empty($arr['option']) || !empty($arr['media']))
            {
                $count++;
                $singleOptionArray = array();
                $singleOptionArray['optionNo'] = $count;
                $singleOptionArray['class'] = 12/ (int) $this->columns;
                $singleOptionArray['marks'] = $arr['mark'];
                $singleOptionArray['text'] = $arr['option'];
                array_push($optionArray,$singleOptionArray);
            }
        }

        $data['optioncount'] = $count;

        $data['columncount'] = $this->columns;

        $data['options'] = $optionArray;

        $correct = $this->correct;
        $correctArray = explode(",",$correct);

        $data['marks'] = $this->totalmarks;
        $data['multiple'] = $this->multiple;
        $data['correct_answer'] = $correctArray;
        $data['bottom_margin'] = '';
        $data['top_margin'] = '';
        $data['left_margin'] = '';
        $data['right_margin'] = '';
        $data['complete'] = 'true';

        $mcq_layout_id = save_content_element($data);
        return  $mcq_layout_id;

    }

    private function save_content_layout(){

        $content_layout = array();

        #create the question text element layout
        if(trim($this->question)){
            $question_text_id = $this->create_text_element($this->question);
            $questionTextElement= array('element' => 'Text','meta_id'=> $question_text_id);
            $content_layout[]=$questionTextElement;
        }
        _log($content_layout);
        #create the question media element layout
        if(trim($this->question_media_path)){
            $question_media = $this->create_media_element($this->question_media_path);
            if($question_media){
                $questionTextElement= array('element' => $question_media['type'],'meta_id'=> $question_media['id']);
                $content_layout[]=$questionTextElement;
            }
        }

        #create mcq layout element
        $mcq_outline_id   = (array) $this->create_mcq_outline();
        $data = array($mcq_outline_id);
        $options_layout = array();

        foreach ($this->options as $arr){
            $layout = array();
            if(!empty($arr['option'])){
                $OPTION_ID = $this->create_text_element($arr['option']);
                $layout[]=array(
                    'element' => 'Text',
                    'meta_id'=>$OPTION_ID
                );
           }
           if(!empty($arr['media'])){
            $media = $this->create_media_element($arr['media']);
            if($media){
                $layout[]=array('element' => $media['type'],'meta_id' => $media['id']);
            }
          }
           array_push($options_layout,$layout);
        }
        $mcq_layout=array('element' => 'Mcq','meta_id'=> $mcq_outline_id[0],'elements'=>$options_layout);
        $content_layout[]=$mcq_layout;

        $this->save_content_piece($content_layout);

    }
}
