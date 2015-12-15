module.exports = (grunt) ->

    require('time-grunt')(grunt)

    grunt.initConfig

        pkg : grunt.file.readJSON "package.json"

        exec :
            themeJS :
                command : 'coffee -w -c -b ../js/'
            SPAJS :
                command : 'coffee -w -c -b ../SPA/'

        # LESS lint.
        # Verifies if less file are proper. Checks for any unused variables
        # invalid/bad selectors
        lesslint :
            options :
                csslint :
                    "known-properties" : false

            themeLess :
                src : ["../css/*.less", "../css/**/*.less"]


        # JS Linting
        # JSHint is a program that flags suspicious usage in programs written in JavaScript.
        # Tracks unsed variables. JS common errors. Configuration files is .jshintrc
        # List of ignored files/folders is stored in .jshintignore
        jshint :
            options :
                jshintrc : '.jshintrc'
                jshintignore : '.jshintignore'
            themeJS : []
            SPAJS : []

        # CoffeeLint
        coffeelint :
            options :
                configFile : 'coffeelint.json'
            themeCoffee :
                files :
                    src : ["../js/*.coffee", "../js/**/*.coffee"]
            SPACoffee :
                files :
                    src : ["../SPA/*.coffee", "../SPA/**/*.coffee"]


    # PHP Code Sniffer
    # detects violations of a defined set of coding standards
    # It is an essential development tool that ensures your code remains clean and consistent.
    # It can also help prevent some common semantic errors made by developers.
        phpcs :
            options :
                standard : "Wordpress"
            theme :
                dir : ["../*.php", "../**/*.php"]
            plugins :
                dir : []


    # PHP Unit
    # PHPUnit is a programmer-oriented testing framework for PHP.
    # It is an instance of the xUnit architecture for unit testing frameworks.
        phpunit :
            options :
                bootstrap : "../../../../tests/includes/bootstrap.php"
                colors : true
            theme :
                classes :
                    dir : ["../tests"]
            plugins :
                classes :
                    dir : []


    # Karma js unit testing
    # Automatically builds and maintains your spec runner and runs your tests headlessly through PhantomJS.
        karma :
            options :
                runnerPort : 9999
                singleRun : true
            themeJS :
                configFile : "../js/tests/karma.conf.js"
            SPAJS :
                configFile : "../SPA/tests/karma.conf.js"


    # "TODO" list
    # Find TODO, FIXME and NOTE inside project files
    # Developers can add TODO comments in their code when they need to leave something behind
    # Running this grunt will give the full list of todo list item through out the project source code
        todo :
            options :
                marks : [
                    (pattern : "TODO", color : "#F47605")
                    (pattern : "FIXME", color : "red")
                    (pattern : "NOTE", color : "blue")
                ]
            lessTODO :
                src : ["../css/*.less", "../css/**/*.less"]
            phpTODO :
                src : ["../*.php", "../**/*.php"]
            themeJSTODO :
                src : ["../js/*.coffee", "../js/**/*.coffee"]
            SPATODO :
                src : ["../SPA/*.coffee", "../SPA/**/*.coffee"]


    # Less => Css
    # Compiles all *.styles.less files to respective css files for production
    # Uses *.styles.less pattern to detect files to compile
        less :
            production :
                options :
                    paths : ["../css"]
                    cleancss : true
                    compress : true
                files : [
                    expand : true
                    cwd : "../css"
                    src : ["../css/*.styles.less"]
                    dest : "../css"
                    ext : ".styles.min.css"
                ]


    # Clean production folder before new files are copied over
        clean :
            prevBuilds :
                src : ["../css/*.styles.min.css", "../js/*.scripts.min.js", "../SPA/*.spa.min.js"]
                options :
                    force : true
            production :
                src : ["../production/*"]
                options :
                    force : true


    # Copy all production resources to "production" folder
        copyto :
            production :
                files : [
                    (
                        cwd : "../css"
                        src : ["*.styles.min.css"]
                        dest : "../production/css/"
                    ),
                    (
                        cwd : "../js"
                        src : [ "*.scripts.min.js"]
                        dest : "../production/js/"
                    ),
                    (
                        cwd : "../SPA"
                        src : [ "*.spa.min.js"]
                        dest : "../production/spa/"
                    )
                ]


    # Cross OS notifier
        notify :
            readyToDeploy :
                options :
                    title : "Code is ready to deploy"


    # Load NPM's via matchdep
    require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks

    # Requirejs Optimizer
    # Optimizes the requirejs modules with r.js
    grunt.registerTask "themeJSOptimize", "Optimize the theme JS files", ->
        files = grunt.file.expand "../js/*.scripts.js"

        if files.length is 0
            grunt.log.write "No files to optimize"
            return

        subTasks = getRequireJSTasks files, "scripts"

        # set the tasks
        grunt.config.set 'requirejs', subTasks
        grunt.task.run "requirejs"


    # Requirejs Optimizer
    # Optimizes the requirejs modules with r.js
    grunt.registerTask "themeSPAOptimize", "Optimize the SPA JS files", ->
        files = grunt.file.expand "../SPA/*.spa.js"

        if files.length is 0
            grunt.log.write "No files to optimize"
            return

        subTasks = getRequireJSTasks files, "spa"

        # set the tasks
        grunt.config.set 'requirejs', subTasks
        grunt.task.run "requirejs"


    # Custom task to create a git commit
    grunt.registerTask "gitCommit", "Commit production files", ->



        # create the subtasks for the require js optimizer
    getRequireJSTasks = (files, pattern)->
        subTasks = {}
        folderName = if pattern is 'scripts' then 'js' else 'SPA'
        originalExtension = "#{pattern}.js"
        optimizedExtension = "#{pattern}.min.js"
        files.map (file)->
            config =
                baseUrl : "../#{folderName}/"
                mainConfigFile : "../#{folderName}/require.config.js"
                name : "../#{folderName}/bower_components/almond/almond.js"
                include : [file]
                out : file.replace originalExtension, optimizedExtension
                findNestedDependencies : true
                #optimize : 'none' # uncomment for testing minified JS

            # get the module/page name
            file = file.replace "../#{folderName}/", ""
            name = file.replace ".#{pattern}.js", ""

            # set the task
            subTasks[name] = {}
            subTasks[name]["options"] = config

        subTasks

    grunt.registerTask "compile","Compile coffee file watcher" ,(args)->
        grunt.task.run "exec:#{args}"


    # helper commands to run series of tasks
    grunt.registerTask "validate", ["lesslint", "coffeelint" , "jshint", "phpcs"]
    grunt.registerTask "runtests", ["karma", "phpunit"]
    grunt.registerTask "optimize", ["less", "themeJSOptimize", "themeSPAOptimize"]
    grunt.registerTask "build",
      [ "themeJSOptimize", "themeSPAOptimize", "less", "clean:production", "copyto", "clean:prevBuilds"]

    grunt.registerTask "deploy", ["validate", "runtests", "optimize", "clean", "copyto", "notify:readyToDeploy"]