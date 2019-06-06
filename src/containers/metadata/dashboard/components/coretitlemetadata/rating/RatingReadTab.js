import React, {Component, Fragment} from 'react';
import {Col, Row} from 'reactstrap';
import PropTypes from 'prop-types';

class RatingReadTab extends Component {

    emptySpan = () => {
        return <span style={{color: '#999'}}>Empty</span>;
    };

    render() {
        const {
            ratingSystem,
            rating,
            advisoriesFreeText,
            advisoriesCode
        } = this.props.data;
        return (
            <div id="titleRatingTabs">
                <Fragment>
                    <Row style={{padding: '15px'}}>
                        <Col md={3}><b>Rating System: </b> {ratingSystem ? ratingSystem : this.emptySpan()}</Col>
                        <Col md={3}><b>Rating: </b> {rating ? rating : this.emptySpan()}</Col>
                        <Col md={3}><b>Advisory Codes: </b> {advisoriesCode ? 
                            advisoriesCode.map((code, i) => (
                                advisoriesCode.length === i + 1 ? <span key={i}>{code}</span> : <span key={i}>{code},</span>
                            )) : 
                            this.emptySpan()}</Col>
                    </Row>

                    <Row style={{padding: '15px'}}>
                        <Col md={3}><b>Advisories: </b> {advisoriesFreeText ? advisoriesFreeText : this.emptySpan()}
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

RatingReadTab.propTypes = {
    data: PropTypes.object
};


export default RatingReadTab;