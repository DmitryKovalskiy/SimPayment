'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class Radio extends Component {

    static propTypes = {
        children: PropTypes.string,
        checked: PropTypes.bool,
        indeterminate: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            indeterminate: props.indeterminate || false,
        };
    }

    componentDidMount() {

        const {indeterminate} = this.props;

        this._setIndeterminate(indeterminate);
    }

    _setIndeterminate(indeterminate) {

        const node = this['radioInput'];
        node.indeterminate = indeterminate;
    }

    componentWillReceiveProps(nextProps) {

        const {indeterminate} = nextProps;

        this._setIndeterminate(indeterminate);
    }

    _changeCheckedState() {

        const {onChange = false, checked = false} = this.props;
        const state = {
            checked: ! checked
        };

        if (onChange) {
            onChange.call(this, state.checked);
        }
    }

    render() {

        const {
            children,
            checked,
            disabled
        } = this.props;

        return(
            <label className="radio">
                <input
                    ref={ref => this.radioInput = ref}
                    className="radio__input"
                    type="radio"
                    disabled={disabled}
                    checked={checked}
                    onChange={this._changeCheckedState.bind(this)}
                />
                <span className="radio__visual"/>
                {children
                    ? <span className="radio__caption">{children}</span>
                    : null}
            </label>
        );
    }
}