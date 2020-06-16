import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';


const BulkMatching = ({children}) => {
    return (
        <div className="nexus-c-bulk-matching">
            <h5>Title Matching</h5>
            <div className="nexus-c-bulk-matching__header">
                <div>Selected Rights (6)</div>
                <div>Affected Rights (22)</div>
                <Button onClick={() => {}}>New Title</Button>
            </div>
            {children}
        </div>
    );
};

export default BulkMatching;
