import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {Button} from '@portal/portal-components';
import {useDispatch} from 'react-redux';
import {addToast} from '../../../../../../toast/NexusToastNotificationActions';
import {NexusModalContext} from '../../../../../nexus-modal/NexusModal';
import AddRowDataItem from './AddRowDataItem';
import './RowDataItem.scss';

const RowDataItem = ({
    selectValues,
    data,
    firstColLbl,
    firstColKey,
    secondColLbl,
    secondColKey,
    canAdd,
    canDelete,
    onChange,
    ...props
}) => {
    const dispatch = useDispatch();
    const {openModal, closeModal} = useContext(NexusModalContext);

    const [entries, setEntries] = useState([]);

    useEffect(() => {
        setEntries(data);
    }, [data]);

    const openAddRowDataItemModal = () => {
        openModal(
            <AddRowDataItem
                onAddRowDataItem={onAddRowDataItem}
                schema={props.addNewModalOptions}
                closeModal={closeModal}
                selectValues={selectValues}
            />,
            {
                title: <div>{props.addNewModalOptions.header}</div>,
                width: 'medium',
            }
        );
    };

    /**
     * Loop through the entries of the fields, and check if {selectValues} has a property named
     * with the value of `path` - example: externalSystem path
     * @returns {boolean} - whether to show button or not
     */
    const showCreateButton = () => {
        let canShowElement = true;
        props.addNewModalOptions.fields?.forEach(f => {
            f.sections.forEach(s => {
                Object.entries(s.fields).forEach(entry => {
                    // if this is a Select element and if it's path exists in selectValues
                    if (entry[1].type === 'select' && !selectValues?.[entry[1].path]) {
                        // flag this as do not show
                        canShowElement = false;
                    }
                });
            });
        });
        return canShowElement;
    };

    const onAddRowDataItem = async values => {
        const uniqueByFields = props.addNewModalOptions.uniqueByFields;
        let entryExists = true;

        uniqueByFields.forEach(field => {
            const entryFound = entries.find(item => values[field] === (item.id || item[field]));
            entryExists &&= !!entryFound;
        });

        if (entryExists) {
            const errorToast = {
                severity: 'error',
                detail: props.addNewModalOptions.duplicationErrorMessage,
            };
            dispatch(addToast(errorToast));
        } else {
            let ddls = [];
            let newEntry = {};
            // Dynamic transformation for select elements.
            // Based on the schema field outputMap passed in for selects.
            //     outputMap: {
            //         <writeKey> : <pickFromKey>
            //         licensor: 'name',
            //     }
            // Above example will pick the value from key name and will put it in key licensor in the output.

            props.addNewModalOptions.fields.forEach(f => {
                f.sections.forEach(s => {
                    ddls = [...ddls, ...Object.entries(s.fields).filter(entry => entry[1].type === 'select')];

                    Object.entries(s.fields).forEach(entry => {
                        if (entry[1].type !== 'select') {
                            newEntry = {...newEntry, [entry[0]]: values[entry[0]]};
                        }
                    });
                });
            });

            ddls.forEach(d => {
                if (d[1].outputMap) {
                    const selectedItem = selectValues[props.addNewModalOptions.valuesPath].find(
                        x => x.id === values[d[0]]
                    );
                    Object.entries(d[1].outputMap).forEach(outMap => {
                        newEntry = {...newEntry, [outMap[0]]: selectedItem[outMap[1]]};
                    });
                } else {
                    newEntry = {...newEntry, [d[0]]: values[d[0]]};
                }
            });

            const updatedEntries = [...entries];
            updatedEntries.push(newEntry);
            setEntries(updatedEntries);
            onChange([...updatedEntries]);
            closeModal();
        }
    };

    const removeRowDataItem = index => {
        const updatedEntries = [...entries];
        updatedEntries.splice(index, 1);
        setEntries(updatedEntries);
        onChange([...updatedEntries]);
    };

    return (
        <div>
            {entries.map((entry, index) => {
                return (
                    <div key={index} className="nexus-c-row-data-item">
                        {firstColLbl && entry[firstColKey] && (
                            <div className="nexus-c-row-data-item-col__1">
                                <span>{firstColLbl}</span>
                                <span>{entry[firstColKey]}</span>
                            </div>
                        )}
                        {secondColLbl && entry[secondColKey] && (
                            <div className="nexus-c-row-data-item-col__2">
                                <span>{secondColLbl}</span>
                                <span>{entry[secondColKey]}</span>
                            </div>
                        )}
                        {canDelete ? (
                            <div className="nexus-c-remove-row_button" onClick={() => removeRowDataItem(index)}>
                                <EditorCloseIcon size="medium" label="" />
                            </div>
                        ) : undefined}
                    </div>
                );
            })}

            {canAdd && showCreateButton() && (
                <div>
                    <Button
                        className="p-button-outlined p-button-secondary"
                        label={props.addNewModalOptions.triggerBtnLabel}
                        onClick={openAddRowDataItemModal}
                    />
                </div>
            )}
        </div>
    );
};

RowDataItem.propTypes = {
    selectValues: PropTypes.object,
    firstColLbl: PropTypes.string,
    firstColKey: PropTypes.any,
    secondColLbl: PropTypes.string,
    secondColKey: PropTypes.any,
    data: PropTypes.array.isRequired,
    canAdd: PropTypes.bool,
    canDelete: PropTypes.bool,
    addNewModalOptions: PropTypes.any,
    onChange: PropTypes.func,
};

RowDataItem.defaultProps = {
    selectValues: {},
    firstColLbl: '',
    firstColKey: '',
    secondColLbl: '',
    secondColKey: '',
    canAdd: false,
    canDelete: false,
    addNewModalOptions: undefined,
    onChange: () => null,
};

export default RowDataItem;
