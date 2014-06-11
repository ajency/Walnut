<?php
for($i=1; $i<=15; $i++){
    $class_ids[$i]['id']=$i;
    if($i==1)
        $class_ids[$i]['label']='Nursery';
    elseif($i==2)
        $class_ids[$i]['label']='Junior KG';
    elseif($i==3)
        $class_ids[$i]['label']='Senior KG';
    else
        $class_ids[$i]['label']='Class '.($i-3);
}

$GLOBALS['classids']=$class_ids;

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