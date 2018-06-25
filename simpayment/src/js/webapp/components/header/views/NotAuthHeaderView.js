'use strict';

import _ from 'underscore';
import Marionette from 'backbone.marionette';

import template from '../templates/notAuthHeaderTemplate.html';


export default Marionette.ItemView.extend({
    tagName: 'div',
    className: 'header',
    template: _.template(template),
    templateHelpers: function() {
        return this.state.toJSON();
    }
});