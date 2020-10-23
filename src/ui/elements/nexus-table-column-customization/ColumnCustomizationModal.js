import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';

const SELECT_ALL = 'selectAll';

const ColumnCustomizationModal = ({importHideShowColumns, config, availsMapping}) => {
    const [hideShowColumns, setHideShowColumns] = useState(config);

    const updateHideShowColumns = config => {
        importHideShowColumns(config);
        setHideShowColumns(config);
    };

    const isAllSelected = config => {
        let allSelected = true;
        for (const key in config) {
            if (key === SELECT_ALL) {
                continue;
            }
            allSelected = allSelected && config[key].checked;
        }
        return allSelected;
    };

    const toggleColumn = id => {
        const newHideShowColumns = {...hideShowColumns};
        newHideShowColumns[id].checked = !newHideShowColumns[id].checked;
        newHideShowColumns[SELECT_ALL].checked = isAllSelected(newHideShowColumns);
        updateHideShowColumns(newHideShowColumns);
    };

    const toggleSelectAll = selectAllKey => {
        const newHideShowColumns = {...hideShowColumns};
        const newValue = !newHideShowColumns[selectAllKey].checked;
        newHideShowColumns[selectAllKey].checked = newValue;

        availsMapping.mappings
            .filter(({dataType}) => dataType)
            .forEach(column => {
                if (column.javaVariableName === 'title') {
                    return '';
                }
                newHideShowColumns[column.javaVariableName].checked = newValue;
            });
        updateHideShowColumns(newHideShowColumns);
    };

    const buildModalContent = config => {
        const options = [buildCheckBox(SELECT_ALL, toggleSelectAll)];
        for (const key in config) {
            if (key === SELECT_ALL) {
                continue;
            }
            options.push(buildCheckBox(key, toggleColumn));
        }

        return <div> {options} </div>;
    };

    let buildCheckBox = (key, onChange) => {
        const data = hideShowColumns[key];
        return (
            <Checkbox
                key={key}
                id={data.id}
                name={data.id}
                label={data.label}
                onChange={() => onChange(key)}
                isChecked={data.checked}
            />
        );
    };

    return buildModalContent(config);
};

export default ColumnCustomizationModal;

ColumnCustomizationModal.propTypes = {
    config: PropTypes.object,
    importHideShowColumns: PropTypes.func,
    availsMapping: PropTypes.object,
};

ColumnCustomizationModal.defaultProps = {
    config: {},
    importHideShowColumns: null,
    availsMapping: {},
};
