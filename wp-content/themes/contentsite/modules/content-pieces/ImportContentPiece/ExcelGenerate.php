
<?php
class ExportExcel {

    public function excel($text_id){

        // Create new PHPExcel object
        $objPHPExcel = new PHPExcel();
        $data_chap =  array(
                array(
                    'chapter_name',
                    'chapter_id'

              )
            );

        $data_sect =  array(
                array(
                    'section_name',
                    'section_id'
                    


              )
            );

        $data_subsect =  array(
                array(
                    'sub_section_name',
                    'sub_section_id'
                    


              )
            );

        // Set document properties
        $objPHPExcel->getProperties()->setCreator("Ajency")
        							 ->setLastModifiedBy("Ajency")
        							 ->setTitle("Question Template")
        							 ->setSubject("Excel upload")
        							 ->setDescription("Excel for questions upload")
        							 ->setKeywords("mcq questions chapters")
        							 ->setCategory("mcq"); 

        // Add some data
        $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue('A1', 'Textbook_name')
                    ->setCellValue('B1', 'Question Image')
                    ->setCellValue('C1', 'Textbook_name')
                    ->setCellValue('D1', 'Textbook')
                    ->setCellValue('E1', 'Chapter_name')
                    ->setCellValue('F1', 'Chapter')
                    ->setCellValue('G1', 'Sections_name')
                    ->setCellValue('H1', 'Sections')
                    ->setCellValue('I1', 'Subsections_name')
                    ->setCellValue('J1', 'Subsections')
                    ->setCellValue('K1', 'Total Marks')
                    ->setCellValue('L1', 'Multiple Correct Answers')
                    ->setCellValue('M1', 'Correct Answer')
                    ->setCellValue('N1', 'Option1')
                    ->setCellValue('O1', 'Option1 Image')
                    ->setCellValue('P1', 'Mark1')
                    ->setCellValue('Q1', 'Option2')
                    ->setCellValue('R1', 'Option2 Image')
                    ->setCellValue('S1', 'Mark2')
                    ->setCellValue('T1', 'Option3')
                    ->setCellValue('U1', 'Option3 Image')
                    ->setCellValue('V1', 'Mark3')
                    ->setCellValue('W1', 'Option4')
                    ->setCellValue('X1', 'Option4 Image')
                    ->setCellValue('Y1', 'Mark4')
                    ->setCellValue('Z1', 'Option5')
                    ->setCellValue('AA1', 'Option5 Image')
                    ->setCellValue('AB1', 'Mark5')
                    ->setCellValue('AC1', 'Option6')
                    ->setCellValue('AD1', 'Option6 Image')
                    ->setCellValue('AE1', 'Mark6')
                    ->setCellValue('AF1', 'Columns')
                    ->setCellValue('AG1', 'Level')
                    ->setCellValue('AH1', 'Tags')
                    ->setCellValue('AI1', 'Hint')
                    ->setCellValue('AJ1', 'Comment')
                    ->setCellValue('AK1', 'Duration');

        // Rename worksheet
        $objPHPExcel->getActiveSheet()->setTitle('Question');
        $objPHPExcel->getActiveSheet()->getColumnDimension ('D')->setVisible(false);
        //$objPHPExcel->getActiveSheet()->getColumnDimension ('F')->setVisible(false);
        //$objPHPExcel->getActiveSheet()->getColumnDimension ('H')->setVisible(false);
        //$objPHPExcel->getActiveSheet()->getColumnDimension ('J')->setVisible(false);


        $textbk_name = array();
        $textbk_name = textbook_name($text_id);
         foreach ($textbk_name as $textbook) {
                $text_name = $textbook->name;
            }


        for ($i = 2; $i <= 10; $i++)
        {
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $i, $text_id);
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $i, $text_name);
        }


        //Chapter Sheet
        $chapterSheet = new PHPExcel_Worksheet($objPHPExcel);
        $objPHPExcel->addSheet($chapterSheet);
        $chapterSheet->setTitle('Chapter');
        $chapterSheet->fromArray($data_chap, null, 'A1');
        $chapterSheet->setSheetState(PHPExcel_Worksheet::SHEETSTATE_HIDDEN);


        $chapter_data = array();
        $chapter_data = get_chapters($text_id);

        $i='2';
        $chap_ids = '';
        foreach ($chapter_data as $chapter) {
            $chapter_name = $chapter->name;
            $chapter_id = $chapter->term_id;

            $chapterSheet->setCellValue("A{$i}", "{$chapter_name}");
            $chapterSheet->setCellValue("B{$i}", "{$chapter_id}");
            $i+=1;
            $chap_ids = $chap_ids.",".$chapter_id;

        }
        $last = $i-1;

        for ($i = 2; $i <= 10; $i++)
        {

            $objValidation2 = $objPHPExcel->getActiveSheet()->getCell('E' . $i)->getDataValidation();
            $objValidation2->setType(PHPExcel_Cell_DataValidation::TYPE_LIST);
            $objValidation2->setErrorStyle(PHPExcel_Cell_DataValidation::STYLE_INFORMATION);
            $objValidation2->setAllowBlank(true);
            $objValidation2->setShowInputMessage(true);
            $objValidation2->setShowDropDown(true);
            $objValidation2->setPromptTitle('Pick from list');
            //$objValidation2->setReadDataOnly(true);
            $objValidation2->setPrompt('Please pick Chapter from the drop-down list.');
            $objValidation2->setErrorTitle('Input error');
            $objValidation2->setError('Value is not in list');
            $objValidation2->setFormula1('Chapter!$A$2:$A'.$last.'');
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $i,'=VLOOKUP(E' .$i. ',Chapter!$A$2:$B$' .$last. ',2,0)');

        }

        //Section Sheet
        $sectionSheet = new PHPExcel_Worksheet($objPHPExcel);
        $objPHPExcel->addSheet($sectionSheet);
        $sectionSheet->setTitle('Section');
        $sectionSheet->fromArray($data_sect, null, 'A1');
        $sectionSheet->setSheetState(PHPExcel_Worksheet::SHEETSTATE_HIDDEN);


        $section_data = array();
        $section_data = get_sections($chap_ids);
        $i='2';
        $section_ids = '';
        foreach ($section_data as $section) {

            $section_name = $section->chapter_name ." > ". $section->name;
            $section_id = $section->term_id;

            $sectionSheet->setCellValue("A{$i}", "{$section_name}");
            $sectionSheet->setCellValue("B{$i}", "{$section_id}");
            $i+=1;
            $section_ids = $section_id.",".$section_ids;
        }
        $last = $i-1;

        for ($i = 2; $i <= 10; $i++)
        {

            $objValidation2 = $objPHPExcel->getActiveSheet()->getCell('G' . $i)->getDataValidation();
            $objValidation2->setType(PHPExcel_Cell_DataValidation::TYPE_LIST);
            $objValidation2->setErrorStyle(PHPExcel_Cell_DataValidation::STYLE_INFORMATION);
            $objValidation2->setAllowBlank(false);
            $objValidation2->setShowInputMessage(true);
            $objValidation2->setShowDropDown(true);
            $objValidation2->setPromptTitle('Pick from list');
            $objValidation2->setPrompt('Please pick a Section from the drop-down list.');
            $objValidation2->setErrorTitle('Input error');
            $objValidation2->setError('Value is not in list');
            $objValidation2->setFormula1('Section!$A$2:$A'.$last.'');
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $i,'=VLOOKUP(G' .$i. ',Section!$A$2:$B$' .$last. ',2,0)');
        }


        //Sub-section Sheet
        $subsectionSheet = new PHPExcel_Worksheet($objPHPExcel);
        $objPHPExcel->addSheet($subsectionSheet);
        $subsectionSheet->setTitle('SubSection');
        $subsectionSheet->fromArray($data_subsect, null, 'A1');
        $subsectionSheet->setSheetState(PHPExcel_Worksheet::SHEETSTATE_HIDDEN);


        $subsection_data = array();
        $subsection_data = get_sections($section_ids);
        $i='2';
        foreach ($subsection_data as $section) {

            $section_name = $section->chapter_name ." > ". $section->name;
            $section_id = $section->term_id;

            $subsectionSheet->setCellValue("A{$i}", "{$section_name}");
            $subsectionSheet->setCellValue("B{$i}", "{$section_id}");
            $i+=1;
        }
            $last = $i-1;
            if($last < 2){
            $last = 2;
            }

        for ($i = 2; $i <= 10; $i++)
        {

            $objValidation2 = $objPHPExcel->getActiveSheet()->getCell('I' . $i)->getDataValidation();
            $objValidation2->setType(PHPExcel_Cell_DataValidation::TYPE_LIST);
            $objValidation2->setErrorStyle(PHPExcel_Cell_DataValidation::STYLE_INFORMATION);
            $objValidation2->setAllowBlank(false);
            $objValidation2->setShowInputMessage(true);
            $objValidation2->setShowDropDown(true);
            $objValidation2->setPromptTitle('Pick from list');
            $objValidation2->setPrompt('Please pick a Sub-section from the drop-down list.');
            $objValidation2->setErrorTitle('Input error');
            $objValidation2->setError('Value is not in list');
            $objValidation2->setFormula1('SubSection!$A$2:$A'.$last.'');
            $objPHPExcel->getActiveSheet()->setCellValue('J' . $i,'=VLOOKUP(I' .$i. ',SubSection!$A$2:$B$' .$last. ',2,0)');
        }

        // Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);
        // Redirect output to a client’s web browser (Excel5)

        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="01simple.xls"');
        header('Cache-Control: max-age=0');
        // If you're serving to IE 9, then the following may be needed
        header('Cache-Control: max-age=1');
        // If you're serving to IE over SSL, then the following may be needed
        header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
        header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
        header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
        header ('Pragma: public'); // HTTP/1.0
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->setPreCalculateFormulas(TRUE);
        $objWriter->save('question_upload.xls');
        return "question_upload.xls";
}
}

?>