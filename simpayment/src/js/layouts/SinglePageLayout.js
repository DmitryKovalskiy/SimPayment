'use strict';

import _ from 'underscore';
import Marionette from 'backbone.marionette';

import baseLayoutTemplate from '../../templates/layouts/singlePageLayoutTemplate.html';


export default Marionette.LayoutView.extend({
    tagName: 'section',
    className: 'base-layout',
    template: _.template(baseLayoutTemplate),
    regions: {
        contentRegion: '.base-layout__content'
    }
});