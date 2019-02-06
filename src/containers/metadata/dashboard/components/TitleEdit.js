import React from 'react';
import { updateBreadcrumb } from '../../../../stores/actions/metadata/index';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import { BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH } from '../../../../constants/metadata-breadcrumb-paths';
import './TitleEdit.scss';
import TitleReadOnlyMode from './TitleReadOnlyMode';
import TitleEditMode from './TitleEditMode';


class TitleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditMode: false
        };
    }
    componentDidMount() {
        this.props.updateBreadcrumb([BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH]);
    }

    handleSwitchMode = () => {
        this.setState({ isEditMode: !this.state.isEditMode });
    }

    readOnly = () => {
        return <TitleReadOnlyMode titleId={this.props.match.params.id} handleSwitchMode={this.handleSwitchMode} />;
    };

    editMode = () => {
        return <TitleEditMode
            handleSwitchMode={this.handleSwitchMode}
            titleId={this.props.match.params.id} />;
    };
    render() {
        return (
            this.state.isEditMode ? this.editMode() : this.readOnly()
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