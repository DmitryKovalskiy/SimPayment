'use strict';

import ChartistJS from 'chartist';

import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class Chartist extends Component {

    static get propTypes() {
        return {
            width: PropTypes.any,
            height: PropTypes.any,
            strokeWidth: PropTypes.any,
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
        const {strokeWidth, width, height, labels, series} = this.props;

        this._diagram = new ChartistJS.Bar(element, {
            labels: labels || [],
            series: series || []
        },
        {
            width: width,
            height: height,
            seriesBarDistance: strokeWidth
        }).on('draw', function(data) {
            if(data.type === 'bar') {
                data.element.attr({style: 'stroke-width: '+strokeWidth+'px'});
            }
        });
    }

    componentWillUnmount() {

        this._diagram.detach();
    }

    componentWillReceiveProps(nextProps) {

        this._diagram.update({
            series: nextProps.series,
            labels: nextProps.labels,
        });
    }

    render() {

        const {className} = this.props;

        return <div className={className} ref={ref => this.diagram = ref} />;
    }
}