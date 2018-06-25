'use strict';

import $ from 'jquery';
import Events from './Events';


let BaseModule = function(args, application, data) {

    this.events = new Events();

    this.removable = false;
    this.hideSubMenu = false;
    this.breadcrumbs = [];

    this._args = args;
    this._application = application;
    this._firstData = data;

    this._layout = null;
    this._view = null;

    this._isAdded = false;
    
    this._bindHideSubMenu();
};

BaseModule.referrer = null;

BaseModule.prototype._bindHideSubMenu = function() {
    
    this.events.on('add', this._showSubNavigate.bind(this, false));
    this.events.on('show', this._showSubNavigate.bind(this, false));
    this.events.on('hide', this._showSubNavigate.bind(this, true));
    this.events.on('remove', this._showSubNavigate.bind(this, true));
};

BaseModule.prototype._showSubNavigate = function(state) {
    
    if (this.hideSubMenu) {
        window.setTimeout(() => $('.page-with-aside__aside .navigate').eq(1)[state ? 'slideDown' : 'slideUp']('fast'), 100);
    }
};

BaseModule.prototype._setBreadcrumbs = function() {

    let app = this.getApplication();
    let display = app.getComponent('display');
    let compositePage = display.getCompositePage();

    if (compositePage) {
        compositePage._breadcrumbsComponent.addItem(this.breadcrumbs);
    }
};

BaseModule.prototype._resetBreadcrumbs = function() {

    let app = this.getApplication();
    let display = app.getComponent('display');
    let compositePage = display.getCompositePage();

    if (compositePage) {
        compositePage._breadcrumbsComponent.removeItems();
    }
};

BaseModule.prototype.resetBreadcrumbs = function(items) {

    let app = this.getApplication();
    let display = app.getComponent('display');
    let compositePage = display.getCompositePage();

    //this.breadcrumbs = items;

    compositePage._breadcrumbsComponent.resetItems(items);
};

BaseModule.prototype.destructor = function() {
   
    delete this.events;
    
    if (this._layout) {
        this._layout.destroy();
        delete this._layout;
    }

    if (this._view) {
        this._view.destroy();
        delete this._view;
    }
};

BaseModule.prototype._added = function() {

    this._setBreadcrumbs();

    if ( ! this._isAdded) {
        this.events.trigger('add', this);
        this._isAdded = true;
    }
};

BaseModule.prototype._showed = function() {

    this._setBreadcrumbs();

    if (this._isAdded) {
        this.events.trigger('show', this);
    }
};

BaseModule.prototype._hidden = function() {

    this._resetBreadcrumbs();

    this.events.trigger('hide', this);
};

BaseModule.prototype._removed = function() {

    this._resetBreadcrumbs();

    this.events.trigger('remove', this);
};

BaseModule.prototype.getArguments = function() {
    return this._args;
};

BaseModule.prototype.getServerData = function() {
    return this._firstData;
};

BaseModule.prototype.setServerData = function(result) {
    this._firstData = result;
};

BaseModule.prototype.getApplication = function() {
    return this._application;
};

BaseModule.prototype.getView = function() {
    return this._layout || this._view;
};


export default BaseModule;
