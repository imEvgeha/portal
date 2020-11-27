import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import NexusDynamicForm from '../../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import * as detailsSelectors from '../../../avails/right-details/rightDetailsSelector';
import {isNexusTitle} from '../../../legacy/containers/metadata/dashboard/components/utils/utils';
import {
    getTitle,
    getExternalIds,
    getTerritoryMetadata,
    getEditorialMetadata,
    updateTitle,
} from '../../titleMetadataActions';
import * as selectors from '../../titleMetadataSelectors';
import TitleDetailsHeader from './components/TitleDetailsHeader';
import './TitleDetails.scss';
import schema from './schema.json';

const TitleDetails = ({
    history,
    match,
    title,
    externalIds,
    territoryMetadata,
    editorialMetadata,
    getTitle,
    getExternalIds,
    getTerritoryMetadata,
    getEditorialMetadata,
    updateTitle,
    selectValues,
}) => {
    const containerRef = useRef();

    useEffect(() => {
        const {params} = match || {};
        if (params.id) {
            const nexusTitle = isNexusTitle(params.id);
            getTitle({id: params.id});
            nexusTitle && getExternalIds({id: params.id});
            getTerritoryMetadata({id: params.id});
            getEditorialMetadata({id: params.id});
        }
    }, []);

    const onSubmit = values => {
        updateTitle({...values, id: title.id});
    };

    return (
        <div className="nexus-c-title-details">
            <TitleDetailsHeader title={title} history={history} containerRef={containerRef} externalIds={externalIds} />
            <NexusDynamicForm
                schema={schema}
                initialData={title}
                isEdit
                isTitlePage={true}
                containerRef={containerRef}
                selectValues={selectValues}
                onSubmit={values => onSubmit(values)}
            />
        </div>
    );
};

TitleDetails.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    title: PropTypes.object,
    externalIds: PropTypes.array,
    territoryMetadata: PropTypes.array,
    editorialMetadata: PropTypes.array,
    getTitle: PropTypes.func,
    getExternalIds: PropTypes.func,
    getTerritoryMetadata: PropTypes.func,
    getEditorialMetadata: PropTypes.func,
    updateTitle: PropTypes.func,
    selectValues: PropTypes.object,
};

TitleDetails.defaultProps = {
    history: {},
    match: {},
    title: {},
    externalIds: [],
    territoryMetadata: [],
    editorialMetadata: [],
    getTitle: () => null,
    getExternalIds: () => null,
    getTerritoryMetadata: () => null,
    getEditorialMetadata: () => null,
    updateTitle: () => null,
    selectValues: {},
};

const mapStateToProps = () => {
    const titleSelector = selectors.createTitleSelector();
    const externalIdsSelector = selectors.createExternalIdsSelector();
    const territoryMetadataSelector = selectors.createTerritoryMetadataSelector();
    const editorialMetadataSelector = selectors.createEditorialMetadataSelector();

    return (state, props) => ({
        title: titleSelector(state, props),
        externalIds: externalIdsSelector(state, props),
        territoryMetadata: territoryMetadataSelector(state, props),
        editorialMetadata: editorialMetadataSelector(state, props),
        selectValues: detailsSelectors.selectValuesSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    getTitle: payload => dispatch(getTitle(payload)),
    getExternalIds: payload => dispatch(getExternalIds(payload)),
    getTerritoryMetadata: payload => dispatch(getTerritoryMetadata(payload)),
    getEditorialMetadata: payload => dispatch(getEditorialMetadata(payload)),
    updateTitle: payload => dispatch(updateTitle(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleDetails);
