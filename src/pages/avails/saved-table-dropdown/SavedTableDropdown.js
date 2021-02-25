import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@atlaskit/icon/glyph/add';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import {components, CreatableSelect} from '@atlaskit/select';
import {isEmpty, get} from 'lodash';
import {connect} from 'react-redux';
import {insertNewGridModel} from '../../dop-tasks/utils';
import {setUserDefinedGrid} from '../rights-repository/rightsActions';
import {createUserGridSelector} from '../rights-repository/rightsSelectors';
import {GROUPED_OPTIONS, SAVED_TABLE_DROPDOWN_LABEL, SAVED_TABLE_SELECT_OPTIONS} from './constants';
import './SavedTableDropdown.scss';

const SavedTableDropdown = ({gridApi, columnApi, username, setUserDefinedGridState, gridState}) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [groupedOptions, setGroupedOptions] = useState(GROUPED_OPTIONS);

    useEffect(() => {
        const userList = get(gridState, username, []).map(o => ({label: o.id, value: o.id}));
        setGroupedOptions([groupedOptions[0], {...groupedOptions[1], options: userList}]);
    }, [gridState]);

    const applyPredefinedTableView = filter => {
        gridApi.setFilterModel(null);
        const filterInstance = gridApi.getFilterInstance('status');
        switch (filter) {
            case 'in-error':
                filterInstance.setModel({
                    filterType: 'set',
                    values: ['Error'],
                });
                break;
            case 'ready-or-pending':
                filterInstance.setModel({
                    filterType: 'set',
                    values: ['Pending', 'ReadyNew', 'Ready'],
                });
                break;
            default:
                break;
        }
        gridApi.onFilterChanged();
        gridApi.setSortModel([{colId: 'updatedAt', sort: 'desc'}]);
        columnApi.resetColumnState();
    };

    const handleChange = item => {
        setSelectedItem(item);
        if (SAVED_TABLE_SELECT_OPTIONS.map(o => o.value).includes(item.value)) {
            applyPredefinedTableView(item.value);
        } else if (!isEmpty(gridApi) && !isEmpty(columnApi) && item.value) {
            const selectedModel = get(gridState, username, []).filter(i => i.id === item.value);
            const {columnState, filterModel, sortModel} = selectedModel[0] || {};
            gridApi.setFilterModel(filterModel);
            gridApi.setSortModel(sortModel);
            columnApi.setColumnState(columnState);
        }
    };

    const filterRemovalHandler = (e, item) => {
        e.stopPropagation();
        if (selectedItem.value === item) {
            setSelectedItem(SAVED_TABLE_SELECT_OPTIONS[0]);
            applyPredefinedTableView(gridApi, SAVED_TABLE_SELECT_OPTIONS[0].value);
        }
        const filtered = get(gridState, username, []).filter(o => o.id !== item);
        setUserDefinedGridState({[username]: filtered});
    };

    const onCreateOption = value => {
        setSelectedItem({label: value, value});
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && value) {
            const filterModel = gridApi.getFilterModel();
            const sortModel = gridApi.getSortModel();
            const columnState = columnApi.getColumnState();
            const model = {id: value, filterModel, sortModel, columnState};
            const newUserData = insertNewGridModel(value, get(gridState, username, []), model);
            setUserDefinedGridState({[username]: newUserData});
        }
    };

    const Option = props => {
        // eslint-disable-next-line react/prop-types
        const {value, children, data} = props;
        const isUserDefined = get(gridState, username, [])
            .map(o => o.id)
            .includes(value);
        // eslint-disable-next-line react/prop-types
        if (data.__isNew__) {
            return (
                <components.Option {...props}>
                    <div className="nexus-c-saved-table-dropdown__option-item item-create">
                        <AddIcon />
                        <span className="nexus-c-saved-table-dropdown__option-item--label">Create</span>
                        <span>{`"${value}"`}</span>
                    </div>
                </components.Option>
            );
        }
        return (
            <components.Option {...props}>
                <div className="nexus-c-saved-table-dropdown__option-item">
                    {children}
                    {isUserDefined && (
                        <div className="nexus-cross-icon" onClick={e => filterRemovalHandler(e, value)}>
                            <CrossIcon size="small" />
                        </div>
                    )}
                </div>
            </components.Option>
        );
    };

    return (
        <div className="nexus-c-saved-table-dropdown">
            <div className="nexus-c-saved-table-dropdown__label">{SAVED_TABLE_DROPDOWN_LABEL}</div>
            <CreatableSelect
                className="nexus-c-saved-table-dropdown__select"
                classNamePrefix="nexus-select"
                options={groupedOptions}
                onChange={handleChange}
                components={{Option}}
                onCreateOption={onCreateOption}
                value={selectedItem}
                placeholder="Search Saved Views"
            />
        </div>
    );
};

SavedTableDropdown.propTypes = {
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
    username: PropTypes.string,
    gridState: PropTypes.object,
    setUserDefinedGridState: PropTypes.func.isRequired,
};

SavedTableDropdown.defaultProps = {
    gridApi: {},
    columnApi: {},
    gridState: {},
    username: '',
};

const mapStateToProps = () => {
    const gridSelector = createUserGridSelector();
    return state => ({
        gridState: gridSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    setUserDefinedGridState: payload => dispatch(setUserDefinedGrid(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedTableDropdown);
