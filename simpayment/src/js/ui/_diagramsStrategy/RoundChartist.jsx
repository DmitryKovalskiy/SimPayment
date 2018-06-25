'use strict';

import ChartistJS from 'chartist';

import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class Chartist extends Component {

    static get propTypes() {
        return {
            className: PropTypes.string,
            labels: PropTypes.array,
            series: PropTypes.array,
            labelInterpolationFnc: PropTypes.func
        }
    }

    constructor(props) {
        super(props);

        this._diagram = null;
    }

    componentDidMount() {

        const element = this['diagram'];
        const {labels, series, labelInterpolationFnc} = this.props;
        
        this._diagram = new ChartistJS.Pie(element, {
            labels: labels || [],
            series: series || []
        }, {
            labelInterpolationFnc: value => labelInterpolationFnc.call(this, value, {labels, series})
        });
    }

    componentWillUnmount() {

        this._diagram.detach();
    }

    componentWillReceiveProps(nextProps) {

        this._diagram.update({
            series: nextProps.series
        });
    }

    render() {

        const {className} = this.props;

        return <div className={className} ref={ref => this.diagram = ref} />;
    }
}