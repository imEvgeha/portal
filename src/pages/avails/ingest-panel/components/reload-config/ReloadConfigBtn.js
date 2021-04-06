import React, {useState} from 'react';
import PropTypes from 'prop-types';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import {
    SUCCESS_ICON,
    WARNING_ICON,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants'
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import { reloadConfigurationService } from '../../../availsService';
import './ReloadConfigBtn.scss';

const ReloadConfigBtn = ({addToast}) => {

    const [isLoading, setIsLoading] = useState(false);

    const reloadConfig = async () => {
        setIsLoading(true);
        const res = await reloadConfigurationService();
        setIsLoading(false);
        const statusDesc = () => (
        <div>
            <p> Configuration Cache clear : {res[0].status === 'fulfilled' ? <b className="status-success">SUCCESSFUL</b>: <b className="status-failed">FAILED</b>}</p>
            <p> Event level Cache clear: {res[1].status === 'fulfilled' ? <b className="status-success">SUCCESSFUL</b>: <b className="status-failed">FAILED</b>}</p>
        </div> );

        const icon = res[0].status === 'fulfilled' && res[1].status === 'fulfilled' ? SUCCESS_ICON : WARNING_ICON;

        addToast({
            title: 'Reload Configuration Status',
            description: statusDesc(),
            icon,
            isAutoDismiss: true,
            isWithOverlay: false,
        });
    }

    return (
        <div className={isLoading?"ingest-reload-btn rotate" :"ingest-reload-btn"}>
            <IconButton icon={RefreshIcon} onClick={reloadConfig} label="Reload Configuration" />
        </div>
    )
}

ReloadConfigBtn.propTypes = {
    addToast: PropTypes.func,
}

ReloadConfigBtn.defaultProps = {
    addToast: () => null,
}

export default withToasts(ReloadConfigBtn);
