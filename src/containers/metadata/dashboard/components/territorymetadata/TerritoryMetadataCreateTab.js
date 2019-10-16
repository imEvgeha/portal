import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { configFields } from '../../../service/ConfigService';
import { formatTypeFirstLetter } from '../../../../../constants/metadata/format';
import { COUNTRY, REGION } from '../../../../../constants/metadata/constant-variables';
import NexusDateTimePicker from '../../../../../ui-elements/nexus-date-time-picker/NexusDateTimePicker';

// TODO: Convert to functional component
class TerritoryMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
    }

    renderLocale = () => {
        let type = null;
        if (this.props.territories.territoryType === COUNTRY) {
            type = configFields.LOCALE;
        } else if (this.props.territories.territoryType === REGION) {
            type = configFields.REGIONS;
        } else {
            type = null;
        }
        const locale = this.props.configLocale && this.props.configLocale.find(e => e.key === type);
        return (
            <AvField type="select"
                name="locale"
                label={<span>Locale<span style={{ color: 'red' }}>*</span></span>}
                id="territoryLocal"
                required={this.props.isRequired}
                onChange={this.props.handleChange}
                errorMessage="Field cannot be empty!">
                <option value={''}>Select {formatTypeFirstLetter(this.props.territories.territoryType)}</option>
                {
                    locale && locale.value.map((e, index) => {
                        if(e.countryName !== null) {
                            return <option key={index} value={this.props.territories.territoryType === COUNTRY ? e.countryCode : e.regionCode}>{this.props.territories.territoryType === 'country' ? e.countryName : e.regionName}</option>;
                        }
                    })
                }
            </AvField>
        );
    };

    render() {
        return (
            <div id="territoryMetadataCreate">
                <Container>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <AvField type="select"
                                name="territoryType"
                                label='Territory Type'
                                id="territoryType"
                                value={this.props.territories.territoryType}
                                onChange={this.props.handleChange}>
                                <option value={COUNTRY}>Country</option>
                                <option value={REGION}>Region</option>
                            </AvField>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            {
                                this.renderLocale()
                            }
                        </Col>
                        <Col>
                            <AvField label="Box Office" type="number" id="territoryBoxOffice" name="boxOffice" placeholder="Enter Box Office" onChange={this.props.handleChange}
                                validate={{
                                    pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' },
                                }} />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <AvField label="Release Year" name="releaseYear" type="number" errorMessage="Please enter a valid year!" placeholder="Enter Release Year" onChange={this.props.handleChange}
                                validate={{
                                    date: { format: 'YYYY', errorMessage: 'Please enter a valid date!' },
                                    pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a valid date!' },
                                    maxLength: { value: 4 }, minLength: { value: 4 }
                                }}
                            />
                        </Col>
                        <Col>
                            <NexusDateTimePicker
                                label="Original Air Date"
                                id="territoryOriginalAirDate"
                                onChange={this.props.handleChange}
                            />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <AvField label="Home Video Release Date" validate={{
                                date: { format: 'YYYY-mm-DD' }
                            }} type="date" id="territoryHomeVideoReleaseDate" name="homeVideoReleaseDate" onChange={this.props.handleChange} errorMessage="Please enter a valid date!" />
                        </Col>
                        <Col>
                            <AvField label="Avail Announce Date" type="date" id="territoryAvailAnnounceDate" name="availAnnounceDate" onChange={this.props.handleChange} errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <AvField label="Theatrical Release Date" type="date" id="territoryTheatricalReleaseDate"
                                name="theatricalReleaseDate"
                                onChange={this.props.handleChange}
                                errorMessage="Please enter a valid date!" />
                        </Col>
                        <Col>
                            <AvField label="EST Release Date" type="date" id="territoryESTReleaseDate"
                                name="estReleaseDate"
                                onChange={this.props.handleChange}
                                errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

TerritoryMetadataCreateTab.propTypes = {
    handleChange: PropTypes.func.isRequired,
    isRequired: PropTypes.bool.isRequired,
    configLocale: PropTypes.array,
    territories: PropTypes.object
};


const mapStateToProps = state => {
    return {
        configLocale: state.titleReducer.configData,
    };
};

export default connect(mapStateToProps)(TerritoryMetadataCreateTab);