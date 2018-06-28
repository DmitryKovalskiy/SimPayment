'use strict';

import React, { Component } from 'react';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';

import MenuItem from 'react-bootstrap/lib/MenuItem';

import PropTypes from 'prop-types';

export default class Select extends Component {
    static get propTypes() {
        return {
            disabled: PropTypes.bool.isRequired,
            options: PropTypes.arrayOf(PropTypes.object),
            value: PropTypes.any,
            defaultName: PropTypes.string,
            id: PropTypes.string
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            options: props.options,
            defaultName: props.defaultName || 'defaultSelect',
            id: props.id || "_"
        }
    }
    GetMenuItem(options) {
        return options.map((item, index) => <option value={index}>{item} </option> );
    }
    render() {
        return <select className="selectElement" id={"dropdown-size-medium_" + this.props.id} title={this.props.defaultName}>
        {this.GetMenuItem(this.props.options)}
        </select>
    };
}
