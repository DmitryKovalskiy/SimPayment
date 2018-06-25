'use strict';

import Events from '../../_core/Events';

import _ from 'underscore';
import $ from 'jquery';
import 'jquery-deparam';
import Backbone from 'backbone';


let Router = function (application, params) {

    this.params = params || {};

    this.events = new Events();

    this._application = application;
    this._history = Backbone.history;
    this._lastPage = null;

    this._router = new Backbone.Router();
    this._started = false;

    this._init();
    this._bindEvents();
};

Router.prototype._init = function () {

    let routes = this.params.routes;

    if (routes.__esModule) {
        routes = routes.default;
    }

    let route;
    let routeKeys = _.keys(routes);

    while ((route = routeKeys.pop()) != null) {
        this._router.route(route, routes[route]);
    }
};

Router.prototype._bindEvents = function () {
    this._router.on('route', this._triggerRoute.bind(this));
};

Router.prototype._triggerRoute = function (moduleObject, params) {

    const lastPage = this._lastPage;

    if (!(moduleObject instanceof Object)) {
        this.navigate(moduleObject);
        return;
    }

    moduleObject.default.prototype.referrer = lastPage;

    this.events.trigger('route', moduleObject.default, params);

    this._lastPage = this.getFragment(true);
};

Router.prototype.getHistory = function () {
    return this._history;
};

Router.prototype.getFragment = function (isFully) {

    const fragment = this._history.getFragment();

    return fragment.match(isFully ? /^([^#]*)/ig : /^([^?#]*)/ig)[0];
};

Router.prototype.getRouter = function () {

    return this._router;
};

Router.prototype.getParams = function () {

    const search = this._getSearch();

    if (search) {
        return this._searchToObject(search.replace('?', ''));
    }

    return {};
};

Router.prototype.setParams = function (params, correctClear = false) {

    const history = this.getHistory();
    const regExpression = !correctClear ? /\?(\S+)/ : /\?([\S\s]+)/;
    const location = history.location.hash.replace(regExpression, '');
    
    this.navigate(location, params, false);
};

Router.prototype.updateParams = function (params) {

    const getParams = this.getParams();
    const newParams = _.extend({}, getParams, params);

    this.setParams(newParams);
};

Router.prototype.getArguments = function () {

    return this._router._extractParameters();
};

Router.prototype.reloadUrl = function () {

    Backbone.history.loadUrl();
};

Router.prototype._getSearch = function () {

    const fragment = this._history.getFragment();

    return fragment.match(/^([^?#]*)|(\\?[^#]*)$/ig)[1];
};

Router.prototype._objectToString = function (object) {

    return $.param(object);
};

Router.prototype._searchToObject = function (query) {

    return $.deparam(query);
};

Router.prototype.navigate = function (fragment, params = null, trigger = true) {

    const router = this.getRouter();

    if (params != null && typeof params === 'object' && Object.keys(params).length) {

        const stringParams = this._objectToString(params);

        fragment = fragment.replace(/\?$/, '');
        fragment += `?${stringParams}`;
    }

    router.navigate(fragment, {
        trigger: trigger,
        replace: false
    });
};

Router.prototype.redirect = function (path) {

    if (!path) {
        return false;
    }

    window.location.href = path;
};

Router.prototype.back = function () {

    window.history.back();
};

Router.prototype.setStarted = function (value) {

    this._started = value;
};

Router.prototype.getStarted = function () {

    return this._started;
};

Router.prototype.start = function () {

    const history = this.getHistory();

    this.setStarted(true);

    history.start({
        pushState: false
    });
};

export default Router;