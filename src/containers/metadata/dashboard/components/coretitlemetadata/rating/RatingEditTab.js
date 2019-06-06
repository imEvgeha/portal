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

class RatingEditTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredRatings: [],
            updatedRating: {}
        };
    }

    handleRatingSystemChange = (newValue) => {
        let newRating = {
            ...this.state.updatedRating,
            ratingSystem: newValue.target.value,
            rating: null
        };

        this.setState({
            updatedRating: newRating
        });

        this.props.handleEditChange(newRating, this.props.data);
    };

    handleRatingsChange = (newValue) => {
        let newRating = {
            ...this.state.updatedRating,
            rating: newValue.target.value
        };

        this.setState({
            updatedRating: newRating
        });

        this.props.handleEditChange(newRating, this.props.data);
    };

    handleAdvisoryCodesChange = (newValue) => {
        let newRating = {
            ...this.state.updatedRating,
            advisoriesCode: newValue.map(e => e.value)
        };

        this.setState({
            updatedRating: newRating
        });

        this.props.handleEditChange(newRating, this.props.data);
    };

    handleAdvisoriesChange = (newValue) => {
        let newRating = {
            ...this.state.updatedRating,
            advisoriesFreeText: newValue.target.value
        };

        this.setState({
            updatedRating: newRating
        });

        this.props.handleEditChange(newRating, this.props.data);
    };

    componentDidMount() {
        this.setState({
            updatedRating: this.props.data
        });
    }

    render() {
        const {
            ratingSystem,
            rating,
            advisoriesFreeText,
        } = this.state.updatedRating;
        return (
            <div id="ratingCreate">
                <Fragment>
                    <Row style={{ padding: '15px' }}>
                        <Col md={3}>
                            <b>Rating System<span style={{ color: 'red' }}>*</span></b>
                            <AvField type="select"
                                     name="ratingSystem"
                                     id="titleRatingSystem"
                                     onChange={(e) => this.handleRatingSystemChange(e)}
                                     value={ratingSystem}
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
                                     onChange={(e) => this.handleRatingsChange(e)}
                                     value={rating ? rating : ''}
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
                                onChange={(e) => this.handleAdvisoryCodesChange(e)}
                                value={this.props.data.advisoriesCode && this.props.data.advisoriesCode.map(e => {
                                    return {value: e, label: e};
                                })}
                                options={this.props.configAdvisoryCode && this.props.configAdvisoryCode.value.filter(e => e.ratingSystem === ratingSystem)
                                    .map(e => {
                                        return {value: e.name, label: e.name};
                                    })}
                                isMulti
                                placeholder='Select Advisory Code'
                            />
                        </Col>
                    </Row>

                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Advisories</b>
                            <AvField type="text"
                                     id="titleAdvisories"
                                     placeholder="Enter Advisories"
                                     name="advisories"
                                     onChange={(e) => this.handleAdvisoriesChange(e)}
                                     value={advisoriesFreeText ? advisoriesFreeText : ''}
                                     errorMessage="Please enter a valid advisories!" />
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

RatingEditTab.propTypes = {
    data: PropTypes.object.isRequired,
    handleEditChange: PropTypes.func.isRequired,
    configRatingSystem: PropTypes.object,
    configRatings: PropTypes.object,
    configAdvisoryCode: PropTypes.object
};

export default connect(mapStateToProps)(RatingEditTab);