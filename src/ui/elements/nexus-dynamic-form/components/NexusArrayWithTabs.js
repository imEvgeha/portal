import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import {NexusModalContext} from '../../nexus-modal/NexusModal';
import {renderNexusField} from '../utils';
import SideTabs from './SideTabs/SideTabs';
import {VIEWS, NEXUS_ARRAY_WITH_TABS_ADD_BTN_LABELS} from '../constants';
import './NexusArrayWithTabs.scss';

const NexusArrayWithTabs = ({
    fields,
    getValues,
    view,
    selectValues,
    data,
    setFieldValue,
    config,
    isUpdate,
    tabs,
    subTabs,
    path,
    name,
}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [groupedData, setGroupedData] = useState({});
    const [currentData, setCurrentData] = useState(null);

    useEffect(() => {
        const groupedObj = groupBy();
        setGroupedData(groupedObj);
    }, [data]);

    const groupBy = () => {
        const keys = tabs;
        if (keys.length === 0) return {};
        return data.reduce((acc, obj) => {
            const prop = keys.length === 1 ? obj[keys[0]] : `${obj[keys[0]]} ${obj[keys[1]]}`;
            acc[prop] = acc[prop] || [];
            acc[prop].push(obj);
            return acc;
        }, {});
    };

    const changeTabData = (key, index) => {
        const newCurrentData = groupedData[key][index];
        setCurrentData(newCurrentData);
    };

    const openEditModal = () => {
        openModal(modalContent(), {
            title: <div className="nexus-c-array__modal-title">{`Add ${name} Data`}</div>,
            width: 'medium',
        });
    };

    const handleModalSubmit = values => {};

    const modalContent = () => {
        return (
            <div className="nexus-c-array__modal">
                <AKForm onSubmit={values => handleModalSubmit(values)}>
                    {({formProps, dirty, submitting, reset, getValues}) => (
                        <form {...formProps}>
                            <div className="nexus-c-array__modal-fields">
                                {Object.keys(fields).map((key, index) => {
                                    return (
                                        <div key={index} className="nexus-c-nexus-array-with-tabs__field">
                                            {renderNexusField(key, VIEWS.CREATE, getValues, {
                                                field: fields[key],
                                                selectValues,
                                                setFieldValue,
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                            <FormFooter>
                                <Button type="submit" appearance="primary">
                                    Submit
                                </Button>
                                <Button
                                    className="nexus-c-modal__cancel-button"
                                    appearance="danger"
                                    onClick={() => {
                                        reset();
                                        closeModal();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </FormFooter>
                        </form>
                    )}
                </AKForm>
            </div>
        );
    };

    return (
        <div className="nexus-c-nexus-array-with-tabs">
            <div className="nexus-c-nexus-array-with-tabs__tabs">
                <SideTabs onChange={changeTabData} data={groupedData} subTabs={subTabs} />
            </div>
            <div className="nexus-c-nexus-array-with-tabs__fields">
                <div className="nexus-c-nexus-array-with-tabs__heading">
                    <div>
                        <span>Some label</span>
                        <Button appearance="danger">Delete</Button>
                    </div>
                    <Button onClick={openEditModal}>{NEXUS_ARRAY_WITH_TABS_ADD_BTN_LABELS[path]}</Button>
                </div>
                {Object.keys(fields).map((key, index) => {
                    return (
                        <div key={index} className="nexus-c-nexus-array-with-tabs__field">
                            {renderNexusField(key, view, getValues, {
                                initialData: currentData || data[0],
                                field: fields[key],
                                selectValues,
                                setFieldValue,
                                config,
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

NexusArrayWithTabs.propTypes = {
    fields: PropTypes.object,
    view: PropTypes.string,
    data: PropTypes.array,
    getValues: PropTypes.func,
    setFieldValue: PropTypes.func,
    selectValues: PropTypes.object,
    config: PropTypes.array,
    isUpdate: PropTypes.bool,
    tabs: PropTypes.array,
    subTabs: PropTypes.array,
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

NexusArrayWithTabs.defaultProps = {
    fields: {},
    view: VIEWS.VIEW,
    data: [],
    getValues: undefined,
    setFieldValue: undefined,
    selectValues: {},
    config: [],
    isUpdate: false,
    tabs: [],
    subTabs: [],
};

export default NexusArrayWithTabs;
