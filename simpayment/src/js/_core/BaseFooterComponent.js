'use strict';

import BaseComponent from './BaseComponent';

let BaseFooterComponent = function() {
	BaseComponent.apply(this, arguments);
	
	this.year = new Date().getFullYear();
};

BaseFooterComponent.prototype = Object.create(BaseComponent.prototype);

export default BaseFooterComponent;