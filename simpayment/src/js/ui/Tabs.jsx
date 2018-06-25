'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';


class TabItem extends Component {

    static propTypes = {
        url: PropTypes.string,
        caption: PropTypes.string,
        active: PropTypes.bool,
        disabled: PropTypes.bool,
        visible: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = this._setState(props);
    }

    componentWillReceiveProps(nextProps) {

        this.setState(this._setState(nextProps));
    }

    _setState(state) {
        return {
            url: state.url || '',
            caption: state.caption || '',
            active: state.active || false,
            disabled: state.disabled || false,
            visible: state.visible
        }
    }

    render() {

        const {
            url,
            caption,
            active,
            disabled,
            visible
        } = this.state;

        return(
            visible
                ? <span className={'navigate__item' + (active ? ' navigate__item--active' : '') + (disabled ? ' navigate__item--disabled' : '')}>
                    {disabled
                        ? <span className="navigate__link">
                            <span className="navigate__caption">{caption}</span>
                        </span>
                        : <a className="navigate__link" href={url}>
                            <span className="navigate__caption">{caption}</span>
                        </a>}
                </span>
                : null
        );
    }
}


export default class Tabs extends Component {

    static propTypes = {
        items: PropTypes.array,
        currentUrlFragment: PropTypes.string,
        disabled: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = this._setState(props);
    }

    componentWillReceiveProps(nextProps) {

        this.setState(this._setState(nextProps));
    }

    _setState(state) {

        return {
            items: state.items || [],
            currentUrlFragment: state.currentUrlFragment || ''
        };
    }

    render() {

        const {
            items,
            currentUrlFragment
        } = this.state;

        return(
            <nav className="navigate tabs">
                {items.map((item, index) => <TabItem
                    key={index}
                    url={item.url}
                    caption={item.caption}
                    active={(new RegExp(`^#?${currentUrlFragment}`)).test(item.url)}
                    disabled={item.disabled}
                    visible={item.visible || false}
                />)}
            </nav>
        );
    }
}