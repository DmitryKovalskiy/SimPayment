'use strict';

import PropsType from 'prop-types';
import React, {Component} from 'react';

export default class Search extends Component {

    static propTypes = {
        value: PropsType.any,
        placeholder: PropsType.any,
        disabled: PropsType.bool,
        onChange: PropsType.func,
        onInput: PropsType.func
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            placeholder: props.placeholder || 'Поиск...',
            disabled: props.disabled
        };
    }

    componentWillReceiveProps(nextProps) {
        
        this.setState({
            value: nextProps.value != null ? nextProps.value : this.state.value,
            disabled: nextProps.disabled
        });
    }

    _applySearchTherm(event) {
        event.preventDefault();

        const {onChange = false} = this.props;
        const {value} = this.state;

        if (onChange) {
            onChange.call(this, value);
        }
    }

    _handleInputText(event) {

        const {onInput} = this.props;
        const value = event.target.value;

        this.setState({value: value}, () => {
            if (onInput) {
                onInput.call(this, value);
            }
        });
    }

    _handlerKeyPressEnter(event) {

        if (event.key === 'Enter') {
            this._applySearchTherm(event);
        }
    }

    render() {

        const {value, placeholder, disabled} = this.state;

        return(
            <span className="search">
                <span className="search-component__form">
                    <input
                        className="search__input"
                        type="text"
                        value={value}
                        onKeyPress={this._handlerKeyPressEnter.bind(this)}
                        onInput={this._handleInputText.bind(this)}
                        onChange={this._handleInputText.bind(this)}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                    <button
                        className="search__button"
                        type="button"
                        disabled={disabled}
                        onClick={this._applySearchTherm.bind(this)}
                    />
                </span>
            </span>
        );
    }
}