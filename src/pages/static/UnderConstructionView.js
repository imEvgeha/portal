import React from 'react';
import {useParams} from 'react-router-dom';

const UnderConstructionView = ({}) => {
    const routeParams = useParams();

    return (
        <div className="nexus-c-under-construction-view">
            <div> UNDER CONSTRUCTION </div>
            {routeParams && routeParams.path}
        </div>
    );
};

export default UnderConstructionView;
