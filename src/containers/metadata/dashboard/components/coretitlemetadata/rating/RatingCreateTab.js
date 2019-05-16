import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import Select from 'react-select';
import PropTypes from 'prop-types';
import {configFields} from '../../../../service/ConfigService';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        configRatingSystem: state.titleReducer.configData.find(e => e.key === configFields.RATING_SYSTEM),
        configRatings: state.titleReducer.configData.find(e => e.key === configFields.RATINGS),
        configAdvisoryCode: state.titleReducer.configData.find(e => e.key === configFields.ADVISORY_CODE),
    };
};

class RatingCreateTab extends Component {
    constructor(props) {
        super(props);
    }

    handleAdvisoryCodeChange = () => {};

    render() {
        return (
            <div id="ratingCreate">
                <Fragment>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Rating System<span style={{ color: 'red' }}>*</span></b>
                        </Col>
                        <Col md={2}>
                            <AvField type="select"
                                     name="ratingSystem"
                                     id="titleRatingSystem"
                                     onChange={this.props.handleChange}
                                     errorMessage="Field cannot be empty!">
                                <option value={''}>Select Rating System</option>
                                {
                                    this.props.configRatingSystem && this.props.configRatingSystem.value.map((item, i) => {
                                        return <option key={i} value={item.value}>{item.value}</option>;
                                    })
                                }
                            </AvField>
                        </Col>
                        <Col md={2}>
                            <b>Ratings</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="select"
                                     name="ratings"
                                     id="titleRatings"
                                     onChange={this.props.handleChange}
                                     errorMessage="Field cannot be empty!">
                                <option value={''}>Select Rating</option>
                                {
                                    this.props.configRatings && this.props.configRatings.value.map((item, i) => {
                                        return <option key={i} value={item.value}>{item.value}</option>;
                                    })
                                }
                            </AvField>
                        </Col>
                        <Col md={2}>
                            <b>Advisory Codes</b>
                        </Col>
                        <Col md={2}>
                            <Select
                                onChange={this.handleAdvisoryCodeChange}
                                options={this.props.configAdvisoryCode}
                                isMulti
                                placeholder='Select Advisory Code'
                            />
                        </Col>
                    </Row>

                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Advisories</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="tittleAdvisories" name="advisories"  onChange={this.props.handleChange} errorMessage="Please enter a valid advisories!" />
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

RatingCreateTab.propTypes = {
    handleChange: PropTypes.func.isRequired,
    configRatingSystem: PropTypes.array,
    configRatings: PropTypes.array,
    configAdvisoryCode: PropTypes.array
};

export default connect(mapStateToProps)(RatingCreateTab);