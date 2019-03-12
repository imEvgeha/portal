import React, {Component, Fragment} from 'react';
import {Col, Row} from 'reactstrap';
import PropTypes from 'prop-types';
import {getLanguageByCode} from '../../../../../constants/language';
import '../territorymetadata/MetadataTerritoryTab.scss';

class EditorialMetadataTab extends Component {

    emptySpan = () => {
        return <span style={{color: '#999'}}>Empty</span>;
    };

    render() {
        return (
            <div id="editorialContainer">
                <Fragment>
                    <Row style={{padding: '15px'}}>
                        <Col md={3}><b>Locale: </b> {this.props.data.locale ? this.props.data.locale : this.emptySpan()}</Col>
                        <Col md={3}><b>Language: </b> {this.props.data.language ? getLanguageByCode(this.props.data.language) : this.emptySpan()}</Col>
                        <Col md={3}><b>Format: </b> {this.props.data.format ? this.props.data.format : this.emptySpan()}</Col>
                        <Col md={3}><b>Service: </b> {this.props.data.service ? this.props.data.service : this.emptySpan()}</Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Display Title:</b> {this.props.data.title ? (this.props.data.title.title ? this.props.data.title.title : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Brief Title:</b> {this.props.data.title ? (this.props.data.title.shortTitle ? this.props.data.title.shortTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Medium Title:</b> {this.props.data.title ? (this.props.data.title.mediumTitle ? this.props.data.title.mediumTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Long Title:</b> {this.props.data.title ? (this.props.data.title.longTitle ? this.props.data.title.longTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Short Title:</b> {this.props.data.title ? (this.props.data.title.sortTitle ? this.props.data.title.sortTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Short Synopsis:</b> {this.props.data.synopsis ? (this.props.data.synopsis.description ? this.props.data.synopsis.description : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Med Synopsis:</b> {this.props.data.synopsis ? (this.props.data.synopsis.shortDescription ? this.props.data.synopsis.shortDescription : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Long Synopsis:</b> {this.props.data.synopsis ? (this.props.data.synopsis.longDescription ? this.props.data.synopsis.longDescription : this.emptySpan()) : this.emptySpan()}
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