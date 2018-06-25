'use strict';

import _ from 'underscore';
import Marionette from 'backbone.marionette';

import template from '../templates/footerTemplate.html';


export default Marionette.ItemView.extend({
    tagName: 'div',
    className: 'footer',
    template: _.template(template),
    
    events : {
        'click .feedback-dialog-open' : '_onOpenFeedbackDialog'
    },
    _onOpenFeedbackDialog: function(event) {
    	event.preventDefault();
    	this.triggerMethod('click:feedback');
    }
});