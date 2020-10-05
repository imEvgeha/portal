import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form/Form';
import {NexusModalContext} from '../../nexus-modal/NexusModal';
import {buildSection, getAllFields, getFieldByName, getProperValue} from '../utils';
import {VIEWS} from '../constants';
import './NexusArray.scss';

const NexusArray = ({name, view, data, fields, getValues, ...props}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const renderObject = (object, index) => {
        return (
            <div
                key={index}
                onClick={() => view === VIEWS.EDIT && openEditModal(index)}
                className="nexus-c-array__object"
            >
                {buildSection(fields, getValues, view, data[index] || {})}
            </div>
        );
    };

    const buildButtons = (dirty, submitting, reset) => {
        return (
            <>
                <Button
                    type="submit"
                    className="nexus-c-dynamic-form__submit-button"
                    appearance="primary"
                    isDisabled={!dirty || submitting}
                >
                    Save changes
                </Button>
                <Button
                    className="nexus-c-dynamic-form__cancel-button"
                    onClick={() => {
                        reset();
                        closeModal();
                    }}
                >
                    Cancel
                </Button>
            </>
        );
    };

    const handleOnSubmit = values => {
        console.log(values);
        // setView(VIEWS.VIEW);
        // // make keys same as path
        // const properValues = [];
        // const allFields = getAllFields(schema);
        // Object.keys(values).map(key => {
        //     const field = getFieldByName(allFields, key);
        //     const {path} = field;
        //     properValues[path] = getProperValue(field.type, values[key]);
        // });
        // onSubmit(properValues);
    };

    const modalContent = index => {
        return (
            <div key={index} className="nexus-c-array__modal">
                <AKForm onSubmit={values => handleOnSubmit(values)}>
                    {({formProps, dirty, submitting, reset, getValues}) => (
                        <form {...formProps}>
                            {buildSection(fields, getValues, view, data[index] || {})}
                            {buildButtons(dirty, submitting, reset)}
                        </form>
                    )}
                </AKForm>
            </div>
        );
    };

    const openEditModal = index => {
        openModal(modalContent(index), {title: 'Territory Data', width: 'small'});
    };

    return <div className="nexus-c-array">{data.map((o, index) => renderObject(o, index))}</div>;
};

NexusArray.propTypes = {
    name: PropTypes.string.isRequired,
    view: PropTypes.string,
    data: PropTypes.array,
    fields: PropTypes.object,
    getValues: PropTypes.func,
};

NexusArray.defaultProps = {
    view: VIEWS.VIEW,
    data: [],
    fields: {},
    getValues: undefined,
};

export default NexusArray;
