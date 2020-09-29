import React, {Component} from 'react';
import {Row, Col} from 'reactstrap';
import {AvField} from 'availity-reactstrap-validation';
import Select from 'react-select';
import PropTypes from 'prop-types';
import {BBFC_UK, MIDDLE_EAST} from '../../../../../../constants/metadata/ratings';

// eslint-disable-next-line react/no-unsafe
class RatingCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratingsForCreate: {},
            rating: [],
            isRatingExist: false,
            isAdvisoryRequired: false,
        };
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState({
            rating: this.props.ratings && this.props.ratings.map(e => e.rating),
        });
    }

    handleRatingSystemChange = newValue => {
        const newRating = {
            ...this.state.ratingsForCreate,
            ratingSystem: newValue.target.value,
            rating: null,
            advisoriesCode: null,
        };

        this.setState({
            ratingsForCreate: newRating,
        });

        if (newValue.target.value !== BBFC_UK && newValue.target.value !== MIDDLE_EAST) {
            this.setState({
                isAdvisoryRequired: false,
            });
        } else {
            this.setState({
                isAdvisoryRequired: true,
            });
        }

        this.props.handleRatingCreateChange(newRating);
    };

    handleRatingsChange = newValue => {
        const {rating, ratingsForCreate} = this.state;

        const {ratings} = this.props;

        let newRating = {
            ...ratingsForCreate,
            rating: newValue.target.value,
        };

        if (
            rating &&
            newRating.ratingSystem &&
            ratings.find(rating => newRating.ratingSystem === rating.ratingSystem) &&
            rating.includes(newValue.target.value)
        ) {
            this.setState({
                isRatingExist: true,
            });
        } else {
            this.setState({
                isRatingExist: false,
            });
        }
        this.setState({
            ratingsForCreate: newRating,
        });

        this.props.handleRatingCreateChange(newRating);
    };

    handleAdvisoryCodesChange = newValue => {
        const newRating = {
            ...this.state.ratingsForCreate,
            advisoriesCode: newValue.map(e => e.value),
        };

        this.setState({
            ratingsForCreate: newRating,
        });

        this.props.handleRatingCreateChange(newRating);
    };

    handleAdvisoriesChange = newValue => {
        const newRating = {
            ...this.state.ratingsForCreate,
            advisoriesFreeText: newValue.target.value,
        };

        this.setState({
            ratingsForCreate: newRating,
        });

        this.props.handleRatingCreateChange(newRating);
    };

    handleFieldLength = incorrectValue => {
        return name ? name.length : 0;
    };

    render() {
        const {ratingSystem, rating, advisoriesFreeText} = this.state.ratingsForCreate;
        return (
            <div id="ratingCreate">
                <Row style={{padding: '15px'}}>
                    <Col md={3}>
                        <b>
                            {' '}
                            Rating System<span style={{color: 'red'}}>*</span>
                        </b>
                        <AvField
                            type="select"
                            name="ratingSystem"
                            id="titleRatingSystem"
                            required={this.props.areRatingFieldsRequired}
                            onChange={e => this.handleRatingSystemChange(e)}
                            errorMessage="Field cannot be empty!"
                        >
                            <option value="">Select Rating System</option>
                            {this.props.configRatingSystem &&
                                this.props.configRatingSystem.value.map((item, i) => {
                                    return (
                                        <option key={i} value={item.value}>
                                            {item.value}
                                        </option>
                                    );
                                })}
                        </AvField>
                    </Col>
                    <Col md={3}>
                        <b>
                            {' '}
                            Ratings<span style={{color: 'red'}}>*</span>
                        </b>
                        <AvField
                            type="select"
                            name="rating"
                            id="titleRatings"
                            value={rating ? rating : ''}
                            required={this.props.areRatingFieldsRequired}
                            onChange={e => this.handleRatingsChange(e)}
                            errorMessage="Field cannot be empty!"
                        >
                            <option value="">Select Rating</option>
                            {this.props.configRatings &&
                                this.props.configRatings.value
                                    .filter(e => e.ratingSystem === ratingSystem)
                                    .map((item, i) => {
                                        return (
                                            <option key={i} value={item.name}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                        </AvField>
                        {this.state.isRatingExist && (
                            <AvField
                                type="text"
                                name="validation"
                                validate={{
                                    required: {value: this.state.isRatingExist, errorMessage: 'Rating already exists!'},
                                }}
                                hidden
                            />
                        )}
                    </Col>
                    <Col md={6}>
                        <b>Advisory Codes</b>
                        <Select
                            name="advisoriesCode"
                            value={
                                this.props.ratingObjectForCreate.advisoriesCode &&
                                this.props.ratingObjectForCreate.advisoriesCode.map(e => {
                                    return {value: e, label: this.props.getAdvisoryNameByCode(e)};
                                })
                            }
                            onChange={e => this.handleAdvisoryCodesChange(e)}
                            isMulti
                            placeholder="Select Advisory Code"
                            options={
                                this.props.configAdvisoryCode &&
                                this.props.configAdvisoryCode.value
                                    .filter(e => e.ratingSystem === ratingSystem)
                                    .map(e => {
                                        return {value: e.code, label: e.name};
                                    })
                            }
                        />
                    </Col>
                </Row>

                <Row style={{padding: '15px'}}>
                    <Col>
                        <b>Advisories{this.state.isAdvisoryRequired ? <span style={{color: 'red'}}>*</span> : null}</b>
                        <AvField
                            type="text"
                            value={advisoriesFreeText ? advisoriesFreeText : ''}
                            placeholder="Enter Advisories"
                            id="tittleAdvisories"
                            name="advisoriesFreeText"
                            required={this.state.isAdvisoryRequired}
                            onChange={e => this.handleAdvisoriesChange(e)}
                            errorMessage="Field cannot be empty!"
                            validate={{
                                maxLength: {value: 500, errorMessage: 'Too long Advisories. Max 500 symbols.'},
                            }}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: advisoriesFreeText
                                    ? this.handleFieldLength(advisoriesFreeText) === 500
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {advisoriesFreeText ? this.handleFieldLength(advisoriesFreeText) : 0}/500 char
                        </span>
                    </Col>
                </Row>
            </div>
        );
    }
}

RatingCreateTab.propTypes = {
    configRatingSystem: PropTypes.object,
    configRatings: PropTypes.object,
    configAdvisoryCode: PropTypes.object,
    ratingObjectForCreate: PropTypes.object,
    areRatingFieldsRequired: PropTypes.bool,
    handleRatingCreateChange: PropTypes.func,
    ratings: PropTypes.array,
    getAdvisoryNameByCode: PropTypes.func,
};

export default RatingCreateTab;
