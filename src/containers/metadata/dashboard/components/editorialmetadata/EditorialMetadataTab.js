import React, {Component, Fragment} from 'react';
import {Col, Row} from 'reactstrap';
import PropTypes from 'prop-types';

class EditorialMetadataTab extends Component {
    render() {
        return (
            <div id="editorialContainer">
                <Fragment>
                    <Row style={{padding: '15px'}}>
                        <div><b>Locale: </b> {this.props.data.locale ? this.props.data.locale : <span style={{color: '#999'}}>Empty</span>}</div>
                        <div><b>Language: </b> {this.props.data.language ? this.props.data.language : <span style={{color: '#999'}}>Empty</span>}</div>
                        <div><b>Format: </b> {this.props.data.format ? this.props.data.format : <span style={{color: '#999'}}>Empty</span>}</div>
                        <div><b>Service: </b> {this.props.data.service ? this.props.data.service : <span style={{color: '#999'}}>Empty</span>}</div>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Display Title:</b> {this.props.data.title.title ? this.props.data.title.title : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Brief Title:</b> {this.props.data.title.shortTitle ? this.props.data.title.shortTitle : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Medium Title:</b> {this.props.data.title.mediumTitle ? this.props.data.title.mediumTitle : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Long Title:</b> {this.props.data.title.longTitle ? this.props.data.title.longTitle : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Short Title:</b> {this.props.data.title.sortTitle ? this.props.data.title.sortTitle : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Short Synopsis:</b> {this.props.data.synopsis.description ? this.props.data.synopsis.description : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Med Synopsis:</b> {this.props.data.synopsis.shortDescription ? this.props.data.synopsis.shortDescription : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Long Synopsis:</b> {this.props.data.synopsis.longDescription ? this.props.data.synopsis.longDescription : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

EditorialMetadataTab.propTypes = {
    data: PropTypes.object,
    titleContentType: PropTypes.string
};


export default EditorialMetadataTab;