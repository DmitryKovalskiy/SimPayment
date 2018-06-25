'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SimpleStrategy from './_selectsStrategy/SimpleStrategy';
import UniversalStrategy from './_selectsStrategy/UniversalStrategy';
import AutoCompleteStrategy from './_selectsStrategy/AutoCompleteStrategy';
import OldAutoCompleteStrategy from './_selectsStrategy/OldAutoCompleteStrategy';


export default class Select extends Component {

    static propTypes = {
        type: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            type: props.type || 'simple'
        };
    }

    render() {

        const props = this.props;
        const {type} = this.state;

        switch(type) {
            case 'old-auto-complete':
                return <OldAutoCompleteStrategy {...props} />;
            case 'auto-complete':
                return <AutoCompleteStrategy {...props} />;
            case 'universal':
                return <UniversalStrategy {...props} />;
            default:
                return <SimpleStrategy {...props} />;
        }
    }
}