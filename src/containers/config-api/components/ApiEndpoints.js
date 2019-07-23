import React, {Component} from 'react';

import Page, {Grid, GridColumn} from '@atlaskit/page';
import Navigation, {
    AkContainerNavigationNested,
    AkNavigationItem,
    AkNavigationItemGroup,
    presetThemes,
} from '@atlaskit/navigation';
import configApiSchema from '../../../../profile/configApiShema';


export default class ConfluenceHome extends Component {
    state = {
        stack: [
            [
                <AkNavigationItemGroup title="GROUPING LABEL" key="config-api">
                    {configApiSchema['endpoints'].map((e, i) => {
                        return (
                            <AkNavigationItem
                                key={i}
                                text={e.layout['display-name']}
                            />
                        );
                    })}
                </AkNavigationItemGroup>,
            ],
        ]
    };

    render() {
        return (
            <Page
                navigation={
                    <Navigation
                        containerTheme={presetThemes.container}
                        containerHeaderComponent={() => (
                            <b>API's</b>
                        )}
                    >
                        <AkContainerNavigationNested stack={this.state.stack} />
                    </Navigation>
                }
            >
                <Grid layout="fluid">
                    <GridColumn>
                        <h1>Container</h1>
                        <div>{configApiSchema['url-base']}</div>
                    </GridColumn>
                </Grid>
            </Page>
        );
    }
}