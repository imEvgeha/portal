import React from 'react';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import SecuritySvg from '@vubiquity-nexus/portal-assets/security-access.svg';
import './Unauthorized.scss';

const Unauthorized = () => {
    return (
        <div className="nexus-c-unauthorized">
            <Page>
                <Grid>
                    <GridColumn small={12}>
                        <div className="nexus-c-unauthorized__content">
                            <div className="nexus-c-unauthorized__svg-container">
                                <SecuritySvg width="100%" height="100%" className="nexus-c-unauthorized__svg" />
                            </div>
                            <h3 className="nexus-c-unauthorized__heading">Access Denied</h3>
                            <p className="nexus-c-unauthorized__message">
                                You do not have permission to access this page.
                            </p>
                        </div>
                    </GridColumn>
                </Grid>
            </Page>
        </div>
    );
};

export default Unauthorized;
