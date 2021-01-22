import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import {getAllFields} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/utils';
import {get} from 'lodash';
import {connect} from 'react-redux';
import * as detailsSelectors from '../../../avails/right-details/rightDetailsSelector';
import {searchPerson} from '../../../avails/right-details/rightDetailsServices';
import {FIELDS_TO_REMOVE, SYNC} from '../../constants';
import {
    getTitle,
    getExternalIds,
    getTerritoryMetadata,
    getEditorialMetadata,
    updateTitle,
    syncTitle,
    publishTitle,
} from '../../titleMetadataActions';
import * as selectors from '../../titleMetadataSelectors';
import {generateMsvIds, regenerateAutoDecoratedMetadata} from '../../titleMetadataServices';
import {
    handleEditorialGenresAndCategory,
    handleTitleCategory,
    updateTerritoryMetadata,
    updateEditorialMetadata,
    isNexusTitle,
} from '../../utils';
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
    syncTitle,
    publishTitle,
}) => {
    const containerRef = useRef();
    const [isEditView, setIsEditView] = useState(false);

    useEffect(() => {
        const {params} = match || {};
        const {id} = params;
        if (id) {
            const nexusTitle = isNexusTitle(id);
            getTitle({id});
            nexusTitle && getExternalIds({id});
            getTerritoryMetadata({id});
            getEditorialMetadata({id});
        }
    }, []);

    const onSubmit = values => {
        const {params} = match || {};
        const {id} = params;
        // remove fields under arrayWithTabs
        const {fields} = schema;
        const innerFields = getAllFields(fields, true);
        const allFields = getAllFields(fields, false);
        const valuesNoInnerFields = [];

        // remove innerFields from values
        Object.keys(values).forEach(key => {
            const removeFromPayload = get(allFields, `${key}.removeFromPayload`);
            if (!get(innerFields, key) && !removeFromPayload) {
                valuesNoInnerFields[key] = values[key];
            }
        });

        const updatedValues = [];
        Object.keys(valuesNoInnerFields).forEach(key => {
            if (!FIELDS_TO_REMOVE.find(e => e === key)) {
                updatedValues[key] = values[key];
            }
        });
        updateTitle({...updatedValues, id: title.id});
        updateTerritoryMetadata(values, id);
        updateEditorialMetadata(values, id);
    };

    const extendTitleWithExternalIds = () => {
        const [vzExternalIds] = externalIds.filter(ids => ids.externalSystem === 'vz');
        const [movidaExternalIds] = externalIds.filter(ids => ids.externalSystem === 'movida');
        const updatedTitle = handleTitleCategory(title);
        const updatedEditorialMetadata = handleEditorialGenresAndCategory(editorialMetadata, 'category', 'name');
        console.log(updatedTitle);
        return {
            ...updatedTitle,
            vzExternalIds,
            movidaExternalIds,
            editorialMetadata: handleEditorialGenresAndCategory(updatedEditorialMetadata, 'genres', 'genre'),
            territorialMetadata: territoryMetadata,
        };
    };

    const syncPublishHandler = (externalSystem, buttonType) => {
        const {params} = match || {};
        const {id} = params;
        if (buttonType === SYNC) {
            syncTitle({id, externalSystem});
        } else {
            publishTitle({id, externalSystem});
        }
    };

    return (
        <div className="nexus-c-title-details">
            <TitleDetailsHeader
                title={title}
                history={history}
                containerRef={containerRef}
                externalIds={externalIds}
                onSyncPublish={syncPublishHandler}
                isEditView={isEditView}
            />
            <NexusDynamicForm
                searchPerson={searchPerson}
                schema={schema}
                initialData={extendTitleWithExternalIds()}
                isEdit
                isTitlePage={true}
                containerRef={containerRef}
                selectValues={selectValues}
                onSubmit={values => onSubmit(values)}
                generateMsvIds={generateMsvIds}
                regenerateAutoDecoratedMetadata={regenerateAutoDecoratedMetadata}
                hasButtons={isNexusTitle(title.id)}
                setIsEditView={setIsEditView}
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
    syncTitle: PropTypes.func,
    publishTitle: PropTypes.func,
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
    syncTitle: () => null,
    publishTitle: () => null,
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
    syncTitle: payload => dispatch(syncTitle(payload)),
    publishTitle: payload => dispatch(publishTitle(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleDetails);
