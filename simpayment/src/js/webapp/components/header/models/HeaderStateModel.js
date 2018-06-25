'use strict';

import Backbone from 'backbone';


export default Backbone.Model.extend({
    defaults: {
        isTest: false,
        title: ''
    }
});