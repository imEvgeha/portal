import React from 'react';

const DEAFULT_TOOL_PANELS = [
    {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
        },
    },
    {
        id: 'filters',
        labelKey: 'filters',
        labelDefault: 'Filters',
        iconKey: 'menu',
        toolPanel: 'agFiltersToolPanel',
    },
];

const defaultSideBar = {toolPanels: DEAFULT_TOOL_PANELS};

const withSideBar = (sideBar = defaultSideBar) => WrappedComponent => {
    return props => {
        return <WrappedComponent {...props} sideBar={sideBar} />;
    };
};

export default withSideBar;
