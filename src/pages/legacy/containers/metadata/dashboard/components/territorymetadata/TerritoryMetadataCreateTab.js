import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Container} from 'reactstrap'; // ?
import Select from 'react-select';
import {AvField} from 'availity-reactstrap-validation'; // ?
import {connect} from 'react-redux';
import {configFields} from '../../../service/ConfigService';
import {COUNTRY} from '../../../../../constants/metadata/constant-variables';
import NexusDatePicker from '../../../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';

// TODO: Convert to functional component
class TerritoryMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
    }

    renderLocale = () => {
        let type = null;
        if (this.props.territories.territoryType === COUNTRY) type = configFields.LOCALE;
        const locale = this.props.configLocale && this.props.configLocale.find(e => e.key === type);
        return (
            <AvField
                type="select"
                name="locale"
                label={
                    <span>
                        {' '}
                        Locale<span style={{color: 'red'}}>*</span>
                    </span>
                }
                id="territoryLocal"
                required={this.props.isRequired}
                onChange={this.props.handleChange}
                errorMessage="Field cannot be empty!"
            >
                <option value="">Select Country</option>
                {locale &&
                    locale.value.map((e, index) => {
                        if (e.countryName !== null) {
                            return (
                                <option key={index} value={e.countryCode}>
                                    {e.countryName}
                                </option>
                            );
                        }
                    })}
            </AvField>
        );
    };

    render() {
        return (
            <div id="territoryMetadataCreate">
                <Container>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>
                                Metadata Status<span style={{color: 'red'}}>*</span>:
                            </b>
                        </Col>
                        <Col>
                            <Select
                                name="metadataStatus"
                                value={
                                    this.props.territories.metadataStatus
                                        ? {
                                              label:
                                                  this.props.territories.metadataStatus === 'CONFIRMED'
                                                      ? 'Confirmed'
                                                      : 'Pending',
                                              value: this.props.territories.metadataStatus,
                                          }
                                        : {
                                              label: 'Pending',
                                              value: 'PENDING',
                                          }
                                }
                                onChange={value => this.props.handleMetadataStatusChange(value)}
                                placeholder="Select Metadata Status"
                                options={[
                                    {label: 'Pending', value: 'PENDING'},
                                    {label: 'Confirmed', value: 'CONFIRMED'},
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col>{this.renderLocale()}</Col>
                        <Col>
                            <AvField
                                label="Box Office"
                                id="territoryBoxOffice"
                                name="boxOffice"
                                errorMessage="Please enter a valid number!"
                                placeholder="Enter Box Office"
                                onChange={this.props.handleChange}
                                validate={{
                                    pattern: {value: '^[0-9]+$'},
                                    maxLength: {value: 10},
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col>
                            <AvField
                                label="Release Year"
                                name="releaseYear"
                                errorMessage="Please enter a valid year!"
                                id="territoryReleaseYear"
                                placeholder="Enter Release Year"
                                onChange={this.props.handleChange}
                                validate={{
                                    pattern: {value: '^[0-9]+$'},
                                    minLength: {value: 4},
                                    maxLength: {value: 4},
                                }}
                            />
                        </Col>
                        <Col>
                            <NexusDatePicker
                                label="Original Air Date"
                                id="territoryOriginalAirDate"
                                onChange={date => this.props.handleChangeDate('originalAirDate', date)}
                                isReturningTime={false}
                            />
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col>
                            <NexusDatePicker
                                label="Home Video Release Date"
                                id="territoryHomeVideoReleaseDate"
                                onChange={date => this.props.handleChangeDate('homeVideoReleaseDate', date)}
                                isReturningTime={false}
                            />
                        </Col>
                        <Col>
                            <NexusDatePicker
                                label="Avail Announce Date"
                                id="territoryAvailAnnounceDate"
                                onChange={date => this.props.handleChangeDate('availAnnounceDate', date)}
                                isReturningTime={false}
                            />
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col>
                            <NexusDatePicker
                                label="Theatrical Release Date"
                                id="territoryTheatricalReleaseDate"
                                onChange={date => this.props.handleChangeDate('theatricalReleaseDate', date)}
                                isReturningTime={false}
                            />
                        </Col>
                        <Col>
                            <NexusDatePicker
                                label="EST Release Date"
                                id="territoryESTReleaseDate"
                                onChange={date => this.props.handleChangeDate('estReleaseDate', date)}
                                isReturningTime={false}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

TerritoryMetadataCreateTab.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleChangeDate: PropTypes.func.isRequired,
    isRequired: PropTypes.bool.isRequired,
    configLocale: PropTypes.array,
    territories: PropTypes.object,
    handleMetadataStatusChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        configLocale: state.titleReducer.configData,
    };
};

export default connect(mapStateToProps)(TerritoryMetadataCreateTab);
