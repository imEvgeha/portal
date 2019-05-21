import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import Select from 'react-select';
import PropTypes from 'prop-types';

class RatingCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAdvisoryCode: null,
            advisoryCodeList: null
        };
    }

    handleAdvisoryCodeChange = (selectedAdvisoryCode) => {
        this.setState({ selectedAdvisoryCode });
    };

    handleChangeRatingSystem = (e) => {
        this.props.handleRatingSystemValue(e);
        this.props.handleChange(e);
    }

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
                                onChange={this.handleChangeRatingSystem}
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
                                name="rating"
                                id="titleRatings"
                                onChange={this.props.handleChange}
                                errorMessage="Field cannot be empty!">
                                <option value={''}>Select Rating</option>
                                {
                                    this.props.filteredRatings && this.props.filteredRatings.map((item, i) => {
                                        return <option key={i} value={item.name}>{item.name}</option>;
                                    })
                                }
                            </AvField>
                        </Col>
                        <Col md={6}>
                            <b>Advisory Codes</b>
                            <Select
                                value={this.state.selectedAdvisoryCode}
                                onChange={this.handleAdvisoryCodeChange}
                                isMulti
                                placeholder='Select Advisory Code'
                                options={this.props.advisoryCodeList}
                            />
                        </Col>
                    </Row>

                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Advisories</b>
                            <AvField type="text" id="tittleAdvisories" name="advisoriesFreeText" onChange={this.props.handleChange} errorMessage="Please enter a valid advisories!" />
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
    configAdvisoryCode: PropTypes.object,
    filteredRatings: PropTypes.array,
    handleRatingSystemValue: PropTypes.func
};

export default RatingCreateTab;