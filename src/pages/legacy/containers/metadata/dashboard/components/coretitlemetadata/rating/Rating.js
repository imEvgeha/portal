import React, {Component, Fragment} from 'react';
import {Row, Col, Container, TabContent, TabPane, Tooltip} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import RatingReadTab from './RatingReadTab';
import RatingCreateTab from './RatingCreateTab';
import RatingEditTab from './RatingEditTab';
import {connect} from 'react-redux';
import {configFields} from '../../../../service/ConfigService';

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
            advisoryCodeList: [],
            tooltipOpen: false,
        };
    }

    getAdvisoryNameByCode = code => {
        if (this.props.configAdvisoryCode) {
            const found = this.props.configAdvisoryCode.value.find(e => e.code === code);
            if (found) {
                return found.name;
            }
        }
        return code;
    };

    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen,
        });
    };

    handleRatingSystemValue = e => {
        const rating = e.target.value;
        const newRatings =
            this.props.configRatings && this.props.configRatings.value.filter(e => e.ratingSystem === rating);
        this.setState({
            filteredRatings: newRatings,
        });
    };
    render() {
        return (
            <Container fluid id="ratingContainer" style={{marginTop: '30px'}}>
                {(this.props.ratings && this.props.ratings.length > 0) || this.props.isEditMode ? (
                    <h4>Ratings</h4>
                ) : null}
                <div className="tab">
                    {this.props.isEditMode ? (
                        <>
                            <FontAwesome
                                className="tablinks add-local"
                                name="plus-circle"
                                id="createRatings"
                                onClick={() => this.props.addRating(this.props.createRatingTab)}
                                key={this.props.createRatingTab}
                                size="lg"
                            />
                            <Tooltip
                                placement="top"
                                isOpen={this.state.tooltipOpen}
                                target="createRatings"
                                toggle={this.toggle}
                            >
                                Create Rating
                            </Tooltip>
                        </>
                    ) : null}
                    {this.props.ratings &&
                        this.props.ratings.map((item, i) => {
                            return (
                                <span
                                    className="tablinks"
                                    style={{
                                        background: this.props.activeTab === i ? '#000' : '',
                                        color: this.props.activeTab === i ? '#FFF' : '',
                                    }}
                                    key={i}
                                    onClick={() => this.props.toggle(i)}
                                >
                                    <b>
                                        {(item.ratingSystem ? item.ratingSystem : 'Empty') +
                                            ' ' +
                                            (item.rating ? item.rating : 'Empty')}
                                    </b>
                                </span>
                            );
                        })}
                </div>
                <TabContent activeTab={this.props.activeTab}>
                    {this.props.ratings && this.props.ratings.length > 0
                        ? !this.props.isEditMode &&
                          this.props.ratings.map((item, i) => {
                              return (
                                  <TabPane key={i} tabId={i}>
                                      <Row>
                                          <Col>
                                              <RatingReadTab
                                                  getAdvisoryNameByCode={this.getAdvisoryNameByCode}
                                                  key={i}
                                                  data={item}
                                              />
                                          </Col>
                                      </Row>
                                  </TabPane>
                              );
                          })
                        : null}
                    {this.props.isEditMode ? (
                        <>
                            <TabPane tabId={this.props.createRatingTab}>
                                <Row>
                                    <Col>
                                        <RatingCreateTab
                                            handleRatingCreateChange={this.props.handleRatingCreateChange}
                                            areRatingFieldsRequired={this.props.areRatingFieldsRequired}
                                            ratingObjectForCreate={this.props.ratingObjectForCreate}
                                            configRatings={this.props.configRatings}
                                            handleRatingSystemValue={this.handleRatingSystemValue}
                                            filteredRatings={this.state.filteredRatings}
                                            configRatingSystem={this.props.configRatingSystem}
                                            configAdvisoryCode={this.props.configAdvisoryCode}
                                            advisoryCodeList={this.state.advisoryCodeList}
                                            ratings={this.props.ratings}
                                            getAdvisoryNameByCode={this.getAdvisoryNameByCode}
                                        />
                                    </Col>
                                </Row>
                            </TabPane>
                            {this.props.ratings &&
                                this.props.ratings.map((item, i) => {
                                    return (
                                        <TabPane key={i} tabId={i}>
                                            <Row>
                                                <Col>
                                                    <RatingEditTab
                                                        handleEditChange={this.props.handleEditChange}
                                                        configRatingSystem={this.props.configRatingSystem}
                                                        configRatings={this.props.configRatings}
                                                        configAdvisoryCode={this.props.configAdvisoryCode}
                                                        advisoryCodeList={this.state.advisoryCodeList}
                                                        getAdvisoryNameByCode={this.getAdvisoryNameByCode}
                                                        key={i}
                                                        data={item}
                                                    />
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    );
                                })}
                        </>
                    ) : null}
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
    handleEditChange: PropTypes.func,
    configRatings: PropTypes.object,
    configRatingSystem: PropTypes.object,
    configAdvisoryCode: PropTypes.object,
    ratingObjectForCreate: PropTypes.object,
    areRatingFieldsRequired: PropTypes.bool,
    handleRatingCreateChange: PropTypes.func,
};

export default connect(mapStateToProps)(Rating);
