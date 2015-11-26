define [
    'apps/login/loginapp'
    'apps/header/headerapp'
    'apps/left-nav/leftnavapp'
    'apps/teachers-dashboard/teachers-dashboard-app'

    #single view of teaching module & list of teaching modules
    'apps/content-modules/content-modules-app'

    #single view of quiz and listing of quizzes & take a quiz
    'apps/quiz-modules/quiz-module-app'
    
    #create/update/view/list student trainig modules
    'apps/student-training-module/app'
	
    #view/list student trainig modules
    'apps/student-app-training-modules/app'
	
    #the main content area where the question/content piece will be displayed
    #used in both content piece preview and take a question/ quiz
    'apps/content-board/controller'

    'apps/take-module-item/take-module-item-app'

    #list of modules to check status and send mails if completed in class
    'apps/admin-content-modules/app'

    'apps/quiz-reports/app'

    #list of all textbooks -> list of chapters
    'apps/textbooks/app'
    
    #list of all users in school
    'apps/users/app'
	
    #redirect here if user doesnt have permissions
    'apps/no-permissions/app'
	
    #route not found
    'apps/default-router/default-app'
], ->