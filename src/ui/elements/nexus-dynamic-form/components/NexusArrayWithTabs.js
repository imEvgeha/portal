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
    const [isRemoved, setIsRemoved] = useState(false);

    useEffect(() => {
        const groupedObj = groupBy(data);
        setGroupedData(groupedObj);
    }, [data]);

    const groupBy = values => {
        const keys = tabs;
        if (keys.length === 0) return {};
        return values.reduce((acc, obj) => {
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

    const removeCurrentRecord = (dataArr, current) => {
        if (subTabs.length) {
            return dataArr.filter(obj => {
                let isEqual = false;
                subTabs.forEach(field => {
                    if (obj[field] !== current[field]) isEqual = true;
                });
                return isEqual;
            });
        }
        return [];
    };

    const handleDeleteRecord = () => {
        const current = currentData || data[0];
        const groupedCurrent = groupBy([current]);
        const [key] = Object.keys(groupedCurrent);
        const updatedGroupedData = {...groupedData};
        updatedGroupedData[key] = removeCurrentRecord(updatedGroupedData[key], current);
        if (updatedGroupedData[key].length === 0) {
            delete updatedGroupedData[key];
        }
        setGroupedData(updatedGroupedData);
        setCurrentData(updatedGroupedData[Object.keys(updatedGroupedData)[0]][0]);
        setIsRemoved(true);
    };

    const openEditModal = () => {
        openModal(modalContent(), {
            title: <div className="nexus-c-array__modal-title">{`Add ${name} Data`}</div>,
            width: 'medium',
        });
    };

    const handleValuesFormat = values => {
        Object.keys(values).forEach(key => {
            const obj = values[key];
            if (
                obj &&
                typeof obj === 'object' &&
                !Array.isArray(obj) &&
                obj.hasOwnProperty('label') &&
                obj.hasOwnProperty('value')
            ) {
                values[key] = obj.value;
            }
            if (key === 'editorialCastCrew') {
                values['castCrew'] = obj;
                delete values[key];
            }
        });
        return values;
    };

    const handleModalSubmit = values => {
        const properValues = handleValuesFormat(values);
        const groupedValues = groupBy([values]);
        const [key] = Object.keys(groupedValues);
        const updatedGroupedData = {...groupedData};
        updatedGroupedData[key] = [];
        updatedGroupedData[key].push(properValues);
        setGroupedData(updatedGroupedData);
        closeModal();
    };

    const modalContent = () => {
        return (
            <div>
                <AKForm onSubmit={values => handleModalSubmit(values)}>
                    {({formProps, reset, getValues}) => (
                        <form {...formProps}>
                            <div>
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
                <SideTabs onChange={changeTabData} data={groupedData} subTabs={subTabs} isRemoved={isRemoved} />
            </div>
            <div className="nexus-c-nexus-array-with-tabs__fields">
                <div className="nexus-c-nexus-array-with-tabs__heading">
                    <div>
                        <span>Some label</span>
                        {view === VIEWS.EDIT && (
                            <Button appearance="danger" onClick={handleDeleteRecord}>
                                Delete
                            </Button>
                        )}
                    </div>
                    {view === VIEWS.EDIT && (
                        <Button onClick={openEditModal}>{NEXUS_ARRAY_WITH_TABS_ADD_BTN_LABELS[path]}</Button>
                    )}
                </div>
                {Object.keys(groupedData).length ? (
                    Object.keys(fields).map((key, index) => {
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
                    })
                ) : (
                    <div>No Editorial Metadata Exists</div>
                )}
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
