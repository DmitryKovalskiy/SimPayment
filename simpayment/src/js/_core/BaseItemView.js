'use strict';

import _ from 'underscore';
import $ from 'jquery';

import Marionette from 'backbone.marionette';

import ModelBinder from 'backbone.modelbinder';


export default Marionette.ItemView.extend({
    
    events: {
        'click .tooltip__item' : 'showTooltipe'
    },
    
    showTooltipe: function(ev) {
        
        let target = $(ev.currentTarget);
        this.triggerMethod('showTooltipe', target); 
    },
    
    bindingRules: {},
    
    initialize: function() {
        
        this._bindings = [];
        
        this._modelBinder = new ModelBinder();
    },
    
    onRender: function() {
    
        this._bindModels();
    },
    
    _bindModels : function() {     
        
        let rules = [];
        let bindingRules = JSON.parse(JSON.stringify(this.bindingRules));
        
        this._clearBindings();

        
        _.each(bindingRules, (val, key) => {
            
            if (typeof val === 'object') {
                
                if (Object.getOwnPropertyNames(val).length > 0) {
                    let role = {};
                    role[key] = val;
                    rules.push(role);
                }
                
                delete bindingRules[key];
            }
        });
        
        let bindingNames = Object.getOwnPropertyNames(bindingRules);
        
        if (bindingNames.length === 0) {
            return;
        }
        
        this._bindModel(this.model, this.el, bindingRules);
        
        _.each(rules, (rule) => {
            
            let key = Object.keys(rule)[0];
            
            if (this.model.has(key)) {
                this._bindModel(this.model.get(key), this.el, rule[key]);
            }
        });
    },
    
    _bindModel: function(model, el, rules) {
        
        let modelBinder = new ModelBinder();
        
        modelBinder.bind(model, el, rules);
        
        this._bindings.push(modelBinder);
    },
    
    _clearBindings: function() {
        
        if (this.binding) {
            _.each(this._bindings, function (binding) {
                binding.unbind();
            });
        }
        
        this._bindings = [];
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