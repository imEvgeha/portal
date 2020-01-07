import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import {Checkbox} from '@atlaskit/checkbox';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import './TableColumnCustomization.scss';

const SELECT_ALL = 'selectAll';
const SELECT_ALL_DISPLAY_NAME = 'Select All';

export default function TableColumnCustomization({availsMapping, columns, updateColumnsOrder}) {

    const [hideShowColumns, setHideShowColumns] = useState();
    const {setModalContent, setModalActions, setModalTitle, setModalStyle, close} = useContext(NexusModalContext);

    useEffect(() => {
        if(hideShowColumns) {
            setModalActions([{
                text: 'Save',
                onClick: () => {
                    close();
                    saveColumns();
                }
            }, {
                text: 'Cancel',
                onClick: close
            }]);
            setModalContent(buildModalContent(hideShowColumns));
        }
    }, [hideShowColumns]);

    const createConfigForColumnCustomization = () => {
        let config = {};
        availsMapping.mappings.filter(({dataType}) => dataType).forEach(column => {
            if (column.javaVariableName === 'title') return '';
            let checked = columns.indexOf(column.javaVariableName) > -1;

            config[column.javaVariableName] = {
                id: column.id,
                label: column.displayName,
                checked: checked,
            };
        });

        config[SELECT_ALL] = {
            label: SELECT_ALL_DISPLAY_NAME,
            checked: isAllSelected(config),
        };

        setHideShowColumns(config);
    };

    const isAllSelected = (config) => {
        let allSelected = true;
        for (let key in config) {
            if (key === SELECT_ALL) continue;
            allSelected = allSelected && config[key].checked;
        }
        return allSelected;
    };

    const toggleColumn = (id) => {
        let newHideShowColumns = {...hideShowColumns};
        newHideShowColumns[id].checked = !newHideShowColumns[id].checked;
        newHideShowColumns[SELECT_ALL].checked = isAllSelected(newHideShowColumns);
        setHideShowColumns(newHideShowColumns);
    };

    const toggleSelectAll = (selectAllKey) => {
        let newHideShowColumns = {...hideShowColumns};
        let newValue = !newHideShowColumns[selectAllKey].checked;
        newHideShowColumns[selectAllKey].checked = newValue;

        availsMapping.mappings.filter(({dataType}) => dataType).forEach(column => {
            if (column.javaVariableName === 'title') return '';
            newHideShowColumns[column.javaVariableName].checked = newValue;
        });
        setHideShowColumns(newHideShowColumns);
    };

    const saveColumns = () => {
        let cols = columns.slice();
        //remove all hidden columns
        Object.keys(hideShowColumns).map(key => {
            if (hideShowColumns[key].checked === false) {
                let position = cols.indexOf(key);
                if (position > -1) {
                    cols.splice(position, 1);
                }
            }
        });
        //add new visible columns
        Object.keys(hideShowColumns).map(key => {
            if (hideShowColumns[key].checked === true) {
                let position = cols.indexOf(key);
                if (position === -1) {
                    cols.push(key);
                }
            }
        });

        updateColumnsOrder(cols);
    };

    const buildModalContent = (config) => {
        const options = [buildCheckBox(SELECT_ALL, toggleSelectAll)];
        for (let key in config) {
            if (key === SELECT_ALL) continue;
            options.push(buildCheckBox(key, toggleColumn));
        }

        return (<div> {options} </div>);
    };

    const buildCheckBox = (key, onChange) => {
        const data = hideShowColumns[key];
        return (<Checkbox
            key={key}
            id={data.id}
            name={data.id}
            label={data.label}
            onChange={() => onChange(key)}
            isChecked={data.checked}
        />);
    };

    const buildConfigAndOpenModal = () => {
        createConfigForColumnCustomization();

        setModalTitle('Select Visible Columns');
        setModalStyle({width: 'small'});
    };

    return (<div className='nexus-column-customization__icon-button' onClick={buildConfigAndOpenModal}><AppSwitcherIcon size='large'/></div>);
}

TableColumnCustomization.propTypes = {
    availsMapping: PropTypes.object,
    columns: PropTypes.array,
    updateColumnsOrder: PropTypes.func
};