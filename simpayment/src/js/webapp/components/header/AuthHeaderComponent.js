'use strict';

import BaseComponent from '../../../_core/BaseComponent';

import ComboBoxAccountComponent from '../../../partials/combobox/components/account/AccountComponent';
import ComboBoxCabinetComponent from '../../../partials/combobox/components/cabinet/CabinetComponent';
import HeaderWithProfileLayout from './views/HeaderWithProfileLayout';
//import UserInfoView from './views/UserInfoView';
import ProfileModel from '../../models/ProfileModel';
import HeaderStateModel from './models/HeaderStateModel';


let HeaderComponent = function() {

    BaseComponent.apply(this, arguments);

    this._layout = new HeaderWithProfileLayout();

    this._comboBoxAccountComponent = new ComboBoxAccountComponent(arguments[0], arguments[1]);

    this._comboBoxCabinetComponent = new ComboBoxCabinetComponent(arguments[0], arguments[1]);

    this._data = new ProfileModel();
    this._state = new HeaderStateModel();

    this._init();
    this._bindEvents();
};

HeaderComponent.prototype = Object.create(BaseComponent.prototype);

HeaderComponent.prototype._init = function() {

    let layout = this.getView();
//    let model = this.getData(true);
    let state = this.getState(true);
    let app = this.getApplication();

//    this._userInfoView.model = model;
    layout.state = state;

    this._comboBoxAccountComponent.setData(app.getParam('dropDown'));
};

HeaderComponent.prototype._bindEvents = function() {

    let layout = this.getView();
    let model = this.getData(true);
    let state = this.getState(true);

    layout.on('render', this._renderComponents.bind(this));

    model.on('change', function() {

        state.set({
            title: 'Такском-Касса',
            isTest: (model.get('stateApp') === 'Test')
        });

        this._comboBoxAccountComponent.setState({
            caption: Boolean(model.get('userFullName')) ? model.get('userFullName') : model.get('userEmail')
        });
        
        let caption = [];
        caption.push(model.get('organizationName'));
        let inn = model.get('inn');
        let kpp = model.get('kpp');
        let headerKppString = '';
        if (model.has('kpp') && inn.length < 12) {
            headerKppString = kpp !== null  ? '   КПП ' + kpp : '';
        }
        if (inn != null){
            caption.push('ИНН ' + model.get('inn') + headerKppString);
        }

        this._comboBoxCabinetComponent.setState({
            caption: caption,
            activeId: model.get('organizationId')
        }); 
    }, this);

    this._comboBoxAccountComponent.events.on('combo-box:link', (value) => this.events.trigger('combo-box-account:select', value));
    
    this._comboBoxCabinetComponent.events.on('combo-box:link', (value) => this.events.trigger('combo-box-cabinet:select', value));
};

HeaderComponent.prototype._renderComponents = function() {

    let layout = this.getView();

    layout.userInfoRegion.show(this._comboBoxCabinetComponent.getView());
    layout.controlsRegion.show(this._comboBoxAccountComponent.getView());
};


export default HeaderComponent;