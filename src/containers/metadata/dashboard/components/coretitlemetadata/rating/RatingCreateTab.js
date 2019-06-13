import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import Select from 'react-select';
import PropTypes from 'prop-types';

class RatingCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advisoriesCode: null,
            filteredAdvisoryCodes: [],
            ratingsForCreate: {}
        };
    }

    handleRatingSystemChange = (newValue) => {
        let newRating = {
            ...this.state.ratingsForCreate,
            ratingSystem: newValue.target.value,
            rating: null
        };

        this.setState({
            ratingsForCreate: newRating
        });

        this.props.handleRatingCreateChange(newRating);
    };

    handleRatingsChange = (newValue) => {
        let newRating = {
            ...this.state.ratingsForCreate,
            rating: newValue.target.value
        };

        this.setState({
            ratingsForCreate: newRating
        });

        this.props.handleRatingCreateChange(newRating);
    };

    handleAdvisoryCodesChange = (newValue) => {
        let newRating = {
            ...this.state.ratingsForCreate,
            advisoriesCode: newValue.map(e => e.value)
        };

        this.setState({
            ratingsForCreate: newRating
        });

        this.props.handleRatingCreateChange(newRating);
    };

    handleAdvisoriesChange = (newValue) => {
        let newRating = {
            ...this.state.ratingsForCreate,
            advisoriesFreeText: newValue.target.value
        };

        this.setState({
            ratingsForCreate: newRating
        });

        this.props.handleRatingCreateChange(newRating);
    };

    filteredAdvisoryCodes = (e) => {
        // this.props.configAdvisoryCode.value
        const ratingSystem = e.target.value;
        let newAdvisoryCodes = this.props.configAdvisoryCode && this.props.configAdvisoryCode.value.filter(e => e.ratingSystem === ratingSystem);
        if (newAdvisoryCodes.length > 0) {
            for (let i = 0; i < newAdvisoryCodes.length; i++) {
                newAdvisoryCodes[i].label = newAdvisoryCodes[i]['name'];
                newAdvisoryCodes[i].value = newAdvisoryCodes[i]['name'];
            }
        }
        this.setState({
            filteredAdvisoryCodes: newAdvisoryCodes
        });
    }

    handleChangeRatingSystem = (e) => {
        this.setState({
            filteredAdvisoryCodes: []
        });
        this.props.handleRatingSystemValue(e);
        this.props.handleChange(e);
        this.filteredAdvisoryCodes(e);
    }

    renderAdvisoryCodes = () => {
        return this.state.filteredAdvisoryCodes.length > 0 ? this.state.filteredAdvisoryCodes : [];
    }

    render() {
        const {
            ratingSystem,
            rating,
            advisoriesFreeText,
        } = this.state.ratingsForCreate;
        return (
            <div id="ratingCreate">
                <Fragment>
                    <Row style={{ padding: '15px' }}>
                        <Col md={3}>
                            <b>Rating System<span style={{ color: 'red' }}>*</span></b>
                            <AvField type="select"
                                name="ratingSystem"
                                id="titleRatingSystem"
                                required={this.props.areRatingFieldsRequired}
                                onChange={(e) => this.handleRatingSystemChange(e)}
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
                            <b>Ratings<span style={{ color: 'red' }}>*</span></b>
                            <AvField type="select"
                                name="rating"
                                id="titleRatings"
                                required={this.props.areRatingFieldsRequired}
                                onChange={(e) => this.handleRatingsChange(e)}
                                errorMessage="Field cannot be empty!">
                                <option value={''}>Select Rating</option>
                                {
                                    this.props.configRatings && this.props.configRatings.value.filter(e => e.ratingSystem === ratingSystem).map((item, i) => {
                                        return <option key={i} value={item.name}>{item.name}</option>;
                                    })
                                }
                            </AvField>
                        </Col>
                        <Col md={6}>
                            <b>Advisory Codes</b>
                            <Select
                                name="advisoriesCode"
                                value={this.props.ratingObjectForCreate.advisoriesCode && this.props.ratingObjectForCreate.advisoriesCode.map(e => {
                                    return {value: e, label: e};
                                })}
                                onChange={(e) => this.handleAdvisoryCodesChange(e)}
                                isMulti
                                placeholder='Select Advisory Code'
                                options={this.props.configAdvisoryCode && this.props.configAdvisoryCode.value.filter(e => e.ratingSystem === ratingSystem)
                                    .map(e => {
                                        return { value: e.name, label: e.name };
                                    })}
                            />
                        </Col>
                    </Row>

                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Advisories</b>
                            <AvField type="text" placeholder="Enter Advisories" id="tittleAdvisories" name="advisoriesFreeText" onChange={this.props.handleChange} errorMessage="Please enter a valid advisories!" />
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
    handleRatingSystemValue: PropTypes.func,
    ratingObjectForCreate: PropTypes.object,
    handleAdvisoryCodeChange: PropTypes.func,
    areRatingFieldsRequired: PropTypes.bool
};

export default RatingCreateTab;