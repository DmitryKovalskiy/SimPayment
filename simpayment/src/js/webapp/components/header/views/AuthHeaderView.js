'use strict';

import _ from 'underscore';
import Marionette from 'backbone.marionette';

import template from '../templates/authHeaderTemplate.html';


export default Marionette.ItemView.extend({
    tagName: 'div',
    className: 'header',
    template: _.template(template),
    templateHelpers: function() {
        return this.state.toJSON();
    }
});