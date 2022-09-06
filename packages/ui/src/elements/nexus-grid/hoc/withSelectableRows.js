import React, {useEffect, useState} from 'react';
import {defineCheckboxSelectionColumn} from '../elements/columnDefinitions';

const withSelectableRows = () => WrappedComponent => {
    const ComposedComponent = props => {
        const [tableColumnDefinitions, setTableColumnDefinitions] = useState([]);
        const {columnDefs} = props;

        useEffect(() => {
            if (!tableColumnDefinitions.length) {
                setTableColumnDefinitions(
                    columnDefs.length
                        ? [
                              defineCheckboxSelectionColumn({
                                  headerCheckboxSelection: true,
                                  headerCheckboxSelectionFilteredOnly: true,
                              }),
                              ...columnDefs,
                          ]
                        : columnDefs
                );
            }
        }, [columnDefs]);

        return <WrappedComponent {...props} columnDefs={tableColumnDefinitions} />;
    };

    ComposedComponent.propTypes = {
        ...WrappedComponent.propTypes,
    };

    ComposedComponent.defaultProps = {
        ...WrappedComponent.defaultProps,
    };

    return ComposedComponent;
};

export default withSelectableRows;
