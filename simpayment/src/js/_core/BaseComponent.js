'use strict';

import Events from './Events';


let BaseComponent = function(application, params) {

    this.events = new Events();

    this._options = params || {};
    this._application = application || null;

    this._view = null;
    this._layout = null;

    this._data = null;
    this._state = null;
};

BaseComponent.prototype.setData = function(data, silent = false) {
    if (this._data && (data instanceof Object)) {
        this._data.set(data, { silent: silent });
    }
};

BaseComponent.prototype.getData = function(isModel = false) {
    if (this._data) {
        if (isModel) {
            return this._data;
        }
        return this._data.toJSON();
    }
    return null;
};

BaseComponent.prototype.setState = function(state, silent = false) {
    if (this._state && (state instanceof Object)) {
        this._state.set(state, { silent: silent });
    }
};

BaseComponent.prototype.getState = function(isModel = false) {
    if (this._state) {
        if (isModel) {
            return this._state;
        }
        return this._state.toJSON();
    }
    return null;
};

BaseComponent.prototype.getView = function() {
    return this._layout || this._view;
};

BaseComponent.prototype.getApplication = function() {
    return this._application;
};

BaseComponent.prototype.getOptions = function() {
    return this._options;
};

BaseComponent.prototype.destructor = function() {

    delete this.events;

    if (this._layout) {
        this._layout.destroy();
        delete this._layout;
    }

    if (this._view) {
        this._view.destroy();
        delete this._view;
    }

    if (this._data) {
        delete this._data;
    }

    if (this._state) {
        delete this._state;
    }

    window.console.log('component destructor');
};

export default BaseComponent;