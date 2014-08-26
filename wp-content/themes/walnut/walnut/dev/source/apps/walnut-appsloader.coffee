define [
    'apps/login/loginapp'
    'apps/header/headerapp'
    'apps/left-nav/leftnavapp'
    'apps/teachers-dashboard/teachers-dashboard-app'

    #single view of teaching module & list of teaching modules
    'apps/content-modules/content-modules-app'

    #single view of quiz and listing of quizzes & take a quiz
    'apps/quiz-modules/quiz-module-app'
    
    #the main content area where the question/content piece will be displayed
    #used in both content piece preview and take a question/ quiz
    'apps/content-board/controller'

    'apps/take-module-item/take-module-item-app'

    #redirect here if user doesnt have permissions
    'apps/no-permissions/app'

    ## APPS SPECIFIC TO CONTENT SITE ONLY ##

    #list of all textbooks -> list of chapters
    'apps/textbooks/app'
    
    #add/edit of teaching modules & quizzes
    'apps/edit-module/module-edit-controller'

    #list of content pieces for preview, clone etc
    'apps/content-pieces/content-pieces-app'

    #custom messages edit popups for add/edit quiz
    'apps/popup-dialog/single-edit-popup/single-edit-popup-controller'

    #'apps/default-router/default-app'
], ->