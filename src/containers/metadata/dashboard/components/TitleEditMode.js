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
import CoreMetadataEditMode from './territorymetadata/coremetadata/CoreMetadataEditMode';

class TitleEditMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      isSeriesCompleted: false
    };
  }

  getHour = () => {

    let newDuration = this.props.data.duration.split(':');
    let hour = newDuration[0];
    // console.log('Hour:',hour, 'Duration: ',this.props.data.duration);
    return hour;
  }
  getMinute = () => {
    let newDuration = this.props.data.duration.split(':');
    let minute = newDuration[1];
    // console.log('Minute:',minute, 'Duration: ',this.props.data.duration);
    return minute;
  }
  render() {
    const {
      title,
      contentType,
      productionStudioId,
      releaseYear,
      boxOffice,
      animated,
      duration,
      eventType,
      // seasonFinale,
      // seasonPremiere,
      // totalNumberOfSeasons,
      // licensors,
      // originalLanguage,
      countryOfOrigin,
      // totalNumberOfEpisodes
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
                    <b>{contentType}</b>
                  </Alert>
                </Col>
                <Col>
                  <Label for='titleProductionStudio'>Production Studio</Label>
                  <AvField
                    name='productionStudioId'
                    errorMessage='Please enter a valid production studio!'
                    id='titleProductionStudio'
                    value={productionStudioId ? productionStudioId : ''}
                    placeholder='Enter Studio'
                    onChange={this.props.handleOnChangeEdit}
                  />
                </Col>
              </Row>
              {contentType !== 'MOVIE' && contentType !== 'SERIES' ? (
                <Fragment>
                  {this.props.data.episodic !== null ? (
                    <Fragment>
                      <Row>
                        <Col>
                          <Label for='titleSeriesName'>Series</Label>
                          <AvField
                            type='text'
                            name='seriesTitleName'
                            id='titleSeriesName'
                            placeholder={'Enter Series Name'}
                            errorMessage='Field cannot be empty!'
                            onChange={this.props.handleChangeSeries}
                            required={this.state.isSeriesCompleted}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for='titleSeasonNumber'>Season</Label>
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
                                maxLength: { value: 3 }
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Fragment>
                          {contentType !== 'SEASON' ? (
                            <Col md={6}>
                              <FormGroup>
                                <Label for='titleEpisodeNumber'>Episode</Label>
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
                                    maxLength: { value: 3 }
                                  }}
                                />
                              </FormGroup>
                            </Col>
                          ) : (
                              <Col md={6}>
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
                            )}
                        </Fragment>
                      </Row>
                      <Row>
                        {contentType === 'SEASON' ? (
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
                                    placeholder='Episodes'
                                    errorMessage="Please enter a valid episode number!"
                                    validate={{
                                      maxLength: { value: 3 }
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
              ) : (
                  <Fragment>
                    <Row>
                      <Col>
                        <Label for='totalNumberOfSeasons'>Seasons</Label>

                        <AvField
                          type='number'
                          name='totalNumberOfSeasons'
                          id='totalNumberOfSeasons'
                          placeholder='Seasons'
                          errorMessage="Please enter a valid season number!"
                          validate={{
                            maxLength: { value: 3 }
                          }}
                        />
                      </Col>
                    </Row>
                  </Fragment>
                )}
              <Row>
                <Col>
                  <Label for='duration'>Duration</Label>
                  <Row>
                    <Col>
                      <AvField name="hour" value={duration ? this.getHour() : ''} type="number" max="24" placeholder="HH" style={{ textAlign: 'center' }}
                        validate={{
                          maxLength: { value: 2, errorMessage: 'Please enter a valid hour!' }, minLength: { value: 2, errorMessage: 'Please enter a valid hour!' }
                        }}
                        onChange={e => this.props.handleOnChangeEdit(e)}
                      />
                    </Col>
                    <Col>
                      <AvField name="minute" value={duration ? this.getMinute() : ''} type="number" max="59" placeholder="MM" style={{ textAlign: 'center' }}
                        validate={{
                          maxLength: { value: 2, errorMessage: 'Please enter a valid minute!' }, minLength: { value: 2, errorMessage: 'Please enter a valid minute!' }
                        }}
                        onChange={e => this.props.handleOnChangeEdit(e)}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Label for='countryOfOrigin'>Country of Origin</Label>
                  <Input
                    type='select'
                    name='countryOfOrigin'
                    id='countryOfOrigin'
                    onChange={e => this.props.handleOnChangeEdit(e)}
                    defaultValue={countryOfOrigin ? countryOfOrigin : ''}
                  >
                    <option value=''>Select Country of Origin</option>
                    <option value='PL'>PL</option>
                    <option value='GB'>UK</option>
                  </Input>
                </Col>
                <Col>
                  <Label for='animated'>Animated</Label>
                  <Input
                    type='select'
                    name='animated'
                    id='animated'
                    onChange={e => this.props.handleOnChangeEdit(e)}
                    defaultValue={animated ? animated : ''}
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
              <Row>
                <Col>
                  <Label for='originalLanguage'>Original Language</Label>
                  <Input
                    type='select'
                    name='originalLanguage'
                    id='originalLanguage'
                    onChange={e => this.props.handleOnChangeEdit(e)}
                  >
                    <option value=''>Select Original Language</option>
                    <option value='English'>English</option>
                    <option value='German'>German</option>
                  </Input>
                </Col>
                {
                  contentType === 'EPISODE' ? (
                    <Fragment>
                      <Col>
                        <Label for='seasonPremiere'>Season Premiere</Label>
                        <Input
                          type='select'
                          name='seasonPremiere'
                          id='seasonPremiere'
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
                    Release Year<span style={{ color: 'red' }}>*</span>
                  </Label>
                  <AvField
                    name='releaseYear'
                    errorMessage='Please enter a valid year!'
                    id='titleReleaseYear'
                    validate={{
                      required: {
                        value: true,
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
            data={this.props.data}
            handleOnAdvisories={this.props.handleOnAdvisories}
            onChange={this.props.handleOnChangeEdit}
            handleOnExternalIds={this.props.handleOnExternalIds}
            isCastModalOpen={this.props.isCastModalOpen}
            isCrewModalOpen={this.props.isCrewModalOpen}
            renderModal={this.props.renderModal}
            castInputValue={this.props.castInputValue}
            removeCast={this.props.removeCast}
            addCast={this.props.addCast}
            updateCastValue={this.props.updateCastValue}
            ratingValue={this.props.ratingValue}
            removeRating={this.props.removeRating}
            _handleKeyPress={this.props._handleKeyPress}
            editedTitle={this.props.editedTitle}
            updateValue={this.props.updateValue}
          />
        </Container>
      </Fragment>
    );
  }
}

TitleEditMode.propTypes = {
  keyPressed: PropTypes.func,
  data: PropTypes.object,
  handleOnChangeEdit: PropTypes.func.isRequired,
  handleChangeSeries: PropTypes.func.isRequired,
  handleChangeEpisodic: PropTypes.func.isRequired,
  handleOnExternalIds: PropTypes.func,
  handleOnAdvisories: PropTypes.func,
  updateValue: PropTypes.func,
  editedTitle: PropTypes.array,
  _handleKeyPress: PropTypes.func,
  removeRating: PropTypes.func,
  ratingValue: PropTypes.string,
  updateCastValue: PropTypes.func,
  addCast: PropTypes.func,
  removeCast: PropTypes.func,
  castInputValue: PropTypes.string,
  renderModal: PropTypes.func,
  isCrewModalOpen: PropTypes.bool,
  isCastModalOpen: PropTypes.bool




};

export default TitleEditMode;
