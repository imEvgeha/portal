import React, { Component } from 'react';
import {
    FormGroup,
    Alert,
    Row,
    Col,
    ListGroup,
    Card,
    CardHeader,
    CardBody,
} from 'reactstrap';
import { get } from 'lodash';
import Tag from '@atlaskit/tag'
import PropTypes from 'prop-types';
import {
    getFilteredCastList,
    getFilteredCrewList, getFormatTypeName,
} from '../../../../../constants/metadata/configAPI';
import Rating from './rating/Rating';
import PersonListReadOnly from './PersonListReadOnly';
import { CHARACTER_NAME } from '../../../../../constants/metadata/constant-variables';
import './CoreMetadata.scss';

class CoreMetadataReadOnlyMode extends Component {

    render() {
        const {legacyIds, externalIds} = this.props.data;
        return (
            <>
                {
                    this.props.data.castCrew && this.props.data.castCrew.length > 0 ? (
                        <Row style={{ marginTop: '15px' }}>
                            <Col>
                                <Card id='cardContainer'>
                                    <CardHeader className='clearfix'>
                                        <h4 className='float-left'>Cast</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <ListGroup
                                            style={{
                                                overflowY: 'scroll',
                                                overFlowX: 'hidden',
                                                maxHeight: '280px'
                                            }}
                                            id='listContainer'
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
                                <Card id='cardContainer'>
                                    <CardHeader className='clearfix'>
                                        <h4 className='float-left'>Crew</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <ListGroup
                                            style={{
                                                overflowY: 'scroll',
                                                overFlowX: 'hidden',
                                                maxHeight: '280px'
                                            }}
                                            id='listContainer'
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
                      )
                        : null
                }
                <Row style={{ marginTop: '10px' }}>
                    <Rating
                        activeTab={this.props.activeTab ? this.props.activeTab : 0}
                        isEditMode={false}
                        ratings={this.props.data.ratings}
                        toggle={this.props.toggleTitleRating}
                    />
                </Row>
                <Row style={{ marginTop: '10px' }}>
                    {
                        this.props.data.awards && this.props.data.awards.length > 0 ? (
                            <Col>
                                <FormGroup>
                                    <Alert color='light'><b>Awards: </b> {this.props.data.awards}</Alert>
                                </FormGroup>
                            </Col>
                          )
                            : null
                    }
                </Row>
                <Row style={{ marginTop: '10px' }}>
                    {
                        this.props.data.imdbLink && this.props.data.imdbLink.length > 0 ? (
                            <Col>
                                <FormGroup>
                                    <Alert color='light' style={{wordWrap: 'break-word'}}><b>IMDb Link: </b> {this.props.data.imdbLink}</Alert>
                                </FormGroup>
                            </Col>
                          )
                            : null
                    }
                </Row>
                {externalIds || legacyIds ? (
                    <>
                        <hr />
                        <h4>External IDs</h4>
                        <div id="coreMetadataEditMode">
                            {  externalIds && (
                                <>
                                    {
                                        externalIds.assetName && (
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col>
                                                    <Alert color='light'><b style={{ color: '#000' }}>Asset Name: </b>{externalIds.assetName}</Alert>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                    { (externalIds.eidrTitleId ||  externalIds.tmsId) && (
                                    <Row style={{ marginTop: '10px' }}>
                                        {
                                            externalIds.eidrTitleId ? (
                                                <Col>
                                                    <Alert color='light'><b style={{ color: '#000' }}>EIDR Title ID: </b> {externalIds ? externalIds.eidrTitleId : null}</Alert>
                                                </Col>
                                            ) : null
                                        }
                                        {
                                            externalIds.tmsId ? (
                                                <Col>
                                                    <Alert color='light'><b style={{ color: '#000' }}>TMS ID: </b> {externalIds ? externalIds.tmsId : null}</Alert>
                                                </Col>
                                            ) : null
                                        }
                                    </Row>
                                          )}
                                    {(externalIds.eidrEditId || externalIds.xfinityMovieId) && (
                                        <Row style={{marginTop: '10px'}}>
                                            {
                                                externalIds.eidrEditId ? (
                                                    <Col>
                                                        <Alert color='light'>
                                                            <b style={{color: '#000'}}>
                                                                EIDR Edit ID:
                                                            </b> {externalIds ? externalIds.eidrEditId : null}
                                                        </Alert>
                                                    </Col>
                                                  ) : null
                                            }
                                            {
                                                externalIds.xfinityMovieId ? (
                                                    <Col>
                                                        <Alert color='light'>
                                                            <b style={{color: '#000'}}>
                                                                Xfinity Movie ID:
                                                            </b> {externalIds ? externalIds.xfinityMovieId : null}
                                                        </Alert>
                                                    </Col>
                                                  ) : null
                                            }
                                        </Row>
                                      )}
                                    {(externalIds.maId || externalIds.licensorTitleId) && (
                                        <Row style={{marginTop: '10px'}}>
                                            {
                                                externalIds.maId ? (
                                                    <Col>
                                                        <Alert color='light'>
                                                            <b style={{color: '#000'}}>
                                                                MA ID:
                                                            </b> {externalIds ? externalIds.maId : null}
                                                        </Alert>
                                                    </Col>
                                                  ) : null
                                            }
                                            {
                                                externalIds.licensorTitleId ? (
                                                    <Col>
                                                        <Alert color='light'>
                                                            <b style={{color: '#000'}}>
                                                                Licensor Title ID:
                                                            </b> {externalIds ? externalIds.licensorTitleId : null}
                                                        </Alert>
                                                    </Col>
                                                  ) : null
                                            }
                                        </Row>
                                      )}
                                    {externalIds.isan && (
                                        <Row style={{marginTop: '10px'}}>
                                            {
                                                externalIds.isan ? (
                                                    <Col>
                                                        <Alert color='light'>
                                                            <b style={{color: '#000'}}>
                                                                ISAN:
                                                            </b> {externalIds ? externalIds.isan : null}
                                                        </Alert>
                                                    </Col>
                                                  ) : null
                                            }
                                        </Row>
                                      )}
                                </>
                              )}
                            {((externalIds && externalIds.alid) || (legacyIds && legacyIds.vz)) && (
                                <Row style={{ marginTop: '10px' }}>
                                    {
                                        externalIds && externalIds.alid ? (
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>ALID: </b> {externalIds ? externalIds.alid : null}</Alert>
                                            </Col>
                                          ) : null
                                    }
                                    {
                                        legacyIds && legacyIds.vz ? (
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>VZ Title ID: </b> {legacyIds.vz.vzTitleId ? legacyIds.vz.vzTitleId : null}</Alert>
                                            </Col>
                                          ) : null
                                    }
                                </Row>
                              )}
                            {((externalIds && externalIds.cid) || (legacyIds && legacyIds.movida)) && (
                                <Row style={{marginTop: '10px'}}>
                                    {
                                        externalIds && externalIds.cid ? (
                                            <Col>
                                                <Alert color='light'>
                                                    <b style={{color: '#000'}}>
                                                        C ID:
                                                    </b> {externalIds ? externalIds.cid : null}
                                                </Alert>
                                            </Col>
                                          ) : null
                                    }
                                    {
                                        legacyIds && legacyIds.movida && legacyIds.movida.movidaId ? (
                                            <Col>
                                                <Alert color='light'>
                                                    <b style={{color: '#000'}}>
                                                        Movida ID:
                                                    </b> {legacyIds.movida.movidaId ? legacyIds.movida.movidaId : null}
                                                </Alert>
                                            </Col>
                                          ) : null
                                    }
                                </Row>
                              )}
                            {((externalIds && externalIds.isrc) || (legacyIds && legacyIds.movida)) && (
                                <Row style={{marginTop: '10px'}}>
                                    {
                                        externalIds && externalIds.isrc ? (
                                            <Col>
                                                <Alert color='light'>
                                                    <b style={{color: '#000'}}>
                                                        ISRC:
                                                    </b>
                                                    {externalIds ? externalIds.isrc : null}
                                                </Alert>
                                            </Col>
                                          ) : null
                                    }
                                    {
                                        legacyIds && legacyIds.movida && legacyIds.movida.movidaTitleId ? (
                                            <Col>
                                                <Alert color='light'>
                                                    <b style={{color: '#000'}}>
                                                        Movida Title ID:
                                                    </b> {legacyIds.movida.movidaTitleId ? legacyIds.movida.movidaTitleId : null}
                                                </Alert>
                                            </Col>
                                          ) : null
                                    }
                                </Row>
                              )}
                            {((legacyIds && legacyIds.vz && legacyIds.vz.vzId )) && (
                                <Row style={{marginTop: '10px'}}>
                                    <Col>
                                        <Alert color='light'>
                                            <b style={{color: '#000'}}>
                                                VZ Vendor ID:
                                            </b> {legacyIds.vz.vzId}
                                        </Alert>
                                    </Col>
                                </Row>
                            )}
                            <Row>
                                {get(externalIds, 'msvAssociationId.length', 0) > 0 ? (
                                    <Col>
                                        <Alert color='light'>
                                            <b style={{color: '#000'}}>
                                                MSV Association ID:
                                            </b> {externalIds.msvAssociationId.map(item => <span title={item}><Tag text={item}/></span>)}
                                        </Alert>
                                    </Col>
                                ) : null }
                            </Row>

                        </div>
                    </>
                  )
                    : null}
            </>
        );
    }
}

CoreMetadataReadOnlyMode.propTypes = {
    data: PropTypes.object,
    toggleTitleRating: PropTypes.func,
    activeTab: PropTypes.any,
    externalIDs: PropTypes.object.isRequired,
};

export default CoreMetadataReadOnlyMode;
