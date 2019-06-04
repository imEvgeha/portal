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
                        <Col><b>Rating System: </b> {ratingSystem ? ratingSystem : this.emptySpan()}</Col>
                        <Col><b>Rating: </b> {rating ? rating : this.emptySpan()}</Col>
                        <Col><b>Advisory Codes: </b> {advisoriesCode ? 
                            advisoriesCode.map((code, i) => (
                                <span key={i}>{code},</span>
                            )) : 
                            this.emptySpan()}</Col>
                    </Row>

                    <Row style={{padding: '15px'}}>
                        <Col><b>Advisories: </b> {advisoriesFreeText ? advisoriesFreeText : this.emptySpan()}
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