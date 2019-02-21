import React, { Component, Fragment } from 'react';
import { updateBreadcrumb } from '../../../../stores/actions/metadata/index';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import { BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH } from '../../../../constants/metadata-breadcrumb-paths';
import './TitleEdit.scss';
import TitleReadOnlyMode from './TitleReadOnlyMode';
import TitleEditMode from './TitleEditMode';
import EditPage from './EditPage';
import TerritoryMetadata from './territorymetadata/TerritoryMetadata';
import { titleService } from '../../service/TitleService';
import { errorModal } from '../../../../components/modal/ErrorModal';
import { Button, Row, Col } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import {
    addTerritoryMetadata,
} from '../../../../stores/actions/metadata/index';
import moment from 'moment';

class TitleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditMode: false,
            titleForm: {},
            editedForm: {},
            territories: {
                parentId: this.props.match.params.id,
                type: 'territoryMetadata'
            }
        };
    }
    componentDidMount() {
        this.props.updateBreadcrumb([BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH]);
        const titleId = this.props.match.params.id;
        titleService.getTitleById(titleId).then((response) => {
            const titleForm = response.data;
            this.setState({ titleForm, editedForm: titleForm });
        }).catch((err) => {
            errorModal.open('Error', () => { }, { description: err.message, closable: true });
            console.error('Unable to load Title Data');
        });
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 27) {
            this.setState({
                isEditMode: false
            });
        }
    }

    handleSwitchMode = () => {
        this.setState({ isEditMode: !this.state.isEditMode });
    }

    handleOnChangeEdit = (e) => {
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                [e.target.name]: e.target.value
            }
        });
    }

    handleChangeBrand = (e) => {
        const newEpisodic = {
            ...this.state.editedForm.episodic,
            brandTitleName: e.target.value
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                episodic: newEpisodic
            }
        });
        if (e.target.value.length !== 0) {
            this.setState({
                isBrandProdYearCompleted: true
            });
        } else {
            this.setState({
                isBrandProdYearCompleted: false,
                brandTitleName: null
            });
        }
    }

    handleChangeBrandProdYear = (e) => {
        const newEpisodic = {
            ...this.state.editedForm.episodic,
            brandProdYear: e.target.value
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                episodic: newEpisodic
            }
        });
        if (e.target.value.length !== 0) {
            this.setState({
                isBrandCompleted: true
            });
        } else {
            this.setState({
                isBrandCompleted: false,
                brandProdYear: null
            });
        }
    }

    handleChangeEpisodic = (e) => {
        const newEpisodic = {
            ...this.state.editedForm.episodic,
            [e.target.name]: e.target.value
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                episodic: newEpisodic
            }
        });
    }

    handleOnSave = () => {
        if (this.state.titleForm !== this.state.editedForm) {
            const updatedTitle = this.state.editedForm;
            this.setState({
                isLoading: true
            });
            titleService.updateTitle(updatedTitle).then(() => {
                this.setState({
                    isLoading: false,
                    titleForm: this.state.editedForm,
                    isEditMode: !this.state.isEditMode
                });

                // window.location = '/metadata/detail/'+this.props.match.params.id;

            }).catch((err) => {
                errorModal.open('Error', () => { }, { description: err.message, closable: true });
                console.error('Unable to load Title Data');
            });
        } else {
            this.setState({
                isEditMode: !this.state.isEditMode
            });
        }

        if (this.state.territories.locale) {
            const newTerritory = {
                ...this.state.territories,
                theatricalReleaseDate: this.state.territories.theatricalReleaseDate ? moment(this.state.territories.theatricalReleaseDate).format('YYYY-MM-DD HH:mm:ss') : null,
                homeVideoReleaseDate: this.state.territories.homeVideoReleaseDate ? moment(this.state.territories.homeVideoReleaseDate).format('YYYY-MM-DD HH:mm:ss') : null,
                availAnnounceDate: this.state.territories.availAnnounceDate ? moment(this.state.territories.availAnnounceDate).format('YYYY-MM-DD HH:mm:ss') : null,
                parentId: this.props.match.params.id
            };
            titleService.addMetadata(newTerritory).then(() => {
                
                // window.location = '/metadata/detail/'+this.props.match.params.id;
                this.cleanTerritoryMetada();
            }).catch((err) => {
                errorModal.open('Error', () => { }, { description: err.response.data.description, closable: true });
                console.error('Unable to add Territory Metadata');
            });
        } else {            
            this.cleanTerritoryMetada();
        }
    }

    readOnly = () => {
        return <TitleReadOnlyMode data={this.state.titleForm} />;
    };

    editMode = () => {
        return <TitleEditMode
            handleChangeEpisodic={this.handleChangeEpisodic}
            handleChangeBrandProdYear={this.handleChangeBrandProdYear}
            handleChangeBrand={this.handleChangeBrand}
            keyPressed={this.handleKeyDown}
            data={this.state.titleForm}
            handleOnChangeEdit={this.handleOnChangeEdit} />;
    };

    handleChange = (e) => {
        this.setState({
            territories: {
                ...this.state.territories,
                [e.target.name]: e.target.value
            }
        });
    }
    // addMetadata = () => {
    //     this.props.addTerritoryMetadata(this.state.territories);
    //     this.form && this.form.reset();
    //     this.setState({
    //         territories: [
    //             {
    //                 local: null,
    //                 theatricalReleaseDate: null,
    //                 homeVideoReleaseDate: null,
    //                 availAnnounceDate: null,
    //                 boxOffice: null,
    //                 releaseYear: null
    //             }
    //         ]
    //     });
    // }
    cleanTerritoryMetada = () => {
        this.setState({
            territories: {
                locale: null,
                availAnnounceDate: null,
                theatricalReleaseDate: null,
                homeVideoReleaseDate: null,
                boxOffice: null,
                releaseYear: null
            }
        });
    }
    render() {
        return (
            <EditPage>

                <AvForm id="titleDetail" onValidSubmit={this.handleOnSave} ref={c => (this.form = c)}>
                    <Row>
                        <Col className="clearfix" style={{ marginRight: '20px', marginBottom: '10px' }}>
                            {
                                this.state.isEditMode ?
                                    <Fragment>
                                        <Button className="float-right" id="btnSave" color="primary" style={{ marginRight: '10px' }}>Save</Button>
                                        <Button className="float-right" id="btnCancel" onClick={this.handleSwitchMode} outline color="danger" style={{ marginRight: '10px' }}>Cancel</Button>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Col>
                                            <Button className="float-right" id="btnEdit" onClick={this.handleSwitchMode}>Edit</Button>
                                        </Col>
                                    </Fragment>
                            }
                        </Col>
                    </Row>
                    {
                        this.state.isEditMode ? this.editMode() : this.readOnly()
                    }
                    <TerritoryMetadata handleChange={this.handleChange} isEditMode={this.state.isEditMode} />
                </AvForm>
            </EditPage>
        );
    }
}


let mapDispatchToProps = {
    updateBreadcrumb,
    addTerritoryMetadata
};




TitleEdit.propTypes = {
    updateBreadcrumb: t.func,
    match: t.object.isRequired,
    addTerritoryMetadata: t.func,
    territories: t.array
};

export default connect(null, mapDispatchToProps)(TitleEdit);