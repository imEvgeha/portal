import React, {memo, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import {connect} from 'react-redux';
import {getRight, updateRight, editRight} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import RightDetailsHeader from './components/RightDetailsHeader';
import * as detailsSelectors from './rightDetailsSelector';
import {searchPerson} from './rightDetailsServices';
import schema from './schema.json';
import './RightDetails.scss';

/*
 The new right details page implementation:
 - uses NexusDynamicForm, which uses a schema to display
 and configure edit/view form fields
*/

const RightDetails = ({getRight, updateRight, right, match, selectValues, isSaving, isEditMode, setEditRight}) => {
    const containerRef = useRef();

    useEffect(() => {
        const {params} = match || {};
        if (params.id) {
            getRight({id: params.id});
        }
    }, []);

    const onSubmit = values => {
        updateRight(values);
    };

    return (
        <div className="nexus-c-right-details">
            <RightDetailsHeader title="Right Details" right={right} containerRef={containerRef} />
            <NexusDynamicForm
                schema={schema}
                initialData={right}
                isEdit={true}
                onSubmit={values => onSubmit(values)}
                selectValues={selectValues}
                isSaving={isSaving}
                containerRef={containerRef}
                searchPerson={searchPerson}
                setEditMode={setEditRight}
            />
        </div>
    );
};

RightDetails.propTypes = {
    getRight: PropTypes.func,
    updateRight: PropTypes.func,
    right: PropTypes.object,
    match: PropTypes.object,
    selectValues: PropTypes.object,
    isSaving: PropTypes.bool,
    isEditMode: PropTypes.bool,
    setEditRight: PropTypes.func,
};

RightDetails.defaultProps = {
    getRight: () => null,
    updateRight: () => null,
    right: {},
    match: {},
    selectValues: {},
    isSaving: false,
    isEditMode: false,
    setEditRight: () => null,
};

const mapStateToProps = () => {
    const rightSelector = selectors.getRightDetailsRightsSelector();

    return (state, props) => ({
        right: rightSelector(state, props),
        selectValues: detailsSelectors.selectValuesSelector(state, props),
        isSaving: detailsSelectors.isSavingSelector(state),
        isEditMode: detailsSelectors.isEditModeSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    getRight: payload => dispatch(getRight(payload)),
    updateRight: payload => dispatch(updateRight(payload)),
    setEditRight: payload => dispatch(editRight(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(RightDetails));
