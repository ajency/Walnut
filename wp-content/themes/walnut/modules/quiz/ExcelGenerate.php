
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
      

        $quiz_data = array();
        $quiz_data = get_excel_quiz_report_data($quiz_id, $division);

        //$objPHPExcel->getActiveSheet()->fromArray($quiz_data['student_ids'], NULL, 'D8');
        $start = 9;
        foreach ($quiz_data['content_ids'] as $key => $content_ids) {

            $objPHPExcel->getActiveSheet()->setCellValue('A'.$start, $content_ids['name']);
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$start, $content_ids['link'])->getCellByColumnAndRow(1,$start)->getHyperlink()->setUrl($content_ids['link']);
            $content_ids_order[] = $content_ids['id'];
            $objPHPExcel->getActiveSheet()->setCellValue('C'.$start, $content_ids['correct_answer']);
            
            $start++;
        }



        foreach ($quiz_data['student_ids'] as $key => $student_data) {
            $student_names[] =$student_data['student_name'];
            $content_id_taken[] = $student_data['content_ids'];
        }

        foreach ($content_id_taken as $key_ta => $taken) {
            if(count($taken) > 0){
                    usort($taken, function ($a, $b) use ($content_ids_order) {
                        $pos_a = array_search($a['content_id'], $content_ids_order);
                        $pos_b = array_search($b['content_id'], $content_ids_order);
                        return $pos_a - $pos_b;
                    });

                foreach ($taken as $k_indi => $indi) {
                   $taken[$k_indi] = $indi['answer_id'];
                }

                $data_id[$key_ta] =$taken;
            }else{
                $data_id[$key_ta] =$taken;
            }

        }

            $total = count($content_ids_order);

            $array_data = array();

            foreach ($data_id as $key => $value) {
                if(empty($value))
                    for($i=0;$i<$total;$i++){
                    $data_id[$key][$i] = '-';
                }
                else{
                    foreach ($value as $k1 => $value1) {
                        if(empty($value1))
                            $data_id[$key][$k1] = '-';
                    }
                }
            }

            foreach ($data_id as $y => $row_entry) {
                foreach ($row_entry as $ky => $entry) {
                    //if($entry == null)
                        //$array[$ky][$y] = '';
                    //else
                        $array[$ky][$y] =  $entry;
                       // $start ++;
                }
                $array_data = $array;
                
            }




        $objPHPExcel->getActiveSheet()->fromArray($student_names, NULL, 'D8');

        $objPHPExcel->getActiveSheet()->setCellValue('B1', $quiz_data['title']);
        $objPHPExcel->getActiveSheet()->setCellValue('B2', $quiz_data['class']);
        $objPHPExcel->getActiveSheet()->setCellValue('B3', $quiz_data['textbook_name']);
        $objPHPExcel->getActiveSheet()->setCellValue('B4', $quiz_data['chapter_name']);
        $objPHPExcel->getActiveSheet()->setCellValue('B5', $quiz_data['duration'].' mins');
        $objPHPExcel->getActiveSheet()->setCellValue('B6', $quiz_data['marks']);

        $total_questions = count($array_data);

        $start = 9;
        $end_total = (int)$total_questions + $start;
            foreach ($array_data as $key => $ans_data) {
                $objPHPExcel->getActiveSheet()->fromArray($ans_data, NULL, 'D'.$start);
                $start ++;
            }
            

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