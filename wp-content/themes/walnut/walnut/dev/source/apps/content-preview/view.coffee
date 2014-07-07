define ['app'], (App)->
    App.module "ContentPreview.Views", (Views, App, Backbone, Marionette, $, _)->
        class Views.Layout extends Marionette.Layout

            className : ''

            template : '<div class="preview">
                            <div class="" id="top-panel"></div>
                                <div class="container-grey m-b-5  qstnInfo ">
                                    <label class="form-label bold small-text muted no-margin inline">Question Info: </label>
                                    <span class="small-text" style="text-transform: capitalize">{{instructions}}</span>
                                </div>
                                <div class="" id="content-board"></div>
                                 {{#content_preview}}
                                <input type="button" class="btn btn-info btn-cons2 h-center block" id="submit-answer-button" value="submit">
                                {{/content_preview}}
                            <div class="clearfix"></div>
                        </div>'

            regions :
                contentBoardRegion : '#content-board'
                topPanelRegion : '#top-panel'

            mixinTemplateHelpers : (data)->
                data = super data
                data.content_preview = Marionette.getOption @, 'content_preview'
                data
