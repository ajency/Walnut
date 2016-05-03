
<?php
//require_once('../classes/PHPExcel.php');
class ExportExcel {

public function excel(){
 
 //require_once('../classes/PHPExcel.php');
//include '../classes/PHPExcel.php';
// Create new PHPExcel object
$objPHPExcel = new PHPExcel();
//CONST TEXT_DROP = "";

$data =  array(
		array(
            'textbook_name',
            'textbook_id'
      

      )
    );

$data_chap =  array(
        array(
            'textbook_id',
            'chapter_id',
            'chapter_name'

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
            ->setCellValue('A1', 'Question')
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


//TextBook Sheet
$textbookSheet = new PHPExcel_Worksheet($objPHPExcel);
$objPHPExcel->addSheet($textbookSheet);
$textbookSheet->setTitle('Textbook');
$textbookSheet->fromArray($data, null, 'A1');
//$textbookSheet->setSheetState(PHPExcel_Worksheet::SHEETSTATE_HIDDEN);

/*for ($i = 2; $i <= 11; $i++) {

    $textbookSheet->setCellValue("A{$i}", "List Item {$i}");
    //$textbookSheet->setCellValue(get_textbooks());
}*/
//get textbook name from db
$textbooks = array();
$textbooks = textbook_data();

 $i='2';
 $textbook_ids = '';
 foreach ($textbooks as $textbook) {
 // $myfile = fopen(get_home_path()."log.txt", "a") or die("Unable to open file!");
  $name = $textbook->name;
  $id = $textbook->term_id;
  $textbookSheet->setCellValue("A{$i}", "{$name}");
  $textbookSheet->setCellValue("B{$i}", "{$id}");
  $i+=1;
  $textbook_ids = $id.",".$textbook_ids;
 // fwrite($myfile, "\n". $id . "\n");
 // fwrite($myfile, "\n". $name . "\n");
 

}
$last = $i-1;
// fclose($myfile); 
//
//$textbook = fetch_textbooks();

/*$textbook = implode(',', $textbook);*/

/*$rowCount = 1;
while($row = mysql_fetch_array($result)){
    $objPHPExcel->getActiveSheet()->SetCellValue('A'.$rowCount, $row['name']);
    $objPHPExcel->getActiveSheet()->SetCellValue('B'.$rowCount, $row['age']);
    $rowCount++;
}*/
for ($i = 2; $i <= 10; $i++)
{

$objValidation2 = $objPHPExcel->getActiveSheet()->getCell('C' . $i)->getDataValidation();
$objValidation2->setType(PHPExcel_Cell_DataValidation::TYPE_LIST);
$objValidation2->setErrorStyle(PHPExcel_Cell_DataValidation::STYLE_INFORMATION);
$objValidation2->setAllowBlank(true);
$objValidation2->setShowInputMessage(true);
$objValidation2->setShowDropDown(true);
$objValidation2->setPromptTitle('Pick from list');
$objValidation2->setPrompt('Please pick a textbook from the drop-down list.');
$objValidation2->setErrorTitle('Input error');
$objValidation2->setError('Value is not in list');
$objValidation2->setFormula1('Textbook!$A$2:$A'.$last.'');
//$objValidation2->setCellValue('D$2',$textbookSheet);
}


$objPHPExcel->getActiveSheet()->setCellValue('D3','=VLOOKUP(C3,Textbook!$A$2:$B$61,2,0)');

/*for ($i = 2; $i <= 10; $i++)
{
$objPHPExcel->getActiveSheet()->setCellValue('D{$i}','=VLOOKUP(C'.$i.',Textbook!$A.'$i.':$B.'$last.',2,0)');
}*/
//setCellValue('C2','=VLOOKUP(A9;A3:B32;2)');

//Chapter Sheet
$chapterSheet = new PHPExcel_Worksheet($objPHPExcel);
$objPHPExcel->addSheet($chapterSheet);
$chapterSheet->setTitle('Chapter');
$chapterSheet->fromArray($data_chap, null, 'A1');
//$textbookSheet->setSheetState(PHPExcel_Worksheet::SHEETSTATE_HIDDEN);


 $myfile = fopen(get_home_path()."log.txt", "a") or die("Unable to open file!");
$chapter_data = array();
$chapter_data = get_chapters($textbook_ids);

$i='2';
foreach ($chapter_data as $chapter) {
 $chapter_name = $chapter->name;
 $chapter_id = $chapter->term_id;
 $textbook_id = $chapter->parent; 

 $chapterSheet->setCellValue("A{$i}", "{$chapter_id}");
  $chapterSheet->setCellValue("B{$i}", "{$textbook_id}");
    $chapterSheet->setCellValue("C{$i}", "{$chapter_name}");
$i+=1;


}
$last = $i-1;

/*for ($i = 2; $i <= 10; $i++)
{

$objValidation2 = $objPHPExcel->getActiveSheet()->getCell('E' . $i)->getDataValidation();
$objValidation2->setType(PHPExcel_Cell_DataValidation::TYPE_LIST);
$objValidation2->setErrorStyle(PHPExcel_Cell_DataValidation::STYLE_INFORMATION);
$objValidation2->setAllowBlank(true);
$objValidation2->setShowInputMessage(true);
$objValidation2->setShowDropDown(true);
$objValidation2->setPromptTitle('Pick from list');
$objValidation2->setPrompt('Please pick a textbook from the drop-down list.');
$objValidation2->setErrorTitle('Input error');
$objValidation2->setError('Value is not in list');
$objValidation2->setFormula1('Chapter!$C$2:$C'.$last.'');
//$objValidation2->setCellValue('D$2',$textbookSheet);
}*/
// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);
// Redirect output to a client’s web browser (Excel5)
//$xlfilename = time();

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
//if ($this->_hasCharts) $objWriter->setIncludeCharts(TRUE);
$objWriter->setPreCalculateFormulas(TRUE);
$objWriter->save('01simple.xls');
//$objWriter->save('php://output');
//$myfile = fopen(get_home_path()."01simple.xls", "w");
//fclose($myfile);
return "01simple.xls";
}
}

?>