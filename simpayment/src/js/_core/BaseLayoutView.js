'use strict';

import _ from 'underscore';
import $ from 'jquery';

import Marionette from 'backbone.marionette';

import ModelBinder from 'backbone.modelbinder';

export default Marionette.LayoutView.extend({
	events: {
    	'click .tooltip__item' : 'showTooltipe'
    },
    showTooltipe: function(ev) {
    	
    	let target = $(ev.currentTarget);
    	this.triggerMethod('showTooltipe', target);	
    },
    initialize: function() {
        this._modelBinder = new ModelBinder();
    },
    onRender: function() {
    	
    	if (!!this.bindingRules) {
    		this.bindModels();
    	}
    },
	bindModels : function() {	   
		
		if (!!this._modelBinder) {
            this._modelBinder.unbind();
        }
		
	    this._modelBinder.bind(this.model, this.el, this.bindingRules);
	},
	showError: function (error) {
		
        _.each(error, function(errorMessage, elementName) {

            let $errorElement = this.$(`[data-error="${elementName}"]`);

            $errorElement.text(errorMessage);
            $errorElement.css('display', 'inline-block');
        }, this);
    },
    clearError: function(elementName) {
    	
        let errorElement = (elementName ? this.$(`[data-error="${elementName}"]`) : this.$('.error'));
        errorElement.hide();
    },
    scrollToError: function(elem) {
    	
        elem = (elem ? elem : '.text-error');
        let errorSpan = this.$(elem).first();
        
        if (errorSpan.length === 0){
            return;
        }
        
        let errorKey = errorSpan.data().error;
        let errorField =  this.ui[errorKey];
        this.scrollTo({scrollTop: errorField[0].offsetTop - 50});
        errorField.focus();
    },
    scrollTo: function(params) {
    	
        this.$el.animate(params, 100);
    }
});