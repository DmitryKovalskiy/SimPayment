'use strict';

import _ from 'underscore';
import Marionette from 'backbone.marionette';

import template from '../templates/headerWitjProfileTemplate.html';


export default Marionette.LayoutView.extend({
    tagName: 'div',
    className: 'header',
    template: _.template(template),
    regions: {
        userInfoRegion: '.header__user-info',
        controlsRegion: '.header__controls'
    },
    templateHelpers: function() {
        return this.state.toJSON();
    }
});