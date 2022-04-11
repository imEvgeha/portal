import React, {memo, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import NexusStickyFooter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-sticky-footer/NexusStickyFooter';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {searchPerson} from '@vubiquity-nexus/portal-utils/lib/services/rightDetailsServices';
import {connect} from 'react-redux';
import {fetchConfigApiEndpoints} from '../../legacy/containers/settings/settingsActions';
import * as settingsSelectors from '../../legacy/containers/settings/settingsSelectors';
import Loading from '../../static/Loading';
import {getRight, updateRight, clearRight} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import RightDetailsHeader from './components/RightDetailsHeader';
import * as detailsSelectors from './rightDetailsSelector';
import schema from './schema.json';
import './RightDetails.scss';

const RightDetails = ({
    getRight,
    updateRight,
    right,
    match,
    selectValues,
    isSaving,
    clearRight,
    isFetching,
    fetchConfigApiEndpoints,
    configApiEndpoints,
}) => {
    const containerRef = useRef();
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchConfigApiEndpoints();

        const {params} = match || {};
        if (params.id) {
            getRight({id: params.id});
        }

        return () => {
            clearRight();
        };
    }, [refresh]);

    const onSubmit = values => {
        updateRight(values);
    };

    if (isFetching) {
        return <Loading />;
    }

    return (
        <div className="nexus-c-right-details">
            <RightDetailsHeader title="Right Details" right={right} containerRef={containerRef} />
            {right?.id && (
                <NexusDynamicForm
                    castCrewConfig={configApiEndpoints.find(e => e.displayName === 'Persons')}
                    schema={schema}
                    initialData={right}
                    onSubmit={values => onSubmit(values)}
                    selectValues={selectValues}
                    isSaving={isSaving}
                    containerRef={containerRef}
                    searchPerson={searchPerson}
                    canEdit={!!right?.id}
                    setRefresh={setRefresh}
                />
            )}
            <NexusStickyFooter />
        </div>
    );
};

RightDetails.propTypes = {
    getRight: PropTypes.func,
    updateRight: PropTypes.func,
    right: PropTypes.object,
    match: PropTypes.object,
    clearRight: PropTypes.func,
    selectValues: PropTypes.object,
    isSaving: PropTypes.bool,
    isFetching: PropTypes.bool,
    configApiEndpoints: PropTypes.array,
    fetchConfigApiEndpoints: PropTypes.func,
};

RightDetails.defaultProps = {
    getRight: () => null,
    updateRight: () => null,
    clearRight: () => null,
    right: {},
    match: {},
    selectValues: {},
    isSaving: false,
    isFetching: false,
    configApiEndpoints: [],
    fetchConfigApiEndpoints: () => null,
};

const mapStateToProps = () => {
    const rightSelector = selectors.getRightDetailsRightsSelector();
    const loadingSelector = createLoadingSelector(['GET_RIGHT']);
    const settingsConfigEndpointsSelector = settingsSelectors.createSettingsEndpointsSelector();

    return (state, props) => ({
        right: rightSelector(state, props),
        selectValues: detailsSelectors.selectValuesSelector(state, props),
        isSaving: detailsSelectors.isSavingSelector(state),
        isFetching: loadingSelector(state),
        configApiEndpoints: settingsConfigEndpointsSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    getRight: payload => dispatch(getRight(payload)),
    clearRight: () => dispatch(clearRight()),
    updateRight: payload => dispatch(updateRight(payload)),
    fetchConfigApiEndpoints: payload => dispatch(fetchConfigApiEndpoints(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(RightDetails));
