import React from 'react';
import {useNavigate, useLocation, useParams} from 'react-router-dom';

const withRouter = Component => {
    return props => {
        const location = useLocation();
        const params = useParams();
        const navigate = useNavigate();
        return <Component {...props} router={{location, params, history}} match={{params}} />;
    };
};

export default withRouter;
