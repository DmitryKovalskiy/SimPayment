'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

class UniversalStrategy extends Component {

    static get propTypes() {
        return {
            options: PropTypes.array,
            optionValue: PropTypes.any,
            optionText: PropTypes.string,
            optionCaption: PropTypes.string,
            optionCaptionPrefix: PropTypes.string,
            optionTemplate: PropTypes.func,
            isCaptionTemplate: PropTypes.bool,
            value: PropTypes.any,
            disabled: PropTypes.bool,
            onChange: PropTypes.func
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            disabled: false
        };

        this._handlerHideList = this._handlerHideList.bind(this);
    }

    componentDidMount() {

        document.addEventListener('click', this._handlerHideList);
    }

    componentWillUnmount() {

        document.removeEventListener('click', this._handlerHideList);
    }

    _handlerHideList() {

        if (this._closeStop) {
            this._closeStop = false;
            return;
        }

        this._toggleList(false);
    }

    _getSelectedCaption() {

        const {
            options = [],
            optionCaption = '',
            optionText = '',
            optionValue = 'id',
            optionTemplate,
            optionCaptionPrefix = '',
            value = '',
            isCaptionTemplate
        } = this.props;

        const option = options.filter(item => {
            return item[optionValue] === value;
        })[0];
        
        let caption = (option ? option[optionText] : (optionCaption));
        
        if (isCaptionTemplate && optionTemplate && option) {
            caption = optionTemplate(option)
        } else {
            caption = (optionCaptionPrefix ? `${optionCaptionPrefix} ` : '') + caption;
        }
        
        return caption;
    }

    _toggleList(state = true) {

        this.setState({isOpened: state});
    }

    _handlerSelectItem(value, event) {

        const {disabled, onChange} = this.props;

        if (disabled) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        this.setState({value: value});

        if (onChange) {
            onChange.call(this, value);
        }

        this._toggleList(false);
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

    render() {

        const {isOpened} = this.state;
        const {options, optionTemplate, optionCaption, optionValue, optionText, value, disabled} = this.props;
        
        return (
            <span className={'select-universal' + (disabled ? ' select-universal--disabled' : '') + (isOpened ? ' select-universal--opened' : '')}>
                <span
                    className="select-universal__caption"
                    onClick={this._handlerClickCaption.bind(this)}
                >
                    <span className="select-universal__text">{this._getSelectedCaption.call(this)}</span>
                    <span className="select-universal__arrow"/>
                </span>
                {isOpened
                    ? <span className="select-universal__list">
                        {optionCaption 
                            ? <span
                                    key={-1}
                                    className={'select-universal__item' + (value === -1 ? ' select-universal__item--active' : '')}
                                    onMouseDown={this._handlerSelectItem.bind(this, -1)}
                                >
                                    <span className="select-universal__item-caption">{optionCaption}</span>
                                </span>
                            : null}
                        {options.map((item, index) => {
                            return <span
                                key={index}
                                className={'select-universal__item' + (value === item[optionValue] ? ' select-universal__item--active' : '')}
                                onMouseDown={this._handlerSelectItem.bind(this, item[optionValue])}
                            >
                                {optionTemplate
                                    ? optionTemplate(item)
                                    : <span className="select-universal__item-caption">{item[optionText]}</span>}
                            </span>;
                        })}
                    </span>
                    : null
                }
            </span>
        );
    }
}

export default UniversalStrategy;