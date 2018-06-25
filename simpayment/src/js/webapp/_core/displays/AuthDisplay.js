'use strict';

import BaseDisplay from 'js/_core/BaseDisplay';

import CompositePage from '../CompositePage';

import HeaderComponent from '../../components/header/AuthHeaderComponent';

import FooterComponent from '../../components/footer/FooterComponent';


let AuthDisplay = function() {

    BaseDisplay.apply(this, arguments);

    let app = this.getApplication();

    this._headerComponent = new HeaderComponent(app);
    this._compositePage = new CompositePage(this);
    this._footerComponent = new FooterComponent(app);

    this._init();
    this._bindEvents();
};

AuthDisplay.prototype = Object.create(BaseDisplay.prototype);

AuthDisplay.prototype._init = function() {

    let app = this.getApplication();
    let profiler = app.getComponent('profiler');

    let profileData = profiler.getData();

    this._headerComponent.setData(profileData);
    this._footerComponent.setData(profileData);
};

AuthDisplay.prototype._bindEvents = function() {
    BaseDisplay.prototype._bindEvents.call(this);

    let app = this.getApplication();
    let router = app.getComponent('router');
    let request = app.getComponent('request');
    let profiler = app.getComponent('profiler');
    let navigate = this.getNavigateComponent();
    let pageManager = this.getPageManager();

    pageManager.events.on('start:process', function(pageName) {
        let menuItem = navigate.getItemByUrl(pageName);
        if (menuItem) {
            menuItem.set('process', true);
        }
    });

    pageManager.events.on('stop:process', function(pageName) {
        let menuItem = navigate.getItemByUrl(pageName);
        if (menuItem) {
            menuItem.set('process', false);
        }
    });

    this._headerComponent.events.on('combo-box-account:select', function(value) {
        if (value.url === '#logout') {
            request.send('/account/logout', {
                type: 'post',
                host: window.location.protocol + '//' + window.location.host
            }).then(function() {
                router.redirect('/');
            }).catch(function() {
                router.redirect('/');
            });
        }
    });

    this._headerComponent.events.on('combo-box-cabinet:select', this._changeCabinet.bind(this));

    profiler.events.on('update', () => {
        let profileData = profiler.getData();
        this._headerComponent.setData(profileData);
    });
};

AuthDisplay.prototype._changeCabinet = function(value) {
    
    let app = this.getApplication();
    let router = app.getComponent('router');
    let AccountService = app.getService('account');
    
    AccountService.changeCabinet(JSON.stringify({ id: value.id }))
        .then(() => {
            if (window.sessionStorage != null) {
                window.sessionStorage.removeItem('cashdeskManagementFilter');
            }
            router.redirect('/');
            return null;
        })
        .catch(() => router.redirect('/')); 
};

AuthDisplay.prototype._renderComponents = function() {

    BaseDisplay.prototype._renderComponents.call(this);

    let layout = this.getView();

    layout.showChildView('headerRegion', this._headerComponent.getView());
    layout.showChildView('contentRegion', this._compositePage.getView());
};

AuthDisplay.prototype.getNavigateComponent = function() {

    let compositePage = this.getCompositePage();
    let navigatePage = compositePage.getNavigatePage();

    return navigatePage.getNavigateComponent();
};

AuthDisplay.prototype.getCompositePage = function() {

    return this._compositePage;
};


export default AuthDisplay;