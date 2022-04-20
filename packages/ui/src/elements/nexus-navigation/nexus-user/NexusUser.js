import React, {useRef} from 'react';
import {Avatar} from 'primereact/avatar';
import {OverlayPanel} from 'primereact/overlaypanel';
import NexusUserAvatar from './nexus-user-avatar/NexusUserAvatar';

const NexusUser = () => {
    const op = useRef(null);

    return (
        <div className="NexusUser">
            <Avatar icon="pi pi-user" size="large" className="mr-2 nav-user" onClick={e => op.current.toggle(e)} />

            {/* On Avatar click, render a popup overlay to show contents */}
            <OverlayPanel className="UserAvatarOverlay" ref={op}>
                <NexusUserAvatar />
            </OverlayPanel>
        </div>
    );
};

export default NexusUser;
