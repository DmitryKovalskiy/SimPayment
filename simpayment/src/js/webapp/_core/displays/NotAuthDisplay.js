'use strict';

import BaseDisplay from '../../../_core/BaseDisplay';
import SimpleHeaderComponent from '../../../WebApp/components/header/NotAuthHeaderComponent';
import FooterComponent from '../../components/footer/FooterComponent';

let NotAuthDisplay = function() {

    BaseDisplay.apply(this, arguments);

    let app = this.getApplication();

    this._headerComponent = new SimpleHeaderComponent(app);
    this._footerComponent = new FooterComponent(app);

    this._init();
    this._bindEvents();
};

NotAuthDisplay.prototype = Object.create(BaseDisplay.prototype);

NotAuthDisplay.prototype._init = function() {

    let app = this.getApplication();
    let profiler = app.getComponent('profiler');

    let profileData = profiler.getData();

    this._headerComponent.setData(profileData);
    this._footerComponent.setData(profileData);
};

NotAuthDisplay.prototype._renderComponents = function() {

    BaseDisplay.prototype._renderComponents.call(this);

    let layout = this.getView();

    layout.showChildView('headerRegion', this._headerComponent.getView());
    layout.showChildView('contentRegion', this._pageManager.getView());
};


export default NotAuthDisplay;