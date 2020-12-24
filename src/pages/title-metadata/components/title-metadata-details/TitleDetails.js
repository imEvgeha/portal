import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import {connect} from 'react-redux';
import * as detailsSelectors from '../../../avails/right-details/rightDetailsSelector';
import {searchPerson} from '../../../avails/right-details/rightDetailsServices';
import {isNexusTitle} from '../../../legacy/containers/metadata/dashboard/components/utils/utils';
import {
    getTitle,
    getExternalIds,
    getTerritoryMetadata,
    getEditorialMetadata,
    updateTitle,
} from '../../titleMetadataActions';
import * as selectors from '../../titleMetadataSelectors';
import {generateMsvIds} from '../../titleMetadataServices';
import {handleEditorialGenres} from '../../utils';
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
        updateTitle({...values, id: title.id});
    };

    const extendTitleWithExternalIds = () => {
        const [vzExternalIds] = externalIds.filter(ids => ids.externalSystem === 'vz');
        const [movidaExternalIds] = externalIds.filter(ids => ids.externalSystem === 'movida');
        return {
            ...title,
            vzExternalIds,
            movidaExternalIds,
            editorialMetadata: handleEditorialGenres(editorialMetadata),
            territorialMetadata: territoryMetadata,
        };
    };

    return (
        <div className="nexus-c-title-details">
            <TitleDetailsHeader title={title} history={history} containerRef={containerRef} externalIds={externalIds} />
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
