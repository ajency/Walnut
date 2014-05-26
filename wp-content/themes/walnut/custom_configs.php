<?php
for($i=1; $i<=12; $i++){
    $classids[$i]['id']=$i;
    if($i==1)
        $classids[$i]['label']='Junior KG';
    elseif($i==2)
        $classids[$i]['label']='Senior KG';
    else
        $classids[$i]['label']='Class '.($i-2);
}
    
$GLOBALS['class_ids']=$classids;

$GLOBALS['all_subjects']=array('English',
                                'Hindi',
                                'Maths',
                                'Physics',
                                'Chemistry',
                                'Biology',
                                'History',
                                'Geography',
                                'Computers',
                                'P.T',
                                'Art',
                                'Music',
                                'Life Skill');

$GLOBALS['chorus_options']= array(
    'few'           =>'Very Few',
    'one-fourth'    =>'1/4th of the Class',
    'half'          =>'Half the Class',
    'three-fourth'  =>'3/4 the Class',
    'full'          =>'Full Class'
);