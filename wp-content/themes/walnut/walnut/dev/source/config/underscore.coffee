##
##
##
define ['underscore', 'underscorestring'], (_) ->

    # overwrite template settings defaults to use mustache style
    _.templateSettings =
        evaluate: /\{\[([\s\S]+?)\]\}/g,
        interpolate: /\{\{([\s\S]+?)\}\}/g

    _.mixin _.str.exports()

    # mixin to add additional functionality underscore
    _.mixin

    #multiple app log message in a single statement
        logAppMsg: (msg...)->
            _.each arguments, (l, index)->
                console.log(l)

    #multiple app error message in a single statement
        logAppErr: (msg...)->
            _.each arguments, (l, index)->
                console.log(l)

    # id order array
        idOrder: (arr)->
            newArray = []
            _.each arr, (ele, index)->
                i = ele.split '-'
                newArray.push parseInt i[1]

            newArray

        stripslashes: (str) ->
            (str + "").replace /\\(.?)/g, (s, n1) ->
                switch n1
                    when "\\"
                        "\\"
                    when "0"
                        "\u0000"
                    when ""
                        ""
                    else
                        n1

    # convert hex and opacity to rgba format for css
        convertHex: (hex, opacity = 1)->
            hex = hex.replace '#', ''
            r = parseInt hex.substring(0, 2), 16
            g = parseInt hex.substring(2, 4), 16
            b = parseInt hex.substring(4, 6), 16

            result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')'


        getOrdinal : (n)->
            if parseFloat(n) is parseInt(n) and not _.isNaN(n)
                s=["th","st","nd","rd"]
                v=n%100
                return n+(s[(v-20)%10]||s[v]||s[0])
            
            return n

