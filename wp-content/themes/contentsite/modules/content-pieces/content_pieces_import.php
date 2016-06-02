<?php

function theme_add_csv_components($defined_csv_components){

   $defined_csv_components['mcq'] = array(
      'Question', 'Question Image',
      'Textbook_name', 'Textbook', 'Chapter',
      'Chapter_name', 'Sections', 'Sections_name', 
      'Subsections', 'Subsections_name',
      'Total Marks', 'Multiple Correct Answers', 'Correct Answer',
      'Option1','Option1 Image','Mark1',
      'Option2','Option2 Image','Mark2',
      'Option3','Option3 Image','Mark3',
      'Option4','Option4 Image','Mark4',
      'Option5','Option5 Image','Mark5',
      'Option6','Option6 Image','Mark6',
      'Columns','Level','Tags','Hint','Comment','Duration'
    );

    return $defined_csv_components;

}
add_filter('add_csv_components_filter','theme_add_csv_components',10,1);

function import_csv_mcq_record($import_response,$record){
    file_put_contents("abc.txt", $import_response);
    require_once 'ImportContentPiece/ImportMCQ.php';
    $importMCQ = new ImportMCQ($record);
    $response  = $importMCQ->import($import_response);
    return $response;

 }

add_filter('ajci_import_record_mcq','import_csv_mcq_record',10,2);
