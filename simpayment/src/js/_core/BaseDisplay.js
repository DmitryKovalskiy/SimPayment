'use strict';

import Events from './Events';

import DisplayLayout from '../layouts/DisplayLayout';
import PageManager from '../LK/_core/PagesManager';

let BaseDisplay = function(application) {

    this._application = application;

    this.events = new Events();

    this._layout = new DisplayLayout();
    this._pageManager = new PageManager(this);
};

BaseDisplay.prototype._bindEvents = function() {

    let layout = this.getView();

    layout.on('render', this._renderComponents.bind(this));
};

BaseDisplay.prototype._renderComponents = function() {
    this._layout.showChildView('footerRegion', this._footerComponent.getView());
};

BaseDisplay.prototype.destructor = function() {
    console.log('destructor');
};

BaseDisplay.prototype.getPageManager = function() {
    return this._pageManager;
};

BaseDisplay.prototype.getApplication = function() {
    return this._application;
};

BaseDisplay.prototype.getView = function() {
    return this._layout;
};


export default BaseDisplay;