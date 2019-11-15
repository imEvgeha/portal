import React from 'react';

const DEAFULT_TOOL_PANELS = ['columns', 'filters'];

const defaultSideBar = {toolPanels: DEAFULT_TOOL_PANELS};

const withSideBar = (WrappedComponent, sideBar = defaultSideBar) => {
    const ComposedComponent = props => {
        return (
            <WrappedComponent
                {...props}
                sideBar={sideBar}
            />
        );
    };

    return ComposedComponent;
};

export default withSideBar;

