import React, { Component, Fragment } from 'react';
import { updateBreadcrumb } from '../../../../stores/actions/metadata/index';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import { BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH } from '../../../../constants/metadata-breadcrumb-paths';
import './TitleEdit.scss';
import TitleReadOnlyMode from './TitleReadOnlyMode';
import TitleEditMode from './TitleEditMode';
import EditPage from './EditPage';
import TerritoryMetadata from './TerritoryMetadata';

class TitleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditMode: false
        };
    }
    componentDidMount() {
        this.props.updateBreadcrumb([BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH]);
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

    readOnly = () => {
        return <TitleReadOnlyMode titleId={this.props.match.params.id} handleSwitchMode={this.handleSwitchMode} />;
    };

    editMode = () => {
        return <TitleEditMode keyPressed={this.handleKeyDown}
            handleSwitchMode={this.handleSwitchMode}
            titleId={this.props.match.params.id} />;
    };
    render() {
        return (
            <EditPage>
                {
                    this.state.isEditMode ? this.editMode() : this.readOnly()
                }                
                <TerritoryMetadata isEditMode={this.state.isEditMode} handleSwitchMode={this.handleSwitchMode} />
            </EditPage>
        );
    }
}

let mapDispatchToProps = {
    updateBreadcrumb
};

TitleEdit.propTypes = {
    updateBreadcrumb: t.func,
    match: t.object.isRequired
};

export default connect(null, mapDispatchToProps)(TitleEdit);