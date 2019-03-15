import React, {Component} from 'react';
import t from 'prop-types';
import {Button} from 'reactstrap';

export default class CloseableBtn extends Component {

    static propTypes = {
        title: t.string,
        id: t.string,
        value: t.string,
        disabled: t.bool,
        highlighted: t.bool,
        style: t.object,

        onClick: t.func,
        onClose: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.close = this.close.bind(this);
    }

    closeStyle = {
        fontWeight: '800',
        fontSize: '1.4rem',
        position: 'absolute',
        padding: '0 10px 0 2px',
        right: '0px',
        top: '0px'
    };

    close(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onClose();
    }

    render() {
        return (
            <Button outline={!this.props.highlighted} color="secondary"
                    id={this.props.id}
                    onClick={this.props.onClick}
                    title={this.props.title + this.props.value}
                    disabled={this.props.disabled}
                    style={{width: '100%', textAlign: 'left', position: 'relative', ...this.props.style}}>
                <div style={{width: '100%', overflow: 'hidden', paddingRight: '20px', textOverflow: 'ellipsis'}}>
                    <small><strong>{this.props.title}</strong>{this.props.value}</small>
                </div>
                <a href={'#'} style={this.closeStyle} onClick={this.close} id={this.props.id + '-close-btn'}><span aria-hidden="true">&times;</span></a>
            </Button>
        );
    }
}
