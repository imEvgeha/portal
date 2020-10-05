import PropTypes from 'prop-types';
import React from 'react';
import {INVALID_DURATION} from '../../constants/messages';
import moment from 'moment';
import {AvField, AvForm} from 'availity-reactstrap-validation';

export default class RangeDuration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidStartDuration: '',
            invalidEndDuration: '',
            invalidRange: '',
        };
        this.handleChangeStartDuration = this.handleChangeStartDuration.bind(this);
        this.handleChangeEndDuration = this.handleChangeEndDuration.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.refFirstInput = React.createRef();
    }

    componentDidUpdate() {
        if (this.props.validateRange) {
            if (
                this.props.value.from &&
                this.props.value.to &&
                moment(this.props.value.from) > moment(this.props.value.to)
            ) {
                if (!this.state.invalidRange && !this.state.invalidStartDuration && !this.state.invalidEndDuration) {
                    this.props.onInvalid(this.wrongDurationRange(true));
                }
            } else {
                if (this.state.invalidRange) {
                    this.props.onInvalid(this.wrongDurationRange(false));
                }
            }
        }
    }

    handleChangeStartDuration({target}) {
        const duration = target.value;
        this.props.onFromDurationChange(duration);
        if (this.props.validateRange) {
            const invalidRange = this.wrongDurationRange(
                duration && this.props.value.to && moment(this.props.value.to) < duration
            );
            this.setState({invalidStartDuration: ''});
            this.props.onInvalid(this.state.invalidEndDuration || invalidRange);
        }
    }

    handleChangeEndDuration({target}) {
        const duration = target.value;
        this.props.onToDurationChange(duration);
        if (this.props.validateRange) {
            const invalidRange = this.wrongDurationRange(
                duration && this.props.value.from && moment(this.props.value.from) > duration
            );
            this.setState({invalidStartDuration: ''});
            this.props.onInvalid(this.state.invalidStartDuration || invalidRange);
        }
    }

    wrongDurationRange(wrong) {
        if (!this.props.validateRange) {
            return false;
        }
        const invalid = wrong ? this.props.displayName + ' from should be less than to' : '';
        this.setState({invalidRange: invalid});
        return !!invalid;
    }

    handleInvalid(name, value) {
        if (value) {
            this.setState({['invalid' + name + 'Duration']: INVALID_DURATION, invalidRange: ''});
            this.props.onInvalid(true);
        } else {
            this.setState({['invalid' + name + 'Duration']: ''});
        }
    }

    focus() {}

    render() {
        return (
            <div style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                {!this.props.hideLabel && (
                    <label htmlFor="dashboard-rights-search-start-duration-text">{this.props.displayName}</label>
                )}
                <div className="row justify-content-around">
                    <div style={{width: '45%', paddingLeft: '8px'}}>
                        <AvForm>
                            <AvField
                                name={this.props.id + '-from'}
                                id={this.props.id + '-from'}
                                ref={this.refFirstInput}
                                value={this.props.value.from !== undefined ? this.props.value.from : ''}
                                onChange={this.handleChangeStartDuration}
                                onInvalid={value => {
                                    this.handleInvalid('Start', value);
                                }}
                                disabled={this.props.disabled}
                                onKeyPress={this.props.handleKeyPress}
                                type="text"
                            />
                        </AvForm>
                        {this.state.invalidStartDuration && (
                            <small className="text-danger ml-2" style={{position: 'absolute'}}>
                                {this.state.invalidStartDuration}
                            </small>
                        )}
                        {this.state.invalidRange && (
                            <small className="text-danger ml-2" style={{position: 'absolute'}}>
                                {this.state.invalidRange}
                            </small>
                        )}
                    </div>
                    <div>_</div>
                    <div style={{width: '45%', paddingRight: '8px'}}>
                        <AvForm>
                            <AvField
                                name={this.props.id + '-from'}
                                id={this.props.id + '-to'}
                                value={this.props.value.to !== undefined ? this.props.value.to : ''}
                                onChange={this.handleChangeEndDuration}
                                onInvalid={value => {
                                    this.handleInvalid('End', value);
                                }}
                                disabled={this.props.disabled}
                                onKeyPress={this.props.handleKeyPress}
                                type="text"
                            />
                        </AvForm>
                        {this.state.invalidEndDuration && (
                            <small className="text-danger ml-2" style={{position: 'absolute'}}>
                                {this.state.invalidEndDuration}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

RangeDuration.defaultProps = {
    validateRange: true,
};

RangeDuration.propTypes = {
    id: PropTypes.string,
    value: PropTypes.object,
    displayName: PropTypes.string,
    disabled: PropTypes.bool,
    onFromDurationChange: PropTypes.func,
    onToDurationChange: PropTypes.func,
    onInvalid: PropTypes.func,
    handleKeyPress: PropTypes.func,
    hideLabel: PropTypes.bool,
    validateRange: PropTypes.bool,
};
