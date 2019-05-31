import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { configFields } from '../../../service/ConfigService';

class TerritoryMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            territoryType: configFields.LOCALE,
            locale: []
        };
    }

    handleTerritoryType = e => {
        this.setState({
            [e.target.name]: e.target.value
        });

    }

    shouldComponentUpdate(nextProps) {
        let differentRequired = this.props.isRequired !== nextProps.isRequired;
        return differentRequired;
    }

    render() {
        const locale = this.props.configLocale && this.props.configLocale.find(e => e.key === this.state.territoryType);
        return (
            <div id="territoryMetadataCreate">
                <Container>
                    <Row style={{ padding: '15px'}}>
                        <Col>
                            <AvField type="select"
                                    name="territoryType"
                                    label='Territory Type'
                                    id="territoryType"
                                    value={this.state.territoryType}
                                    onChange={this.handleTerritoryType}>
                                    <option value={configFields.LOCALE}>Country</option>
                                    <option value={configFields.REGIONS}>Region</option>
                            </AvField>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <AvField type="select"
                                name="locale"
                                label={<span>Locale<span style={{ color: 'red' }}>*</span></span>}
                                id="territoryLocal"
                                required={this.props.isRequired}
                                onChange={this.props.handleChange}
                                errorMessage="Field cannot be empty!">
                                <option value={''}>Select {this.state.territoryType === configFields.LOCALE ? 'Locale' : 'Region'}</option>
                                {
                                    locale && locale.value.map((e, index) => {
                                        return <option key={index} value={this.state.territoryType === configFields.LOCALE ? e.countryCode : e.regionCode }>{this.state.territoryType === configFields.LOCALE ? e.countryName : e.regionName}</option>;
                                    })
                                }
                            </AvField>
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
                            <AvField label="Original Air Date" validate={{
                                date: { format: 'YYYY-mm-DD' }
                            }} type="date" id="territoryOriginalAirDate" name="originalAirDate" onChange={this.props.handleChange} errorMessage="Please enter a valid date!" />
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
};


const mapStateToProps = state => {
    return {
        configLocale: state.titleReducer.configData,
    };
};

export default connect(mapStateToProps)(TerritoryMetadataCreateTab);