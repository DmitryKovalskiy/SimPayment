'use strict';

import $ from 'jquery';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

export default class Paging extends Component {

    static propTypes = {
        page: PropTypes.number,
        pages: PropTypes.number,
        disabled: PropTypes.bool,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._numberStart = 1;
        this._numberEnd = 1;
        this._numberLeft = 2;
        this._numberRight = 2;

        this.state = {
            page: props.page != null ? parseInt(props.page, 10) : 1,
            pages: props.pages != null ? parseInt(props.pages, 10) : 0,
            disabled: props.disabled || false,
            isLeftHidden: true,
            isRightHidden: true,
            inputPage: props.page != null ? parseInt(props.page, 10) : 1
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            page: nextProps.page != null ? parseInt(nextProps.page, 10) : 1,
            pages: nextProps.pages != null ? parseInt(nextProps.pages, 10) : 0,
            disabled: nextProps.disabled,
            isLeftHidden: true,
            isRightHidden: true,
            inputPage: nextProps.page != null ? parseInt(nextProps.page, 10) : 1,
            inputError: false
        });
    }
    
    componentDidMount() {

        document.addEventListener('click', this._handlerHidePopup.bind(this));
    }

    componentWillUnmount() {

        document.removeEventListener('click', this._handlerHidePopup.bind(this));
    }

    _clickNextPage() {

        const {page, pages} = this.state;
        const {onChange = false} = this.props;

        let currentPage = page;

        if (currentPage < pages) {
            currentPage += 1;
        }

        this.setState({page: currentPage, pages: pages});

        if (onChange) {
            onChange.call(this, currentPage);
        }
    }

    _clickPrevPage() {

        const {page} = this.state;
        const {onChange = false} = this.props;

        let currentPage = page;

        if (currentPage > 1) {
            currentPage -= 1;
        }

        this.setState({page: currentPage});

        if (onChange) {
            onChange.call(this, currentPage);
        }
    }

    _clickCurrentPage(currentPage) {

        const {page} = this.state;
        const {onChange = false} = this.props;

        if (page === currentPage) {
            return;
        }

        this.setState({page: currentPage});

        if (onChange) {
            onChange.call(this, Number(currentPage));
        }
    }
    
    _getOptions(firstNumber, lastNumber) {
        
        let options = [];
        
        options.push({value: '-1', text: ' '});  
        
        for (let number = firstNumber; number <= lastNumber; number++) {
            options.push({value: number, text: number});
        } 
        
        return options;
    }
    
    _handlerHidePopup(ev) {

        if ($(ev.target).hasClass('paging__clever-prevent')) {
            return;
        }

        let {isLeftHidden, isRightHidden, page, inputPage, inputError} = this.state;
        const {onChange = false} = this.props;
        
        if (isLeftHidden === true && isRightHidden === true) {
            return;
        }
        
        let stateObject = {
            isRightHidden: true,
            isLeftHidden: true
        };
        
        if (!inputError) {
            stateObject.page = Number(inputPage);
        }

        this.setState(stateObject);

        if (page === inputPage || inputError) {
            return;
        }
        
        if (onChange) {
            onChange.call(this, Number(inputPage));
        }
    }
    
    _clickLeftControl() {
        this.setState({
            isRightHidden: true,
            isLeftHidden: !this.state.isLeftHidden
        });
    }
    
    _clickRightControl() {
        this.setState({
            isLeftHidden: true,
            isRightHidden: !this.state.isRightHidden
        });
    }
    
    _handleInput(event) {

        let value = event.target.value;

        this.setState({
            inputPage: value,
            inputError: false
        }, () => this._validateInput(value));
    }
    
    _validateInput(value) {

        const {pages} = this.state;

        if (!Number(value) || parseInt(value) < 1 || parseInt(value) > pages) {
            this.setState({
                inputError: true
            });
        }
    }
    
    _handlerKeyPressEnter(event) {

        
        const {page, inputPage, inputError} = this.state;
        const {onChange = false} = this.props;

        if (event.key === 'Enter') {
            event.preventDefault();
            if (inputError) {
                return;
            }
            
            if (page === inputPage) {
                return;
            }

            this.setState({
                page: Number(inputPage),
                isLeftHidden: true,
                isRightHidden: true
            });

            if (onChange) {
                onChange.call(this, Number(inputPage));
            }
        }
    }

    _renderPagePopup(type) {
        
        const {pages, disabled, isLeftHidden, isRightHidden, inputPage, inputError} = this.state;
        let popupType = type === 'left' ? 'Left' : 'Right';
        let isPopupHidden = type === 'left' ? isLeftHidden : isRightHidden;
        
        return (
            <bottom
                onClick={this['_click' + popupType + 'Control'].bind(this)}
                key={type === 'left' ? -1 : -2}
                className="paging__number paging__ellipsis paging__clever-prevent"
                disabled={disabled}
            >
                <span onClick={(ev) => ev.stopPropagation()} className="paging__popup paging__clever-prevent" style={{display: isPopupHidden ? 'none' : 'block'}}>
                    <span className="paging__label paging__clever-prevent">На страницу</span>
                    <input
                        value={inputPage}
                        onKeyPress={this._handlerKeyPressEnter.bind(this)}
                        onChange={this._handleInput.bind(this)}
                        onClick={(ev) => ev.stopPropagation()}
                        type="text" className="paging__input paging__clever-prevent"
                        style={inputError ? {borderColor:'#d9534f'} : {}}
                    />
                    <span className="paging__label paging__clever-prevent">из <strong className="paging__strong paging__clever-prevent">{pages}</strong></span>
                </span>
            </bottom>
        );
    }

    _renderNumbers() {

        let keyNumber = 0;
        let numbersElement = [];
        const {page, pages, disabled} = this.state;
        
        let leftRest = page - 1;
        let restCurrentNum = pages - page;
        let nextCurPage = page + 1;
        
        // left part
        if (leftRest >= 1 && leftRest < (this._numberStart + this._numberLeft + 1)) {
            for (let i = 1; i < page; i++) {
                keyNumber++;
                numbersElement.push(
                    <button
                        key={keyNumber}
                        className={'paging__number'}
                        type="button"
                        disabled={disabled}
                        onClick={this._clickCurrentPage.bind(this, i)}
                    >
                        {i}
                    </button>
                );
            }
        }
        else if (leftRest >= (this._numberStart + this._numberLeft + 1)) {
            for (let c = 1; c <= this._numberStart; c++) {
                keyNumber++;
                numbersElement.push(
                    <button
                        key={keyNumber}
                        className={'paging__number'}
                        type="button"
                        disabled={disabled}
                        onClick={this._clickCurrentPage.bind(this, c)}
                    >
                        {c}
                    </button>
                );
            }
            numbersElement.push(
                this._renderPagePopup('left')
            );
            for (let d = (page - this._numberLeft);  d < page; d++) {
                keyNumber++;
                numbersElement.push(
                    <button
                        key={keyNumber}
                        className={'paging__number'}
                        type="button"
                        disabled={disabled}
                        onClick={this._clickCurrentPage.bind(this, d)}
                    >
                        {d}
                    </button>
                );
            }
        }
        
        // current page
        keyNumber++;
        numbersElement.push(
            <button
                key={keyNumber}
                className={'paging__number paging__number--active'}
                type="button"
                disabled={disabled}
                onClick={this._clickCurrentPage.bind(this, page)}
            >
                {page}
            </button>
        );

        // right part
        if (restCurrentNum >= 1 && restCurrentNum < (this._numberEnd + this._numberRight + 1)) {
            for (let j = nextCurPage; j <= pages; j++) {
                keyNumber++;
                numbersElement.push(
                    <button
                        key={keyNumber}
                        className={'paging__number'}
                        type="button"
                        disabled={disabled}
                        onClick={this._clickCurrentPage.bind(this, j)}
                    >
                        {j}
                    </button>
                );
            }
        }
        else if (restCurrentNum >= (this._numberEnd + this._numberRight + 1)) {
            for (let n = nextCurPage;  n <= (page + this._numberRight); n++) {
                keyNumber++;
                numbersElement.push(
                    <button
                        key={keyNumber}
                        className={'paging__number'}
                        type="button"
                        disabled={disabled}
                        onClick={this._clickCurrentPage.bind(this, n)}
                    >
                        {n}
                    </button>
                );
            }
            numbersElement.push(
                this._renderPagePopup('right')
            );

            for (let m = (pages - this._numberEnd + 1); m <= pages; m++) {
                keyNumber++;
                numbersElement.push(
                    <button
                        key={keyNumber}
                        className={'paging__number'}
                        type="button"
                        disabled={disabled}
                        onClick={this._clickCurrentPage.bind(this, m)}
                    >
                        {m}
                    </button>
                );
            }
        }

        return numbersElement;
    }

    render() {

        const {page, pages, disabled} = this.state;

        return(
            pages > 1
                ? <div className="paging">
                    <button
                        className="paging__prev"
                        type="button"
                        disabled={disabled || (page === 1)}
                        onClick={this._clickPrevPage.bind(this)}
                    />
                    {this._renderNumbers()}
                    <button
                        className="paging__next"
                        type="button"
                        disabled={disabled || (page === pages)}
                        onClick={this._clickNextPage.bind(this)}
                    />
                </div>
                : null
        );
    }
}