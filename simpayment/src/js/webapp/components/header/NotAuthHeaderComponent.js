'use strict';

import BaseComponent from '../../../_core/BaseComponent';

import HeaderStateModel from './models/HeaderStateModel';
import NotAuthHeaderView from './views/NotAuthHeaderView';


let SimpleHeaderComponent = function() {
    BaseComponent.apply(this, arguments);

    this._view = new NotAuthHeaderView();
    this._state = new HeaderStateModel();

    this._init();
    this._bindEvents();
};

SimpleHeaderComponent.prototype = Object.create(BaseComponent.prototype);

SimpleHeaderComponent.prototype._init = function() {

    let view = this.getView();
    let state = this.getState(true);

    view.state = state;

    this.setState({
        isTest: true
    });
};

SimpleHeaderComponent.prototype._bindEvents = function() {};


export default SimpleHeaderComponent;