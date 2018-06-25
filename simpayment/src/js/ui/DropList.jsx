'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

export default class DropList extends Component {

    static get propTypes() {
        return {
            options: PropTypes.arrayOf(PropTypes.object).isRequired,
            optionValue: PropTypes.string.isRequired,
            optionText: PropTypes.string.isRequired,
            optionCaption: PropTypes.string,
            value: PropTypes.any,
            disabled: PropTypes.bool,
            onChange: PropTypes.func
        };
    }

    constructor(props) {
        super(props);

        this._closeStop = false;

        this.state = this._setState(props);
    }

    componentDidMount() {

        document.addEventListener('click', this._handlerHideList.bind(this));
    }

    componentWillUnmount() {

        document.removeEventListener('click', this._handlerHideList.bind(this));
    }

    componentWillReceiveProps(nextProps) {

        this.setState(this._setState(nextProps));
    }

    _handlerHideList() {

        if (this._closeStop) {
            this._closeStop = false;
            return;
        }

        this._toggleList(false);
    }

    _setState(state) {

        return {
            options: state.options || [],
            optionValue: state.optionValue || null,
            optionText: state.optionText || '',
            optionCaption: state.optionCaption || '',
            value: state.value != null ? state.value : -1,
            disabled: state.disabled || false,
            isOpened: false
        };
    }

    _toggleList(state = true) {

        this.setState({
            isOpened: state
        });
    }

    _handlerClickCaption(event) {

        const {disabled} = this.props;

        if (disabled) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        this._closeStop = true;

        this._toggleList( ! this.state.isOpened);
    }

    _handlerClickItem(value, event) {

        const {disabled, onChange} = this.props;

        if (disabled) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        this.setState({
            value: value
        });

        if (onChange) {
            onChange.call(this, value);
        }

        this._toggleList(false);
    }

    _getSelectedCaption() {

        const {
            options,
            optionCaption,
            optionText,
            optionValue,
            value
        } = this.state;
        const option = options.filter(item => item[optionValue] === value)[0];

        return option ? option[optionText] : optionCaption;
    }

    render() {

        const {
            disabled,
            options,
            optionCaption,
            optionValue,
            optionText,
            value,
            isOpened
        } = this.state;

        return(
            <span className={'drop-list' + (disabled ? ' drop-list--disabled' : '')}>
                <span
                    className="drop-list__caption"
                    onClick={this._handlerClickCaption.bind(this)}
                >
                    {this._getSelectedCaption()}
                    <span className="drop-list__arrow"/>
                </span>
                {isOpened
                    ? <span className="drop-list__items">
                        {optionCaption
                            ? <span
                                key={-1}
                                className={'drop-list__item' + (value === -1 ? ' drop-list__item--active' : '')}
                                onMouseDown={this._handlerClickItem.bind(this, -1)}
                            >
                                <span className="tp-paragraph">{optionCaption}</span>
                            </span>
                            : null
                        }
                        {options.map((item, key) => {
                            return <span
                                key={key}
                                className={'drop-list__item' + (value === item[optionValue] ? ' drop-list__item--active' : '')}
                                onMouseDown={this._handlerClickItem.bind(this, item[optionValue])}
                            >
                                <span className="tp-paragraph">{item[optionText] || ''}</span>
                            </span>
                        })}
                    </span>
                    : null}
            </span>
        );
    }
}