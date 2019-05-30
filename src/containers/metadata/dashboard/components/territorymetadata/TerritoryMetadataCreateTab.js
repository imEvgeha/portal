import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { configFields } from '../../../service/ConfigService';

class TerritoryMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        let differentRequired = this.props.isRequired !== nextProps.isRequired;
        return differentRequired;
    }

    render() {
        return (
            <div id="territoryMetadataCreate">
                <Container>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <AvField type="select"
                                name="locale"
                                label={<span>Locale<span style={{ color: 'red' }}>*</span></span>}
                                id="territoryLocal"
                                required={this.props.isRequired}
                                onChange={this.props.handleChange}
                                errorMessage="Field cannot be empty!">
                                <option value={''}>Select Locale</option>
                                {
                                    this.props.configLocale && this.props.configLocale.value.map((e, index) => {
                                        return <option key={index} value={e.countryCode}>{e.countryName}</option>;
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
    configLocale: PropTypes.object,
};

const mapStateToProps = state => {
    return {
        configLocale: state.titleReducer.configData.find(e => e.key === configFields.LOCALE),
    };
};

export default connect(mapStateToProps)(TerritoryMetadataCreateTab);