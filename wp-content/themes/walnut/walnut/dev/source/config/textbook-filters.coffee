define ['jquery', 'underscore'], ($, _)->

    $.populateChapters = (chaps, ele, curr_chapter=0 )->

        ele.select2().select2 'data', null
        ele.html('');

        if _.size(chaps) > 0
            _.each chaps.models, (chap, index)=>
                ele.append '<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>'

            ele.select2().select2 'val',curr_chapter

    $.populateSections = (sections, ele, sectionIDs = []) ->

        ele.select2().select2 'data', null
        ele.html('');

        if _.size(sections) > 0
            _.each sections, (section, index)=>
                ele.append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'

            ele.select2().select2 'val',sectionIDs

    $.populateSubSections = (subsections, ele, subSectionIDs = []) ->

        ele.select2().select2 'data', null
        ele.html('');

        if _.size(subsections) > 0
            _.each subsections, (section, index)=>
                ele.append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'
            ele.select2().select2 'val',subSectionIDs

