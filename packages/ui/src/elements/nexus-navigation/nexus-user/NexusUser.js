import React, {useRef} from 'react';
import {Avatar} from 'primereact/avatar';
import NexusUserAvatar from './nexus-user-avatar/NexusUserAvatar';

const NexusUser = () => {
    const op = useRef(null);

    return (
        <div className="NexusUser">
            <Avatar
                icon="pi pi-user"
                size="large"
                className="mr-2 nav-user"
                shape="circle"
                onClick={e => op.current.toggle(e)}
            />

            {/* On Avatar click, render a menu overlay to show contents */}
            <NexusUserAvatar menu={op} />
        </div>
    );
};

export default NexusUser;
