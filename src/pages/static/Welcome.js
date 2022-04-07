import React from 'react';
import './Welcome.scss';
import {Outlet} from 'react-router-dom';

const Welcome = () => (
    <div className="nexus-c-welcome">
        <h1>Nexus Portal</h1>
        <Outlet />
    </div>
);

export default Welcome;
