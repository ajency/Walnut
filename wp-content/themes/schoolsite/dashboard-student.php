<?php
/*
  Template Name: Dashboard Student
 */
?>
<?php
	get_header('student');
?>
<h1><?php echo bloginfo('url'); ?></h1>
<?php       
            $textbooks_res = student_fetch_textbooks();
            $textbooks     = $textbooks_res['data'];
//            pr($textbooks);
            $textbook_ids  = array();
            foreach ($textbooks as $textbook) {
                $textbook_ids[]= $textbook->term_id;
            }
            $upcoming_quizes = student_my_upcoming_quizes($textbook_ids);
            $textbook_id_to_name_map = array();
            foreach ($textbooks as $key => $value) {
                $textbook_id_to_name_map[$value->term_id] = 0;
            }
            foreach ($upcoming_quizes as $key => $quiz) {
                $textbook_id_to_name_map[$quiz['textbook_id']]++;
            }
           $textbook_id_vs_name = array();
 ?>           
<div class="container-fluid walnut-content">
                            <!-- Welcome text -->
                            <div class="row text-center">
                                <section class="col-sm-9 col-md-9 col-lg-9 quiz-subj">
                                    <div class="row">
                                        <div class="col-md-12 col-lg-12">
                                            <div class="intro text-center animated bounceIn">
                                                <p class="welcome-text">Welcome <?php echo student_fetch_name() ?>, you're awesome !</p>
                                
                                            </div>
                                        </div>
                                    </div>
                                        <div class="row">
                                        <?php foreach($textbooks as $textbook): ?>
                                            <div class="col-sm-6 col-md-6 col-lg-6">
                                                <div class="quiz-cards animated bounceIn">
                                                    <?php $notifications =  $textbook_id_to_name_map[$textbook->term_id] ?>
                                                    <?php $textbook_id_vs_name[$textbook->term_id]= $textbook->name; ?>
                                                   <?php if($notifications>0): ?>
                                                    <div class="notification"  data-scrollreveal="enter top and move 100px, wait 1.8s">
                                                        <?php echo $notifications ?>
                                                        <span>Look for the latest quizzes under list of upcoming quizzes on right</span>
                                                    </div>
                                                    <?php endif; ?>
                                                    <?php 
                                                    $str = $textbook->thumbnail;
                                                    $doc = new DOMDocument();
                                                    $doc->loadHTML($str);
                                                    $xpath = new DOMXPath($doc);
                                                    $src = $xpath->evaluate("string(//img/@src)");
                                                    ?>
                                                    <div class="quiz-img bg-1"><img src="<?php echo $src?>" class="img-responsive center-block"></div>
                                                    <div class="subj-detail">
                                                        <h2 class="subj-detail__heading"><?php echo $textbook->name ?></h2>
                                                        <p class="quiz-time">
                                                        <?php $res = student_last_quiz_taken_on($textbook->term_id); ?>
                                
                                                        <span>Last taken quiz</span>     
                                                        <?php if($res !=false):?>                                                       
                                                        <b><?php echo $res['date']; ?></b> at <b><?php echo $res['time']; ?></b>
                                                        <?php endif; ?>
                                                        <?php if($res ==false):?>                                                       
                                                        <b>Not Yet Taken</b>
                                                        <?php endif; ?>                                                        
                                                        </p>
                                                        <div class="questions">
                                                            <a href="<?php echo bloginfo('url'); ?>/quiz-listview-student?textbook_id=<?php echo $textbook->term_id ?>" class=""><img src="<?php echo STUDENT_ASSET_PATH ;?>images/q.png" class="img-responsive center-block"></a>
                                                            <a href="<?php echo bloginfo('url'); ?>/lecture-listview-student?textbook_id=<?php echo $textbook->term_id ?>"><img src="<?php echo STUDENT_ASSET_PATH ;?>images/l.png" class="img-responsive center-block"></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                        </div>
                                </section>
                                <aside class="col-sm-3 col-md-3 col-lg-3 sidebar">
                                    <div class="trapezoid">
                                        <div class="trapezoid__holder">
                                            <span><img src="<?php echo STUDENT_ASSET_PATH ;?>images/clock.png" class="img-responsive center-block"></span>
                                            <span>List of Upcoming Quizzes</span>
                                        </div>
                                    </div>
                                    <?php if(count($upcoming_quizes)==0):  ?>
                                        <h4 class="no-quiz">No Upcoming Quizzes</h4>                                        
                                    <?php endif; ?>    
                                    <?php foreach($upcoming_quizes as $upcoming_quiz):?>    
                                    <div class="quiz-schedule">
                                        <div class="calendar">
                                            <div class="month">
                                                <?php echo $upcoming_quiz['month']; ?>
                                            </div>
                                            <div class="date">
                                                <b> <?php echo $upcoming_quiz['day']; ?></b>
                                            </div>
                                            <div class="year">
                                                 <?php echo $upcoming_quiz['year']; ?>
                                            </div>
                                        </div>
                                        <div class="subj-time">
                                            <a href="<?php echo site_url() ?>/#students/dashboard/textbook/<?php echo $upcoming_quiz['textbook_id']?>/quiz/<?php echo $upcoming_quiz['quiz_id']?>">
                                            <p> <?php echo $textbook_id_vs_name[$upcoming_quiz['textbook_id']]; ?></p>
                                        
                                            </a>
                                        </div>
                                    </div>
                                <?php endforeach; ?>

                                </aside>
                            </div>
                        </div>
<?php
	get_footer('student');
?>