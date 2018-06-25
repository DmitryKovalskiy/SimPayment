'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import BarStrategy from './_diagramsStrategy/BarChartist';
import RoundStrategy from './_diagramsStrategy/RoundChartist';
import DonutStrategy from './_diagramsStrategy/DonutChartist';
import LineStrategy from './_diagramsStrategy/LineChartist';

export default class Chartist extends Component {

    static propTypes = {
        type: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            type: props.type || 'round'
        };
    }

    render() {

        const props = this.props;
        const {type} = this.state;

        switch(type) {
            case 'round':
                return <RoundStrategy {...props} />;
            case 'bar':
                return <BarStrategy {...props} />;
            case 'donut':
                return <DonutStrategy {...props} />;
            case 'line':
                return <LineStrategy {...props} />;
            default:
                return <RoundStrategy {...props} />;
        }
    }
}