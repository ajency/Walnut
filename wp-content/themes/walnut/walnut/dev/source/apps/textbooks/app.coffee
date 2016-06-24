define ['app'
        'controllers/region-controller'
        'apps/textbooks/list/listcontroller'
        'apps/textbooks/textbook-single/textbookcontroller'
        'apps/textbooks/textadd-popup/add-textbook-app'
        'apps/textbooks/chapter-single/chaptercontroller'
        'apps/textbooks/section-single/sectioncontroller'
        'apps/textbooks/sub-single/subcontroller'

], (App)->
    App.module "TextbooksApp", (TextbooksApp, App)->

        #startWithParent = false
        class TextbooksRouter extends Marionette.AppRouter

            appRoutes:
                'textbooks': 'showTextbooks'
                'textbook/:term_id': 'showSingleTextbook'
                'textbook/:term_id/chapter/:chap_id':'showSingleChapter'
                'textbook/:term_id/chapter/:chap_id/section/:sect':'showSingleSection'
                'textbook/:term_id/chapter/:chap_id/section/:sect/sub/:sub':'showSingleSub'


        Controller =
            showTextbooks: ->
                if $.allowRoute 'textbooks'
                    new TextbooksApp.List.ListController
                        region: App.mainContentRegion

            showSingleTextbook: (term_id)->
                if $.allowRoute 'textbooks'
                    new TextbooksApp.Single.SingleTextbook
                        region: App.mainContentRegion
                        model_id: term_id

            showSingleChapter: (term_id,chap_id)->
                if $.allowRoute 'textbooks'
                    new TextbooksApp.Single.SingleChapter
                        region: App.mainContentRegion
                        model_id: term_id
                        chapter: chap_id
                        term: 'chapter'

            showSingleSection: (term_id,chap_id,sect)->
                if $.allowRoute 'textbooks'
                    new TextbooksApp.Single.SingleSection
                        region: App.mainContentRegion
                        model_id: term_id
                        chapter: chap_id
                        section: sect
                        term : 'section'

            showSingleSub: (term_id,chap_id,sect,sub)->
                if $.allowRoute 'textbooks'
                    new TextbooksApp.Single.SingleSub
                        region: App.mainContentRegion
                        model_id: term_id
                        chapter: chap_id
                        section: sect
                        sub: sub
                        term: 'sub'


        TextbooksApp.on "start", ->
            new TextbooksRouter
                controller: Controller

	