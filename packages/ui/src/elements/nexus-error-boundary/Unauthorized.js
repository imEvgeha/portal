import React from 'react';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import SecuritySvg from '@portal/portal-icons/placeholders/security-access-placeholder.svg';
import './Unauthorized.scss';

const Unauthorized = () => {
    return (
        <div className="nexus-c-unauthorized">
            <Page>
                <Grid>
                    <GridColumn small={12}>
                        <div className="nexus-c-unauthorized__content">
                            <div className="nexus-c-unauthorized__svg-container">
                                <img src={SecuritySvg} alt="Unauthorized" />
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
