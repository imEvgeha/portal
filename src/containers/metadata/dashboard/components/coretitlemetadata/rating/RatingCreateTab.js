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
                        <Col md={3}>
                            <b>Rating System<span style={{ color: 'red' }}>*</span></b>
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
                        <Col md={3}>
                            <b>Ratings</b>
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
                        <Col md={6}>
                            <b>Advisory Codes</b>
                            <Select
                                onChange={this.handleAdvisoryCodeChange}
                                isMulti
                                placeholder='Select Advisory Code'
                            />
                        </Col>
                    </Row>

                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Advisories</b>
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
    configRatingSystem: PropTypes.object,
    configRatings: PropTypes.object,
    configAdvisoryCode: PropTypes.object
};

export default connect(mapStateToProps)(RatingCreateTab);