'use strict';

import Events from './Events';


let BaseElementComponent = function(params) {

    this.events = new Events();

    this._options = params || {};

    this._view = null;

    this._data = null;
    this._state = null;
};

BaseElementComponent.prototype.constructor = BaseElementComponent;

BaseElementComponent.prototype.setData = function(data, silent = false) {

    if (this._data && (data instanceof Object)) {
        this._data.set(data, { silent: silent });
    }
};

BaseElementComponent.prototype.getData = function(isModel = false) {

    if (this._data) {
        if (isModel) {
            return this._data;
        }
        return this._data.toJSON();
    }
    return null;
};

BaseElementComponent.prototype.setState = function(state, silent = false) {

    if (this._state && (state instanceof Object)) {
        this._state.set(state, { silent: silent });
    }
};

BaseElementComponent.prototype.getState = function(isModel = false) {

    if (this._state) {
        if (isModel) {
            return this._state;
        }
        return this._state.toJSON();
    }
    return null;
};

BaseElementComponent.prototype.getView = function() {

    return this._view;
};

BaseElementComponent.prototype.destructor = function() {

    delete this.events;

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

    console.log('component destructor');
};


export default BaseElementComponent;