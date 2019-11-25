import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

//columns = store.getState().dashboard.session.columns
function TableColumnCustomizationModal({availsMapping, columns}) {

    const [hideShowColumns, setHideShowColumns] = useState();

    useEffect(()=> {
        if(availsMapping.mapping) {
            createConfigForColumnCustomization();
            updateConfigForSelectAll();
        }

    }, [availsMapping]);

    const createConfigForColumnCustomization = () => {
        let config = {};
        availsMapping.mapping.filter(({dataType}) => dataType).forEach(column => {
            if (column.javaVariableName === 'title') return '';
            let checked = columns.indexOf(column.javaVariableName) > -1;
            const data = {
                source: column,
                hideShowColumns: hideShowColumns,
                onChange: () => {
                    toggleColumn(column.javaVariableName);
                },
                saveRefresh: (refresh) =>{
                    hideShowColumns[column.javaVariableName].refresh = refresh;
                }
            };

            config[column.javaVariableName] = {
                data: data,
                checked: () => checked,
                refresh: () => {},
                checkbox: <SpecialCheckbox key={column.javaVariableName} data={data}/>
            };
        });

        setHideShowColumns(config);
    };

    const updateConfigForSelectAll = () => {
        const dataSelectAll= {
            source:{
                javaVariableName: 'selectAll',
                displayName:'Select All'
            },
            hideShowColumns: hideShowColumns,
            onChange: (e) => {
                toggleSelectAll(e);
            },
            saveRefresh: (refresh) =>{
                hideShowColumns[dataSelectAll.source.javaVariableName].refresh = refresh;
            }
        };

        const config = hideShowColumns[dataSelectAll.source.javaVariableName] = {
            data: dataSelectAll,
            checked: () => {
                let allSelected = true;
                let hideShowColumns = hideShowColumns;
                for (let key in hideShowColumns) {
                    if (key === dataSelectAll.source.javaVariableName) continue;
                    allSelected = allSelected && hideShowColumns[key].checked();
                }
                return allSelected;
            },
            refresh: () => {},
            checkbox: <SpecialCheckbox key={dataSelectAll.source.javaVariableName} data={dataSelectAll}/>
        };

        setHideShowColumns(config);
    };

    const toggleColumn = (id) => {
        const checkRec = hideShowColumns[id];
        const currentValue = checkRec.checked();
        checkRec.checked = () => !currentValue;
        hideShowColumns['selectAll'].refresh();
    };

    const toggleSelectAll = (e) => {
        let currentValue = e.target.checked;
        availsMapping.mappings.filter(({dataType}) => dataType).forEach(column => {
            if(column.javaVariableName === 'title') return '';
            hideShowColumns[column.javaVariableName].checked = () => currentValue;
            hideShowColumns[column.javaVariableName].refresh();
        });
    };

    const prepareModalView = () => {
        // const options = [this.hideShowColumns['selectAll'].checkbox];
        // for (let key in this.hideShowColumns) {
        //     if(key === 'selectAll') continue;
        //     options.push(this.hideShowColumns[key].checkbox);
        // }
        //
        // confirmModal.open('Select Visible Columns',
        //     this.saveColumns,
        //     this.cancelColumns,
        //     {confirmLabel: 'OK', description: options, scrollable:true}
        // );
    };

    return (<div>
        {prepareModalView()}
    </div>);
}

TableColumnCustomizationModal.propTypes = {
    availsMapping: PropTypes.object,
    columns: PropTypes.array
};

function SpecialCheckbox ({data}) {
    
    const onChange = () => {
    };

    const {source} = data;
    const id = source.javaVariableName;
    const dataRec = data.hideShowColumns[id];

    return (
        <div>
            <input type='checkbox' name={id} style={{marginRight: '8px'}} onChange={onChange} checked={dataRec.checked()} />{source.displayName}<br/>
        </div>
    );
}

SpecialCheckbox.propTypes = {
    data: PropTypes.object,
};