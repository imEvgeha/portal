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
            <div id="editorialMetadataTabs">
                <Fragment>
                    <Row style={{padding: '15px'}}>
                        <Col md={3}><b>Locale: </b> {this.props.data.locale ? this.props.data.locale : this.emptySpan()}</Col>
                        <Col md={3}><b>Language: </b> {this.props.data.language ? getLanguageByCode(this.props.data.language) : this.emptySpan()}</Col>
                        <Col md={3}><b>Format: </b> {this.props.data.format ? this.props.data.format : this.emptySpan()}</Col>
                        <Col md={3}><b>Service: </b> {this.props.data.service ? this.props.data.service : this.emptySpan()}</Col>
                    </Row>

                    {(this.props.titleContentType === 'EPISODE' || this.props.titleContentType === 'SEASON') &&
                    <Row style={{padding: '15px'}}>
                        <Col md={3}><b>Series Name: </b> {this.props.data.seriesName ? this.props.data.seriesName : this.emptySpan()}</Col>
                        <Col md={3}><b>Season Number: </b> {this.props.data.seasonNumber ? this.props.data.seasonNumber : this.emptySpan()}</Col>
                        {this.props.titleContentType === 'EPISODE' &&
                        <Col md={3}><b>Episode Number: </b> {this.props.data.episodeNumber ? this.props.data.episodeNumber : this.emptySpan()}</Col>
                        }
                    </Row>}

                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Display Title:</b> {this.props.data.title ? (this.props.data.title.title ? this.props.data.title.title : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Brief Title:</b> {this.props.data.title ? (this.props.data.title.shortTitle ? this.props.data.title.shortTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Medium Title:</b> {this.props.data.title ? (this.props.data.title.mediumTitle ? this.props.data.title.mediumTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Long Title:</b> {this.props.data.title ? (this.props.data.title.longTitle ? this.props.data.title.longTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Short Title:</b> {this.props.data.title ? (this.props.data.title.sortTitle ? this.props.data.title.sortTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Short Synopsis:</b> {this.props.data.synopsis ? (this.props.data.synopsis.description ? this.props.data.synopsis.description : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Med Synopsis:</b> {this.props.data.synopsis ? (this.props.data.synopsis.shortDescription ? this.props.data.synopsis.shortDescription : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Long Synopsis:</b> {this.props.data.synopsis ? (this.props.data.synopsis.longDescription ? this.props.data.synopsis.longDescription : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Copyright:</b> {this.props.data.copyright ? this.props.data.copyright : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            <b>Awards:</b> {this.props.data.awards ? this.props.data.awards : this.emptySpan()}
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