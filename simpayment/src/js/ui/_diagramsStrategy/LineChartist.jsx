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
            showPoint: PropTypes.bool,
            showArea: PropTypes.bool,
            low: PropTypes.number,
            height: PropTypes.string,
            labelPosition: PropTypes.string
        }
    }
    
    constructor(props) {
        super(props);
        
        this._diagram = null;
    }
    
    componentDidMount() {
        
        const {diagram} = this;
        const {
            labels, 
            series, 
            showPoint = false, 
            showArea = false, 
            low = 0, 
            height,
            labelPosition,
        } = this.props;
        
        this._diagram = new ChartistJS.Line(diagram, {
            labels: labels || [],
            series: series || []
        }, {
            low: low,
            showArea: showArea,
            showPoint: showPoint,
            lineSmooth: false,
            fullWidth: true,
            height: height,
            stretch: true,
            axisX: {
                showGrid: false,
                offset: 10
            },
            axisY: {
                offset: 30,
                position: labelPosition || 'start'
            }
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
        
        return <div className={`diagram__line${className ? ' '+ className : ''}`} ref={ref => this.diagram = ref} />;
    }
}