'use strict';

import BaseFooterComponent from '../../../_core/BaseFooterComponent';

import FooterView from './views/FooterView';
import ProfileModel from '../../models/ProfileModel';

import DialogFeedbackComponent from '../../../partials/dialogs/feedback/DialogFeedbackComponent';

let FooterComponent = function() {
    BaseFooterComponent.apply(this, arguments);

    this._view = new FooterView();
    this._data = new ProfileModel();

    this._init();
    this._bindEvents();
};

FooterComponent.prototype = Object.create(BaseFooterComponent.prototype);

FooterComponent.prototype._init = function() {

    let view = this.getView();
    let model = this.getData(true);
    
    model.set('year', this.year);

    view.model = model;
};

FooterComponent.prototype._bindEvents = function() {

    let view = this.getView();
    let model = this.getData(true);


    view.on('click:feedback', this._openFeedbackDialog.bind(this));
    model.on('change', view.render.bind(view));
};

FooterComponent.prototype._openFeedbackDialog = function() {
    
    (new DialogFeedbackComponent(this.getApplication())).open();
};

FooterComponent.prototype.getApplication = function() {

    return this._application;
};


export default FooterComponent;