import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Field as AKField} from '@atlaskit/form';
import SectionMessage from '@atlaskit/section-message';
import {get} from 'lodash';
import {NexusModalContext} from '../../nexus-modal/NexusModal';
import {renderNexusField} from '../utils';
import NexusArrayCreateModal from './NexusArrayCreateModal';
import SideTabs from './SideTabs/SideTabs';
import {MASTER_EMET_MESSAGE, NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS, VIEWS} from '../constants';
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
    generateMsvIds,
    searchPerson,
    regenerateAutoDecoratedMetadata,
    setRefresh,
    castCrewConfig,
    initialData,
    prefix,
}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [groupedData, setGroupedData] = useState({});
    const [currentData, setCurrentData] = useState(null);
    const [isRemoved, setIsRemoved] = useState(false);
    const [regenerateLoading, setRegenerateLoading] = useState(false);

    useEffect(() => {
        const groupedObj = data ? groupBy(data) : {};
        setGroupedData(groupedObj);
    }, [data, initialData, isUpdate]);

    const clearIsRemoved = () => {
        setIsRemoved(false);
    };

    const setTabData = tabIndex => {
        if (groupedData) {
            setCurrentData(groupedData[tabIndex]);
        }
    };

    const groupBy = values => {
        const keys = tabs;
        if (keys.length === 0) return {};
        if (Array.isArray(values)) {
            return values.reduce((acc, obj) => {
                const prop = keys.length === 1 ? obj[keys[0]] : `${obj[keys[0]]} ${obj[keys[1]]}`;
                acc[prop] = acc[prop] || [];
                acc[prop].push(obj);
                return acc;
            }, {});
        }
        return {};
    };

    const getCurrentFormData = () => {
        const formData = getValues();
        if (path === 'ratings') {
            const currentRating = {};
            Object.keys(fields).forEach(key => {
                currentRating[key] = formData[key];
            });
            return handleValuesFormat(currentRating);
        }
        return formData[NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS[path]];
    };

    const changeTabData = (oldSubTab, key, index) => {
        if (view === VIEWS.EDIT) {
            const currentFormData = getCurrentFormData();
            const current = currentData || currentFormData;
            replaceRecordInGroupedData(currentFormData, current, oldSubTab, index, key);
            const newData = replaceRecordInData(currentFormData, current);
            setFieldValue(path, newData);
        } else {
            const newCurrentData = groupedData[key][index];
            setCurrentData(newCurrentData);
        }
    };

    const replaceRecordInGroupedData = (currentFormData, current, subTabIndex, indexTo, keyTo) => {
        if (subTabs.length) {
            let key = '';
            tabs.forEach(property => {
                key += key.length > 1 ? ` ${current[property]}` : current[property];
            });
            const updatedArray = [...groupedData[key]];
            updatedArray[subTabIndex] = {
                ...updatedArray[subTabIndex],
                ...currentFormData,
            };

            const updatedGroupedData = {...groupedData};
            updatedGroupedData[key][subTabIndex] = {
                ...updatedGroupedData[key][subTabIndex],
                ...currentFormData,
            };
            const newCurrentData = updatedGroupedData[keyTo][indexTo];
            setCurrentData(newCurrentData);

            setGroupedData(prevState => {
                return {
                    ...prevState,
                    [key]: updatedArray,
                };
            });
        } else {
            const [property] = tabs;
            const key = current[property];

            const updatedGroupedData = {...groupedData};
            updatedGroupedData[key][0] = {
                ...updatedGroupedData[key][0],
                ...currentFormData,
            };
            const newCurrentData = updatedGroupedData[keyTo][indexTo];
            setCurrentData(newCurrentData);

            setGroupedData(prevGroupedData => {
                const [oldData] = prevGroupedData[key];
                return {
                    ...prevGroupedData,
                    [key]: [
                        {
                            ...oldData,
                            ...currentFormData,
                        },
                    ],
                };
            });
        }
    };

    const replaceRecordInData = (currentFormData, current) => {
        const newData = [...getValues()[path]];
        if (subTabs.length) {
            const keys = [...tabs, ...subTabs];
            const index = newData.findIndex(obj => {
                let isEqual = true;
                keys.forEach(key => {
                    if (obj[key] !== current[key]) isEqual = false;
                });
                return isEqual;
            });
            if (index >= 0) {
                newData[index] = {
                    ...newData[index],
                    ...currentFormData,
                };
            }
        } else {
            const [key] = tabs;
            const value = current[key];
            const index = newData.findIndex(obj => {
                return obj[key] === value;
            });
            if (index >= 0) {
                newData[index] = {
                    ...newData[index],
                    ...currentFormData,
                };
            }
        }
        return newData;
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
        const keys = Object.keys(updatedGroupedData);
        const newCurrentData = keys.length ? updatedGroupedData[keys[0]][0] : null;
        setCurrentData(newCurrentData);
        setIsRemoved(true);

        const newData = [...getValues()[path]];
        const keyProps = [...tabs, ...subTabs];
        const index = newData.findIndex(obj => {
            let isEqual = true;
            keyProps.forEach(keyProp => {
                if (obj[keyProp] !== current[keyProp]) isEqual = false;
            });
            return isEqual;
        });
        if (path === 'ratings') {
            newData.splice(index, 1);
        } else {
            newData[index] = {
                ...newData[index],
                isDeleted: true,
            };
        }
        setFieldValue(path, newData);
    };

    const openEditModal = () => {
        openModal(modalContent(), {
            title: <div className="nexus-c-array__modal-title">{`Add ${name} Data`}</div>,
            width: 'medium',
        });
        const currentValues = getCurrentFormData();
        const updatedCurrentData = {
            ...currentData,
            ...currentValues,
        };
        setCurrentData(updatedCurrentData);
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
            } else if (obj && typeof obj === 'object' && Array.isArray(obj)) {
                obj.forEach((val, index) => {
                    if (val.hasOwnProperty('label') && val.hasOwnProperty('value')) {
                        if (['genres'].includes(key)) {
                            obj[index] = val;
                        } else {
                            obj[index] = val.value;
                        }
                    }
                });
            }
        });
        return values;
    };

    const handleModalSubmit = values => {
        const properValues =
            path === 'ratings'
                ? handleValuesFormat(values)
                : handleValuesFormat(values[NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS[path]]);
        const groupedValues = groupBy([properValues]);
        const [key] = Object.keys(groupedValues);
        const updatedGroupedData = {...groupedData};
        updatedGroupedData[key] = updatedGroupedData[key] ? updatedGroupedData[key] : [];
        updatedGroupedData[key].push(properValues);
        setGroupedData(updatedGroupedData);

        if (!currentData && !Object.keys(groupedData).length) {
            setCurrentData(properValues);
        }

        const newData = [...getValues()[path]];
        const newObject =
            path === 'ratings'
                ? {
                      ...properValues,
                  }
                : {
                      ...properValues,
                      isCreated: true,
                  };
        newData.push(newObject);
        setFieldValue(path, newData);
        closeModal();
    };

    const modalContent = () => {
        return (
            <NexusArrayCreateModal
                handleModalSubmit={handleModalSubmit}
                fields={fields}
                selectValues={selectValues}
                data={data}
                setFieldValue={setFieldValue}
                generateMsvIds={generateMsvIds}
                searchPerson={searchPerson}
                castCrewConfig={castCrewConfig}
                initialData={initialData}
                closeModal={closeModal}
                prefix={prefix}
            />
        );
    };

    const isMasterEditorialRecord = () => {
        if (path === 'editorialMetadata' && view === VIEWS.EDIT) {
            const current = currentData || data[0];
            return current && get(current, 'hasGeneratedChildren');
        }
        return false;
    };

    const showRegenerateAutoDecoratedMetadata = () => {
        if (path === 'editorialMetadata' && view === VIEWS.VIEW) {
            const usEnData = get(groupedData, 'US en');
            const hasGeneratedChildren = usEnData && usEnData.some(obj => obj.hasGeneratedChildren);
            const current = currentData || data[0];
            const isUsEn = current && get(current, 'locale') === 'US' && get(current, 'language') === 'en';
            return isUsEn && hasGeneratedChildren;
        }
        return false;
    };

    const handleRegenerateAutoDecoratedMetadata = async () => {
        const usEnData = get(groupedData, 'US en');
        if (usEnData) {
            const masterEmet = usEnData.find(data => data.hasGeneratedChildren);
            if (masterEmet) {
                setRegenerateLoading(true);
                await regenerateAutoDecoratedMetadata({...masterEmet});
                setRefresh(prev => !prev);
                setRegenerateLoading(false);
            }
        }
    };

    const renderFields = () => {
        return Object.keys(fields).map(key => {
            const initData = currentData
                ? {...currentData, contentType: initialData.contentType}
                : {...data[0], contentType: initialData.contentType};
            const tabId = initData.id ? initData.id : initData.ratingSystem;

            return (
                <div key={`nexus-c-array__field_${tabId}_${key}`} className="nexus-c-nexus-array-with-tabs__field">
                    {renderNexusField(key, view, getValues, generateMsvIds, {
                        initialData: initData,
                        field: fields[key],
                        selectValues,
                        setFieldValue,
                        config,
                        searchPerson,
                        castCrewConfig,
                        inTabs: true,
                        path,
                    })}
                </div>
            );
        });
    };

    return (
        <div className="nexus-c-nexus-array-with-tabs">
            <div className="nexus-c-nexus-array-with-tabs__tabs">
                <SideTabs
                    onChange={changeTabData}
                    data={groupedData}
                    subTabs={subTabs}
                    isRemoved={isRemoved}
                    isEdit={view === VIEWS.EDIT}
                    setTabData={setTabData}
                    clearIsRemoved={clearIsRemoved}
                />
            </div>
            <div className="nexus-c-nexus-array-with-tabs__fields">
                <div className="nexus-c-nexus-array-with-tabs__heading">
                    <div>
                        {view === VIEWS.EDIT && (
                            <Button
                                appearance="danger"
                                onClick={handleDeleteRecord}
                                isDisabled={!Object.keys(groupedData).length}
                            >
                                Delete Record
                            </Button>
                        )}
                    </div>
                    {view === VIEWS.EDIT && <Button onClick={openEditModal}>{`+ Add ${name} Data`}</Button>}
                    {showRegenerateAutoDecoratedMetadata() && (
                        <Button
                            appearance="primary"
                            onClick={handleRegenerateAutoDecoratedMetadata}
                            isLoading={regenerateLoading}
                        >
                            Regenerate Auto-Decorated Metadata
                        </Button>
                    )}
                </div>
                {isMasterEditorialRecord() && (
                    <div className="nexus-c-nexus-array-with-tabs__master-emet">
                        <SectionMessage>
                            <p>{MASTER_EMET_MESSAGE}</p>
                        </SectionMessage>
                    </div>
                )}
                <AKField name={path} defaultValue={data}>
                    {({fieldProps, error}) => <></>}
                </AKField>
                {Object.keys(groupedData).length ? renderFields() : <div>{`No ${name} Exists`}</div>}
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
    generateMsvIds: PropTypes.func,
    searchPerson: PropTypes.func,
    regenerateAutoDecoratedMetadata: PropTypes.func,
    castCrewConfig: PropTypes.object,
    setRefresh: PropTypes.func,
    initialData: PropTypes.object,
    prefix: PropTypes.string,
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
    generateMsvIds: undefined,
    searchPerson: undefined,
    regenerateAutoDecoratedMetadata: undefined,
    castCrewConfig: {},
    setRefresh: undefined,
    initialData: {},
    prefix: undefined,
};

export default NexusArrayWithTabs;
