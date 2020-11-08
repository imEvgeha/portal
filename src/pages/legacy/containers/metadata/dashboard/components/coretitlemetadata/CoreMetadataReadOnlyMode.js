import React, {Component} from 'react';
import {FormGroup, Alert, Row, Col, ListGroup, Card, CardHeader, CardBody} from 'reactstrap';
import {get} from 'lodash';
import Tag from '@atlaskit/tag';
import PropTypes from 'prop-types';
import {getFilteredCastList, getFilteredCrewList, getFormatTypeName} from '../../../../../constants/metadata/configAPI';
import TitleSystems from '../../../../../constants/metadata/systems';
import Rating from './rating/Rating';
import PersonListReadOnly from './PersonListReadOnly';
import {isNexusTitle} from '../utils/utils';
import {CHARACTER_NAME} from '../../../../../constants/metadata/constant-variables';
import './CoreMetadata.scss';
import {URL} from '../../../../../../../util/Common';

const {MOVIDA, VZ} = TitleSystems;

class CoreMetadataReadOnlyMode extends Component {
    render() {
        const {externalIds, id, legacyIds} = this.props.data;
        const nexusTitle = isNexusTitle(id);
        const vzExternalID = this.props.externalIDs && this.props.externalIDs.find(e => e.externalSystem === VZ);
        const movidaExternalID =
            this.props.externalIDs && this.props.externalIDs.find(e => e.externalSystem === MOVIDA);
        const vzId = nexusTitle ? get(vzExternalID, 'externalId', '') : get(legacyIds, 'vz.vzId', '');
        const vzTitleId = nexusTitle ? get(vzExternalID, 'externalTitleId', '') : get(legacyIds, 'vz.vzTitleId', '');
        const movidaId = nexusTitle ? get(movidaExternalID, 'externalId', '') : get(legacyIds, 'movida.movidaId', '');
        const movidaTitleId = nexusTitle
            ? get(movidaExternalID, 'externalTitleId', '')
            : get(legacyIds, 'movida.movidaTitleId', '');

        return (
            <>
                {this.props.data.castCrew && this.props.data.castCrew.length > 0 ? (
                    <Row style={{marginTop: '15px'}}>
                        <Col>
                            <Card id="cardContainer">
                                <CardHeader className="clearfix">
                                    <h4 className="float-left">Cast</h4>
                                </CardHeader>
                                <CardBody>
                                    <ListGroup
                                        style={{
                                            overflowY: 'scroll',
                                            overFlowX: 'hidden',
                                            maxHeight: '280px',
                                        }}
                                        id="listContainer"
                                    >
                                        {this.props.data.castCrew &&
                                            getFilteredCastList(this.props.data.castCrew, false).map((cast, i) => {
                                                return (
                                                    <PersonListReadOnly
                                                        key={i}
                                                        showPersonType={true}
                                                        person={cast}
                                                        columnName={CHARACTER_NAME}
                                                        getFormatTypeName={getFormatTypeName}
                                                    />
                                                );
                                            })}
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card id="cardContainer">
                                <CardHeader className="clearfix">
                                    <h4 className="float-left">Crew</h4>
                                </CardHeader>
                                <CardBody>
                                    <ListGroup
                                        style={{
                                            overflowY: 'scroll',
                                            overFlowX: 'hidden',
                                            maxHeight: '280px',
                                        }}
                                        id="listContainer"
                                    >
                                        {this.props.data.castCrew &&
                                            getFilteredCrewList(this.props.data.castCrew, false).map((crew, i) => (
                                                <PersonListReadOnly
                                                    key={i}
                                                    showPersonType={true}
                                                    person={crew}
                                                    getFormatTypeName={getFormatTypeName}
                                                />
                                            ))}
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                ) : null}
                <Row style={{marginTop: '10px'}}>
                    <Rating
                        activeTab={this.props.activeTab ? this.props.activeTab : 0}
                        isEditMode={false}
                        ratings={this.props.data.ratings}
                        toggle={this.props.toggleTitleRating}
                    />
                </Row>
                <Row style={{marginTop: '10px'}}>
                    {this.props.data.awards && this.props.data.awards.length > 0 ? (
                        <Col>
                            <FormGroup>
                                <Alert color="light">
                                    <b>Awards: </b> {this.props.data.awards}
                                </Alert>
                            </FormGroup>
                        </Col>
                    ) : null}
                </Row>
                <Row style={{marginTop: '10px'}}>
                    {this.props.data.imdbLink && this.props.data.imdbLink.length > 0 ? (
                        <Col>
                            <FormGroup>
                                <Alert color="light" style={{wordWrap: 'break-word'}}>
                                    <b>IMDb Link: </b> {this.props.data.imdbLink}
                                </Alert>
                            </FormGroup>
                        </Col>
                    ) : null}
                </Row>
                {externalIds || this.props.externalIDs ? (
                    <>
                        <hr />
                        <h4>External IDs</h4>
                        <div id="coreMetadataEditMode">
                            {externalIds && (
                                <>
                                    {externalIds.assetName && (
                                        <Row style={{marginTop: '10px'}}>
                                            <Col>
                                                <Alert color="light">
                                                    <b style={{color: '#000'}}>Asset Name: </b>
                                                    {externalIds.assetName}
                                                </Alert>
                                            </Col>
                                        </Row>
                                    )}
                                    {(externalIds.eidrTitleId || externalIds.tmsId) && (
                                        <Row style={{marginTop: '10px'}}>
                                            {externalIds.eidrTitleId ? (
                                                <Col>
                                                    <Alert color="light">
                                                        <b style={{color: '#000'}}>EIDR Title ID: </b>{' '}
                                                        {externalIds ? externalIds.eidrTitleId : null}
                                                    </Alert>
                                                </Col>
                                            ) : null}
                                            {externalIds.tmsId ? (
                                                <Col>
                                                    <Alert color="light">
                                                        <b style={{color: '#000'}}>TMS ID: </b>{' '}
                                                        {externalIds ? externalIds.tmsId : null}
                                                    </Alert>
                                                </Col>
                                            ) : null}
                                        </Row>
                                    )}
                                    {(externalIds.eidrEditId || externalIds.xfinityMovieId) && (
                                        <Row style={{marginTop: '10px'}}>
                                            {externalIds.eidrEditId ? (
                                                <Col>
                                                    <Alert color="light">
                                                        <b style={{color: '#000'}}>EIDR Edit ID:</b>{' '}
                                                        {externalIds ? externalIds.eidrEditId : null}
                                                    </Alert>
                                                </Col>
                                            ) : null}
                                            {externalIds.xfinityMovieId ? (
                                                <Col>
                                                    <Alert color="light">
                                                        <b style={{color: '#000'}}>Xfinity Movie ID:</b>{' '}
                                                        {externalIds ? externalIds.xfinityMovieId : null}
                                                    </Alert>
                                                </Col>
                                            ) : null}
                                        </Row>
                                    )}
                                    {externalIds.maId && (
                                        <Row style={{marginTop: '10px'}}>
                                            {externalIds.maId ? (
                                                <Col>
                                                    <Alert color="light">
                                                        <b style={{color: '#000'}}>MA ID:</b>{' '}
                                                        {externalIds ? externalIds.maId : null}
                                                    </Alert>
                                                </Col>
                                            ) : null}
                                        </Row>
                                    )}
                                    {get(this.props, 'data.licensors.length', 0) > 0 ? (
                                        <Row>
                                            <Col>
                                                <Alert color="light">
                                                    <b style={{color: '#000'}}>Licensors:</b>
                                                    {this.props.data.licensors.map(item => (
                                                        <span
                                                            key={item.licensor}
                                                            title={`${item.licensor} : ${item.licensorTitleId}`}
                                                        >
                                                            <Tag text={`${item.licensor} : ${item.licensorTitleId}`} />
                                                        </span>
                                                    ))}
                                                </Alert>
                                            </Col>
                                        </Row>
                                    ) : null}
                                    {externalIds.isan && (
                                        <Row style={{marginTop: '10px'}}>
                                            {externalIds.isan ? (
                                                <Col>
                                                    <Alert color="light">
                                                        <b style={{color: '#000'}}>ISAN:</b>{' '}
                                                        {externalIds ? externalIds.isan : null}
                                                    </Alert>
                                                </Col>
                                            ) : null}
                                        </Row>
                                    )}
                                </>
                            )}
                            {((externalIds && externalIds.alid) || vzTitleId) && (
                                <Row style={{marginTop: '10px'}}>
                                    {externalIds && externalIds.alid ? (
                                        <Col>
                                            <Alert color="light">
                                                <b style={{color: '#000'}}>ALID: </b>{' '}
                                                {externalIds ? externalIds.alid : null}
                                            </Alert>
                                        </Col>
                                    ) : null}
                                    {vzTitleId ? (
                                        <Col>
                                            <Alert color="light">
                                                <b style={{color: '#000'}}>VZ Title ID: </b>
                                                {vzTitleId}
                                            </Alert>
                                        </Col>
                                    ) : null}
                                </Row>
                            )}
                            {((externalIds && externalIds.cid) || movidaId) && (
                                <Row style={{marginTop: '10px'}}>
                                    {externalIds && externalIds.cid ? (
                                        <Col>
                                            <Alert color="light">
                                                <b style={{color: '#000'}}>C ID:</b>{' '}
                                                {externalIds ? externalIds.cid : null}
                                            </Alert>
                                        </Col>
                                    ) : null}
                                    {movidaId ? (
                                        <Col>
                                            <Alert color="light">
                                                <b style={{color: '#000'}}>Movida ID:</b> {movidaId}
                                            </Alert>
                                        </Col>
                                    ) : null}
                                </Row>
                            )}
                            {((externalIds && externalIds.isrc) || movidaTitleId) && (
                                <Row style={{marginTop: '10px'}}>
                                    {externalIds && externalIds.isrc ? (
                                        <Col>
                                            <Alert color="light">
                                                <b style={{color: '#000'}}>ISRC:</b>
                                                {externalIds ? externalIds.isrc : null}
                                            </Alert>
                                        </Col>
                                    ) : null}
                                    {movidaTitleId ? (
                                        <Col>
                                            <Alert color="light">
                                                <b style={{color: '#000'}}>Movida Title ID:</b> {movidaTitleId}
                                            </Alert>
                                        </Col>
                                    ) : null}
                                </Row>
                            )}
                            {vzId && (
                                <Row style={{marginTop: '10px'}}>
                                    <Col>
                                        <Alert color="light">
                                            <b style={{color: '#000'}}>VZ Vendor ID:</b> {vzId}
                                        </Alert>
                                    </Col>
                                </Row>
                            )}
                            <Row>
                                {get(externalIds, 'msvAssociationId.length', 0) > 0 ? (
                                    <Col>
                                        <Alert color="light">
                                            <b style={{color: '#000'}}>MSV Association ID:</b>{' '}
                                            {externalIds.msvAssociationId.map(item => (
                                                <span title={item}>
                                                    <Tag text={item} />
                                                </span>
                                            ))}
                                        </Alert>
                                    </Col>
                                ) : null}
                            </Row>
                        </div>
                    </>
                ) : null}
            </>
        );
    }
}

CoreMetadataReadOnlyMode.propTypes = {
    data: PropTypes.object,
    toggleTitleRating: PropTypes.func,
    activeTab: PropTypes.any,
    externalIDs: PropTypes.array,
};

export default CoreMetadataReadOnlyMode;
