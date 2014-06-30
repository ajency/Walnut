define ['app'], (App)->

    App.module "ContentPreview.Views", (Views, App, Backbone, Marionette, $, _)->

        class Views.Layout extends Marionette.Layout

            className : ''

            template : '<div class="preview">
                            <div class="" id="top-panel"></div>
                            <div class="" id="content-board"></div>
                            {{#content_preview}}
                            <input type="button" class="btn btn-info btn-cons2" id="submit-answer-button" value="submit">
                            {{/content_preview}}
                            <!--<div class="tiles grey text-grey b-grey b-b m-t-20">
                                <div class="grid simple m-b-0 transparent">
                                    <div class="grid-title no-border qstnInfo">
                                        <p class="bold small-text inline text-grey"><i class="fa fa-question"></i> Additional Information </p>
                                        <div class="tools"> <a href="javascript:;" class="arrow expand"></a> </div>
                                    </div>
                                    <div class="qstnInfoBod no-border m-t-10 p-b-5 p-r-20 p-l-20">
                                        <p class="">{{instructions}}</p>
                                    </div>
                                </div>
                            </div>-->
                        </div>'

            regions :
                contentBoardRegion : '#content-board'
                topPanelRegion : '#top-panel'

            mixinTemplateHelpers : (data)->
                data = super data
                data.content_preview = Marionette.getOption @, 'content_preview'
                data
