import React, { Component, Fragment } from 'react';
import { Row, Col, Container, TabContent, TabPane } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import RatingReadTab from './RatingReadTab';
import RatingCreateTab from './RatingCreateTab';
import RatingEditTab from './RatingEditTab';
import { connect } from 'react-redux';
import { configFields } from '../../../../service/ConfigService';

const mapStateToProps = state => {
    return {
        configRatingSystem: state.titleReducer.configData.find(e => e.key === configFields.RATING_SYSTEM),
        configRatings: state.titleReducer.configData.find(e => e.key === configFields.RATINGS),
        configAdvisoryCode: state.titleReducer.configData.find(e => e.key === configFields.ADVISORY_CODE),
    };
};

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredRatings: [],
            advisoryCodeList: []
        };
    }

    handleRatingSystemValue = (e) => {
        const rating = e.target.value;
        let newRatings = this.props.configRatings && this.props.configRatings.value.filter(e => e.ratingSystem === rating);
        this.setState({
            filteredRatings: newRatings
        });

    };
    render() {
        return (
            <Container fluid id="ratingContainer" style={{ marginTop: '30px' }}>
                <div className='tab'>
                    {
                        this.props.isEditMode ?
                            <FontAwesome className={'tablinks add-local'} name="plus-circle" onClick={() => this.props.addRating(this.props.createRatingTab)} key={this.props.createRatingTab} size="lg" />
                            : null
                    }
                    {
                        this.props.ratings && this.props.ratings.map((item, i) => {
                            return <span className={'tablinks'} style={{ background: this.props.activeTab === i ? '#000' : '', color: this.props.activeTab === i ? '#FFF' : '' }} key={i} onClick={() => this.props.toggle(i)}><b>{item.ratingSystem + ' ' + item.rating}</b></span>;
                        })
                    }
                </div>
                <TabContent activeTab={this.props.activeTab}>
                    {
                        this.props.ratings && this.props.ratings.length > 0 ?
                            !this.props.isEditMode && this.props.ratings.map((item, i) => {
                                return (
                                    <TabPane key={i} tabId={i}>
                                        <Row>
                                            <Col>
                                                <RatingReadTab key={i} data={item} />
                                            </Col>
                                        </Row>
                                    </TabPane>);
                            }) : null
                    }
                    {
                        this.props.isEditMode ?
                            <Fragment>
                                <TabPane tabId={this.props.createRatingTab}>
                                    <Row>
                                        <Col>
                                            <RatingCreateTab
                                                handleAdvisoryCodeChange={this.props.handleAdvisoryCodeChange}
                                                ratingObjectForCreate={this.props.ratingObjectForCreate}
                                                handleChange={this.props.handleChange}
                                                handleRatingSystemValue={this.handleRatingSystemValue}
                                                filteredRatings={this.state.filteredRatings}
                                                configRatingSystem={this.props.configRatingSystem}
                                                configAdvisoryCode={this.props.configAdvisoryCode}
                                                advisoryCodeList={this.state.advisoryCodeList}
                                            />
                                        </Col>
                                    </Row>
                                </TabPane>
                                {
                                    this.props.ratings && this.props.ratings.map((item, i) => {
                                        return (
                                            <TabPane key={i} tabId={i}>
                                                <Row>
                                                    <Col>
                                                        <RatingEditTab
                                                            handleChange={this.props.handleEditChange}
                                                            configRatingSystem={this.props.configRatingSystem}
                                                            configRatings={this.props.configRatings}
                                                            configAdvisoryCode={this.props.configAdvisoryCode}
                                                            advisoryCodeList={this.state.advisoryCodeList}
                                                            key={i}
                                                            data={item} />
                                                    </Col>
                                                </Row>
                                            </TabPane>);
                                    })
                                }
                            </Fragment>
                            : null
                    }
                </TabContent>
            </Container>
        );
    }
}

Rating.propTypes = {
    isEditMode: PropTypes.bool,
    ratings: PropTypes.array,
    activeTab: PropTypes.any,
    toggle: PropTypes.func.isRequired,
    addRating: PropTypes.func,
    createRatingTab: PropTypes.string,
    handleChange: PropTypes.func,
    handleEditChange: PropTypes.func,
    configRatings: PropTypes.object,
    configRatingSystem: PropTypes.object,
    configAdvisoryCode: PropTypes.object,
    handleAdvisoryCodeChange: PropTypes.func,
    ratingObjectForCreate: PropTypes.object
};

export default connect(mapStateToProps)(Rating);