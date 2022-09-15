import React, {useState} from 'react';
import {Button} from '@portal/portal-components';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {reloadConfigurationService} from '@vubiquity-nexus/portal-utils/lib/services/availsService';
import {useDispatch} from 'react-redux';
import './ReloadConfigBtn.scss';

const ReloadConfigBtn = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const reloadConfig = async () => {
        setIsLoading(true);
        const res = await reloadConfigurationService();
        setIsLoading(false);
        const statusDesc = () => (
            <div>
                <p>
                    {' '}
                    Configuration Cache clear :{' '}
                    {res[0].status === 'fulfilled' ? (
                        <b className="status-success">SUCCESSFUL</b>
                    ) : (
                        <b className="status-failed">FAILED</b>
                    )}
                </p>
                <p>
                    {' '}
                    Event level Cache clear:{' '}
                    {res[1].status === 'fulfilled' ? (
                        <b className="status-success">SUCCESSFUL</b>
                    ) : (
                        <b className="status-failed">FAILED</b>
                    )}
                </p>
            </div>
        );

        res[0].status === 'fulfilled' && res[1].status === 'fulfilled'
            ? dispatch(
                  addToast({
                      detail: statusDesc(),
                      severity: 'success',
                  })
              )
            : dispatch(
                  addToast({
                      detail: statusDesc(),
                      severity: 'warn',
                  })
              );
    };

    return (
        <Button
            className="p-button-text"
            icon={`po po-reload ${isLoading ? 'po-spin' : ''}`}
            tooltip="Reload Configuration"
            onClick={reloadConfig}
        />
    );
};

export default ReloadConfigBtn;
