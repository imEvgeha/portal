import React from 'react';
import {Outlet} from 'react-router-dom';
import './Welcome.scss';

const Welcome = () => (
    <div className="nexus-c-welcome">
        <h1>Nexus Portal</h1>
        <Outlet />
    </div>
);

export default Welcome;
