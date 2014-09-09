define ['app'], (App)->
    App.module "ContentCreator.PropertyDock.Views", (Views, App)->
        class Views.Layout extends Marionette.Layout

            template: '<div class="tiles default">
            							<div class="tiles-head">
            								<h4 class="text-white"><span class="semi-bold">Properties </span>Dock</h4>
            							</div>
            						</div>
            						<div id="question-elements-property" class="docket"></div>
            						<div id="question-property" class="docket"></div>
            						<div id="question-elements" class="docket"></div>'

            className: 'dock tiles'

            regions:
                questElementPropRegion: '#question-elements-property'
                questPropertyRegion: '#question-property'
                questElementRegion: '#question-elements'

            onShow: ->

                @$el.find('#question-property, #question-elements-property, #question-elements').on 'click', (evt)->
                    evt.stopPropagation()

                $('.content-creator-layout').on 'click', =>
                    @questPropertyRegion.close()
                    @questElementPropRegion.close()
                    @questElementRegion.close()