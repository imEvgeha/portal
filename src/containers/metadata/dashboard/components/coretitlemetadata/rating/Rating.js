import React, { Component, Fragment } from 'react';
import { Row, Col, Container, TabContent, TabPane } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import RatingReadTab from './RatingReadTab';
import RatingCreateTab from './RatingCreateTab';
import RatingEditTab from './RatingEditTab';


class Rating extends Component {
    constructor(props) {
        super(props);
    }
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
                            return <span className={'tablinks'} style={{background: this.props.activeTab === i ? '#000' : '', color: this.props.activeTab === i ? '#FFF' : ''}} key={i} onClick={() => this.props.toggle(i)}><b>{item.ratingSystem + item.rating}</b></span>;
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
                                            <RatingCreateTab handleChange={this.props.handleChange} />
                                        </Col>
                                    </Row>
                                </TabPane>
                                {
                                    this.props.ratings && this.props.ratings.map((item, i) => {
                                        return (
                                            <TabPane key={i} tabId={i}>
                                                <Row>
                                                    <Col>
                                                        <RatingEditTab handleChange={this.props.handleEditChange} key={i} data={item} />
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
    toggle: PropTypes.func,
    addRating: PropTypes.func,
    createRatingTab: PropTypes.string,
    handleChange: PropTypes.func,
    handleEditChange: PropTypes.func
};



export default Rating;