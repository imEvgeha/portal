import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Label,
  Container,
  Progress,
  Alert,
  FormGroup,
  Input
} from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import CoreMetadataEditMode from './coretitlemetadata/CoreMetadataEditMode';
import {connect} from 'react-redux';
import {configFields} from '../../service/ConfigService';
import {
  ADVERTISEMENT,
  EPISODE,
  MOVIE,
  SEASON,
  SERIES,
  toPrettyContentTypeIfExist
} from '../../../../constants/metadata/contentType';

const mapStateToProps = state => {
  return {
    configLanguage: state.titleReducer.configData.find(e => e.key === configFields.LANGUAGE),
    configLocale: state.titleReducer.configData.find(e => e.key === configFields.LOCALE),
  };
};

class TitleEditMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      isSeriesCompleted: false
    };
  }

  render() {
    const {
      title,
      contentType,
      releaseYear,
      boxOffice,
      animated,
      duration,
      eventType,
      seasonFinale,
      seasonPremiere,
      totalNumberOfSeasons,
      originalLanguage,
      countryOfOrigin,
      totalNumberOfEpisodes,
      episodic
    } = this.props.data;

    return (
      <Fragment>
        <Container fluid id='titleContainer' onKeyDown={this.props.keyPressed}>
          <Row>
            <Col xs='4'>
              <img
                src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
                alt='Slide'
              />
            </Col>
            <Col>
              <Row>
                <Col>
                  <Label for='title'>
                    Title<span style={{ color: 'red' }}>*</span>
                  </Label>
                  <AvField
                    name='title'
                    errorMessage='Please enter a valid title!'
                    id='title'
                    value={title ? title : ''}
                    placeholder='Enter Title'
                    onChange={this.props.handleOnChangeEdit}
                    validate={{
                      required: { errorMessage: 'Field cannot be empty!' },
                      maxLength: { value: 200 }
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label for='titleContentType'>Content Type</Label>
                  <Alert color='light' id='titleContentType'>
                    <b>{toPrettyContentTypeIfExist(contentType)}</b>
                  </Alert>
                </Col>
              </Row>
              {contentType !== MOVIE.apiName && contentType !== SERIES.apiName && contentType !== ADVERTISEMENT.apiName ? (
                <Fragment>
                  {this.props.data.episodic !== null ? (
                    <Fragment>
                      <Row>
                        <Col>
                          <Label for='titleSeriesName'>Series</Label>
                          <AvField
                            readOnly
                            type='text'
                            name='seriesTitleName'
                            id='titleSeriesName'
                            placeholder={'Enter Series Name'}
                            errorMessage='Field cannot be empty!'
                            onChange={this.props.handleChangeSeries}
                            required={this.state.isSeriesCompleted}
                            value={episodic.seriesTitleName}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label for='titleSeasonNumber'>Season{contentType === EPISODE.apiName || contentType === SEASON.apiName ? <span style={{ color: 'red' }}>*</span> : null}</Label>
                            <AvField
                              type='number'
                              name='seasonNumber'
                              errorMessage='Please enter a valid season number!'
                              value={
                                this.props.data.episodic !== null &&
                                  this.props.data.episodic.seasonNumber
                                  ? this.props.data.episodic.seasonNumber
                                  : ''
                              }
                              id='titleSeasonNumber'
                              placeholder={'Enter Season Number'}
                              onChange={e => this.props.handleChangeEpisodic(e)}
                              validate={{
                                required: {
                                  value: contentType === EPISODE.apiName || contentType === SEASON.apiName ? true : false,
                                  errorMessage: 'Field cannot be empty!'
                                },
                                maxLength: { value: 3 }
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Fragment>
                          {contentType !== SEASON.apiName ? (
                            <Col>
                              <FormGroup>
                                <Label for='titleEpisodeNumber'>Episode{contentType === EPISODE.apiName ? <span style={{ color: 'red' }}>*</span> : null}</Label>
                                <AvField
                                  type='number'
                                  name='episodeNumber'
                                  errorMessage='Please enter a valid episode number!'
                                  value={
                                    this.props.data.episodic !== null &&
                                      this.props.data.episodic.episodeNumber
                                      ? this.props.data.episodic.episodeNumber
                                      : ''
                                  }
                                  id='titleEpisodeNumber'
                                  placeholder={'Enter Episode Number'}
                                  onChange={e =>
                                    this.props.handleChangeEpisodic(e)
                                  }
                                  validate={{
                                    required: {
                                      value: contentType === EPISODE.apiName ? true : false,
                                      errorMessage: 'Field cannot be empty!'
                                    },
                                    maxLength: { value: 3 }
                                  }}
                                />
                              </FormGroup>
                            </Col>
                          ) : null}
                        </Fragment>
                      </Row>
                      <Row>
                        {contentType === SEASON.apiName ? (
                          <Col>
                            <Label for='titleSeasonID'>Season ID</Label>
                            <AvField
                              type='text'
                              name='seasonId'
                              value={
                                this.props.data.episodic !== null &&
                                  this.props.data.episodic.seasonId
                                  ? this.props.data.episodic.seasonId
                                  : ''
                              }
                              id='titleSeasonID'
                              placeholder={'Enter Season ID'}
                              onChange={e => this.props.handleChangeEpisodic(e)}
                            />
                            <Fragment>
                              <Row>
                                <Col>
                                  <Label for='totalNumberOfEpisodes'>
                                    Episodes
                                  </Label>

                                  <AvField
                                    type='number'
                                    name='totalNumberOfEpisodes'
                                    id='totalNumberOfEpisodes'
                                    onChange={e => this.props.handleOnChangeEdit(e)}
                                    value={totalNumberOfEpisodes}
                                    placeholder='Episodes'
                                    validate={{
                                      max: { value: 999, errorMessage: 'Please enter a valid episode number!' },
                                      pattern: {
                                        value: '^[0-9]+$',
                                        errorMessage: 'Please enter a number!'
                                      }
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Fragment>
                          </Col>
                        ) : (
                            <Col>
                              <Label for='titleEpisodeID'>Episode ID</Label>
                              <AvField
                                type='text'
                                name='episodeId'
                                value={
                                  this.props.data.episodic !== null &&
                                    this.props.data.episodic.episodeId
                                    ? this.props.data.episodic.episodeId
                                    : ''
                                }
                                id='titleEpisodeID'
                                placeholder={'Enter Episode ID'}
                                onChange={e => this.props.handleChangeEpisodic(e)}
                              />
                            </Col>
                          )}
                      </Row>
                    </Fragment>
                  ) : null}
                </Fragment>
              ) :
                  contentType === SEASON.apiName ?
                  (
                    <Fragment>
                      <Row>
                        <Col>
                          <Label for='totalNumberOfSeasons'>Seasons</Label>

                          <AvField
                            type='number'
                            name='totalNumberOfSeasons'
                            id='totalNumberOfSeasons'
                            placeholder='Seasons'
                            value={totalNumberOfSeasons}
                            onChange={e => this.props.handleOnChangeEdit(e)}
                            errorMessage="Please enter a valid season number!"
                            validate={{
                              maxLength: { value: 3 }
                            }}
                          />
                        </Col>
                      </Row>
                    </Fragment>
                  )
                  : null
              }
              <Row>
                <Col>
                  <Label for='duration'>Duration</Label>
                  <Row>
                    <Col>
                      <AvField
                        type="text"
                        name="duration"
                        value={duration}
                        id="duration"
                        onChange={(e) => this.props.handleOnChangeEdit(e)}
                        placeholder="hh:mm:ss"
                        validate={{
                          pattern: { value: '^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$', errorMessage: 'Please enter a valid duration format (hh:mm:ss)!' },
                          maxLength: { value: 8 },
                          minLength: { value: 8 }
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Label for='countryOfOrigin'>Country of Origin</Label>
                  <AvField
                    type='select'
                    name='countryOfOrigin'
                    id='countryOfOrigin'
                    onChange={e => this.props.handleOnChangeEdit(e)}
                    value={countryOfOrigin}
                  >
                    <option value=''>Select Country of Origin</option>
                    {
                      this.props.configLocale && this.props.configLocale.value.map((e, index) => {
                        return <option key={index} value={e.countryCode}>{e.countryName}</option>;
                      })
                    }
                  </AvField>
                </Col>
                <Col>
                  <Label for='animated'>Animated</Label>
                  <Input
                    type='select'
                    name='animated'
                    id='animated'
                    onChange={e => this.props.handleOnChangeEdit(e)}
                    defaultValue={animated !== null ? animated : ''}
                  >
                    <option value={''}>Select Animated</option>
                    <option value={true}>Y</option>
                    <option value={false}>N</option>
                  </Input>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col>
                  <Label for='eventType'>Event Type</Label>
                  <Input
                    type='select'
                    name='eventType'
                    id='eventType'
                    onChange={e => this.props.handleOnChangeEdit(e)}
                    defaultValue={eventType ? eventType : ''}
                  >
                    <option value='' >Select Event Type</option>
                    <option value='Live'>Live</option>
                    <option value='Tape Delayed'>Tape Delayed</option>
                    <option value='Taped'>Taped</option>
                  </Input>
                </Col>
              </Row>
              <Row style={{ marginTop: '15px' }}>
                <Col>
                  <Label for='originalLanguage'>Original Language</Label>
                  <AvField
                    type='select'
                    name='originalLanguage'
                    id='originalLanguage'
                    onChange={e => this.props.handleOnChangeEdit(e)}
                    value={originalLanguage}
                  >
                    <option value=''>Select Original Language</option>
                    {
                      this.props.configLanguage && this.props.configLanguage.value.map((e, index) => {
                        return <option key={index} value={e.languageCode}>{e.languageName}</option>;
                      })
                    }
                  </AvField>
                </Col>
                {
                  contentType === EPISODE.apiName ? (
                    <Fragment>
                      <Col>
                        <Label for='titleEpisodeCount'>
                          Episode Count
                          </Label>
                        <AvField
                          type='text'
                          name='episodeCount'
                          value={
                            this.props.data.episodic !== null &&
                              this.props.data.episodic.episodeCount
                              ? this.props.data.episodic.episodeCount
                              : ''
                          }
                          id='titleEpisodeCount'
                          placeholder={'Enter Episode Count'}
                          onChange={e =>
                            this.props.handleChangeEpisodic(e)
                          }
                        />
                      </Col>
                      <Col>
                        <Label for='seasonPremiere'>Season Premiere</Label>
                        <Input
                          type='select'
                          name='seasonPremiere'
                          id='seasonPremiere'
                          defaultValue={seasonPremiere}
                          onChange={e => this.props.handleOnChangeEdit(e)}
                        >
                          <option value={''}>Select Season Premiere</option>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </Input>
                      </Col>
                      <Col>
                        <Label for='seasonFinale'>Season Finale</Label>
                        <Input
                          type='select'
                          name='seasonFinale'
                          id='seasonFinale`'
                          defaultValue={seasonFinale}
                          onChange={e => this.props.handleOnChangeEdit(e)}
                        >
                          <option value={''}>Select Season Finale</option>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </Input>
                      </Col>
                    </Fragment>
                  ) : null
                }
              </Row>
              <Row style={{ marginTop: '15px' }}>
                <Col>
                  <Label for='titleReleaseYear'>
                    Release Year{contentType === SERIES.apiName || contentType === SEASON.apiName ? null : <span style={{ color: 'red' }}>*</span>}
                  </Label>
                  <AvField
                    name='releaseYear'
                    errorMessage='Please enter a valid year!'
                    id='titleReleaseYear'
                    validate={{
                      required: {
                        value: contentType === SERIES.apiName || contentType === SEASON.apiName ? false : true,
                        errorMessage: 'Field cannot be empty!'
                      },
                      pattern: { value: '^[0-9]+$' },
                      minLength: { value: 4 },
                      maxLength: { value: 4 }
                    }}
                    placeholder='Enter Release Year'
                    value={releaseYear ? releaseYear : ''}
                    onChange={e => this.props.handleOnChangeEdit(e)}
                  />
                </Col>
                <Col>
                  <Label for='titleBoxOffice'>Box Office</Label>
                  <AvField
                    name='boxOffice'
                    id='titleBoxOffice'
                    type='number'
                    onChange={e => this.props.handleOnChangeEdit(e)}
                    value={boxOffice ? boxOffice : ''}
                    placeholder='Enter Box Office'
                    validate={{
                      pattern: {
                        value: '^[0-9]+$',
                        errorMessage: 'Please enter a number!'
                      }
                    }}
                  />
                </Col>
              </Row>
              {this.state.loading ? (
                <Progress striped color='success' value='100'>
                  Updating...
                </Progress>
              ) : null}
            </Col>
          </Row>
          <CoreMetadataEditMode
              titleRankingActiveTab={this.props.titleRankingActiveTab}
              toggleTitleRating={this.props.toggleTitleRating}
              addTitleRatingTab={this.props.addTitleRatingTab}
              createRatingTab={this.props.createRatingTab}
              areRatingFieldsRequired={this.props.areRatingFieldsRequired}
              handleRatingChange={this.props.handleRatingChange}
              handleRatingEditChange={this.props.handleRatingEditChange}

              data={this.props.data}
              onChange={this.props.handleOnChangeEdit}
              handleOnExternalIds={this.props.handleOnExternalIds}
              handleOnLegacyIds={this.props.handleOnLegacyIds}
              isCastModalOpen={this.props.isCastModalOpen}
              isCrewModalOpen={this.props.isCrewModalOpen}
              renderModal={this.props.renderModal}
              castInputValue={this.props.castInputValue}
              removeCastCrew={this.props.removeCastCrew}
              ratings={this.props.ratings}
              handleAdvisoryCodeChange={this.props.handleAdvisoryCodeChange}
              ratingObjectForCreate={this.props.ratingObjectForCreate}
              addCastCrew={this.props.addCastCrew}
              updateCastCrewValue={this.props.updateCastCrewValue}
              editedTitle={this.props.editedTitle}
          />
        </Container>
      </Fragment>
    );
  }
}

TitleEditMode.propTypes = {
  titleRankingActiveTab: PropTypes.any,
  toggleTitleRating: PropTypes.func,
  addTitleRatingTab: PropTypes.func,
  createRatingTab: PropTypes.string,
  handleRatingChange: PropTypes.func,
  handleRatingEditChange: PropTypes.func,

  keyPressed: PropTypes.func,
  data: PropTypes.object,
  handleOnChangeEdit: PropTypes.func.isRequired,
  handleChangeSeries: PropTypes.func.isRequired,
  handleChangeEpisodic: PropTypes.func.isRequired,
  handleOnExternalIds: PropTypes.func,
  handleOnLegacyIds: PropTypes.func,
  editedTitle: PropTypes.object,
  ratings: PropTypes.array,
  updateCastCrewValue: PropTypes.func,
  addCastCrew: PropTypes.func,
  removeCastCrew: PropTypes.func,
  castInputValue: PropTypes.string,
  renderModal: PropTypes.func,
  isCrewModalOpen: PropTypes.bool,
  isCastModalOpen: PropTypes.bool,
  handleOnChangeTitleDuration: PropTypes.func,
  configLanguage: PropTypes.object,
  configLocale: PropTypes.object,
  handleAdvisoryCodeChange: PropTypes.func,
  ratingObjectForCreate: PropTypes.object,
  areRatingFieldsRequired: PropTypes.bool
};

export default connect(mapStateToProps)(TitleEditMode);
