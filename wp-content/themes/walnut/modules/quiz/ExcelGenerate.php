
<?php
class ExportExcel {

    public function excel($quiz_id, $division){

        // Create new PHPExcel object
        $objPHPExcel = new PHPExcel();

        // Set document properties
        $objPHPExcel->getProperties()->setCreator("Ajency")
        							 ->setLastModifiedBy("Ajency")
        							 ->setTitle("Class Report Template")
        							 ->setSubject("Excel upload")
        							 ->setDescription("Class Report Excel")
        							 ->setKeywords("class test")
        							 ->setCategory("class test"); 

        // Add some data

        
        $objPHPExcel->setActiveSheetIndex(0);


                $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue('A1', 'Test title')
                    ->setCellValue('A2', 'Class')
                    #->setCellValue('A3', 'Division')
                    ->setCellValue('A3', 'Textbook')
                    ->setCellValue('A4', 'Chapter')
                    ->setCellValue('A5', 'Duration')
                    ->setCellValue('A6', 'Marks')

                    ->setCellValue('A8', 'Question title')
                    ->setCellValue('B8', 'Link')
                    ->setCellValue('C8', 'Correct Answer');

        // $table_header_list = array(           
        //     );
        // $objPHPExcel->getActiveSheet()->fromArray($header_list, NULL, 'B4');


        $quiz_data = array();
        $quiz_data = get_excel_quiz_report_data($quiz_id, $division);

        $objPHPExcel->getActiveSheet()->setCellValue('B1', $quiz_data['title']);
        $objPHPExcel->getActiveSheet()->setCellValue('B2', $quiz_data['class']);
        $objPHPExcel->getActiveSheet()->setCellValue('B3', $quiz_data['textbook_name']);
        $objPHPExcel->getActiveSheet()->setCellValue('B4', $quiz_data['chapter_name']);
        $objPHPExcel->getActiveSheet()->setCellValue('B5', $quiz_data['duration'].' mins');
        $objPHPExcel->getActiveSheet()->setCellValue('B6', $quiz_data['marks']);






        // $textbk_name = textbook_name($text_id);
        //  foreach ($textbk_name as $textbook) {
        //         $text_name = $textbook->name;
        //     }


        // for ($i = 2; $i <= 10; $i++)
        // {
        //     $objPHPExcel->getActiveSheet()->setCellValue('B' . $i, $text_id);
        //     $objPHPExcel->getActiveSheet()->setCellValue('A' . $i, $text_name);
        // }


        // //Chapter Sheet
        // $chapterSheet = new PHPExcel_Worksheet($objPHPExcel);
        // $objPHPExcel->addSheet($chapterSheet);
        // $chapterSheet->setTitle('Chapter');
        // $chapterSheet->fromArray($data_chap, null, 'A1');
        // $chapterSheet->setSheetState(PHPExcel_Worksheet::SHEETSTATE_HIDDEN);


        // $chapter_data = array();
        // $chapter_data = get_chapters($text_id);

        // $i='2';
        // $chap_ids = '';
        // foreach ($chapter_data as $chapter) {
        //     $chapter_name = $chapter->name;
        //     $chapter_id = $chapter->term_id;

        //     $chapterSheet->setCellValue("A{$i}", "{$chapter_name}");
        //     $chapterSheet->setCellValue("B{$i}", "{$chapter_id}");
        //     $i+=1;
        //     $chap_ids = $chap_ids.",".$chapter_id;

        // }
        // $last = $i-1;

        // for ($i = 2; $i <= 10; $i++)
        // {

        //     $objValidation2 = $objPHPExcel->getActiveSheet()->getCell('C' . $i)->getDataValidation();
        //     $objValidation2->setType(PHPExcel_Cell_DataValidation::TYPE_LIST);
        //     $objValidation2->setErrorStyle(PHPExcel_Cell_DataValidation::STYLE_INFORMATION);
        //     $objValidation2->setAllowBlank(true);
        //     $objValidation2->setShowInputMessage(true);
        //     $objValidation2->setShowDropDown(true);
        //     $objValidation2->setPromptTitle('Pick from list');
        //     //$objValidation2->setReadDataOnly(true);
        //     $objValidation2->setPrompt('Please pick Chapter from the drop-down list.');
        //     $objValidation2->setErrorTitle('Input error');
        //     $objValidation2->setError('Value is not in list');
        //     $objValidation2->setFormula1('Chapter!$A$2:$A'.$last.'');
        //     $objPHPExcel->getActiveSheet()->setCellValue('D' . $i,'=VLOOKUP(C' .$i. ',Chapter!$A$2:$B$' .$last. ',2,0)');

        // }


        // Redirect output to a client’s web browser (Excel5)

        header('Content-Type: application/vnd.ms-excel;charset=utf-8');
        header('Content-Disposition: attachment;filename="quiz_report'.time().'.xls"');
        header('Cache-Control: max-age=0');
        // If you're serving to IE 9, then the following may be needed
        header('Cache-Control: max-age=1');
        // If you're serving to IE over SSL, then the following may be needed
        header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
        header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
        //header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
        //header ('Pragma: public'); // HTTP/1.0
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        //$objWriter->setPreCalculateFormulas(TRUE);
        /*$objWriter->save(get_home_path().'wp-content/uploads/q_upload.xls');
        return get_home_path().'wp-content/uploads/q_upload.xls';*/

        ob_clean();
         $objWriter->save('php://output');
         exit;
        

}
}

?>