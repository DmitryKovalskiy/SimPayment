'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

let tooltips = [];

export default class ToolTip extends Component {

    static get propTypes() {
        return {
            content: PropTypes.string,
            children: PropTypes.any,
            type: PropTypes.string,
            trigger: PropTypes.element,
            display: PropTypes.any
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            content: props.content || '',
            isHovered: (props.type === 'hovered'),
            isOpened: false,
            trigger: props.trigger,
            display: props.display || 'block'
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            content: nextProps.content || '',
        });
    }

    componentWillMount() {
        tooltips.push(this);
    }

    componentWillUnmount() {
        let idx = tooltips.indexOf(this);
        if (~idx) {
            tooltips.splice(idx, 1);
        }
    }

    componentDidUpdate() {
        if (this.state.isOpened) {
            // Закрываем все остальные тултипы
            tooltips.forEach((t) => {
                if (t !== this && t.state.isOpened) {
                    t.setState({ isOpened: false });
                }
            });
        }
    }

    _handlerClickIcon(event) {

        event.preventDefault();
        event.stopPropagation();

        this.setState({
            isOpened: !this.state.isOpened
        });
    }

    render() {

        const {children, display} = this.props;
        const {content, isOpened, isHovered, trigger} = this.state;
        const styleObject = display ? {display:display} : {};

        return (

            <span className="tool-tip">

                {!trigger 
                    ? null
                    : <span onClick={this._handlerClickIcon.bind(this)}>
                          {trigger}
                      </span>
                }
                <span style={styleObject} className={
                    'tool-tip tool-tip--left-position' +
                    (isOpened && ! isHovered ? ' tool-tip--opened' : '') +
                    (isHovered ? ' tool-tip--hovered' : '')
                }>

                {trigger 
                    ? null
                    : <span 
                        className="tool-tip__icon" 
                        onClick={this._handlerClickIcon.bind(this)}>
                      </span>
                }
                    <span className="tool-tip__container">
                        {isHovered
                            ? null
                            : <span
                                className="tool-tip__close"
                                onClick={this._handlerClickIcon.bind(this)}
                            />
                        }
                        <span className="tool-tip__content">
                            {children || <p className="tp-paragraph">{content}</p>}
                        </span>
                    </span>
                </span>
            </span>           
        );
    }
}
