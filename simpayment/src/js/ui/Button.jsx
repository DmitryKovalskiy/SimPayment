'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

export default class Input extends Component {

    static propTypes = {
        disabled: PropTypes.bool,
        name: PropTypes.string,
        className: PropTypes.string,
        onClick: PropTypes.func
    };
    
    constructor(props) {
        super(props);

        this.state = {
                disabled: props.disabled || false,
                name: props.name || '',
                className: props.className || ''
            };
    }
    
    componentWillReceiveProps(nextProps) {

        this.setState({
            className: nextProps.className,
            name: nextProps.name,
            disabled: nextProps.disabled
        });
    }

    _handlerClickButton() {

        const {onClick} = this.props;
        const {disabled, process} = this.state;

        if (onClick && ( ! disabled || ! process)) {
            onClick.call(this);
        }
    }

    render() {

        const {
            className,
            name,
            disabled
            } = this.state;

        return(
            <span className="buttonComponent">
                <button
                    className={'button' + (className ? ' ' + className : '')}
                    disabled={disabled}
                    type="submit"
                    onClick={this._handlerClickButton.bind(this)}
                >{name}</button> 
            </span>
        );
    }
}