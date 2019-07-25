import React, {Component} from 'react';

import Page, {Grid, GridColumn} from '@atlaskit/page';
import Navigation, {
    AkContainerNavigationNested,
    AkNavigationItem,
    AkNavigationItemGroup,
    presetThemes,
} from '@atlaskit/navigation';
import configApiSchema from '../../../../profile/configApiSchema';


export default class ApiEndpoints extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stack: [[]],
            actualSchema: {}
        };
    }

    componentDidMount() {
        this.setState({
            stack: [
                [
                    <AkNavigationItemGroup key="config-api">
                        {configApiSchema['endpoints'].map((e, i) => {
                            return (
                                <AkNavigationItem
                                    key={i}
                                    text={e.layout['display-name']}
                                    onClick={() => {
                                        this.onApiNavClick(e.schema);
                                    }}
                                />
                            );
                        })}
                    </AkNavigationItemGroup>,
                ],
            ]
        });
    }

    onApiNavClick = (newSchema) => {
        this.setState({actualSchema: newSchema});
    };

    render() {
        return (
            <Page
                navigation={
                    <Navigation
                        containerTheme={presetThemes.container}
                        containerHeaderComponent={() => (
                            <b>{'API\'s'}</b>
                        )}
                    >
                        <AkContainerNavigationNested stack={this.state.stack}/>
                    </Navigation>
                }
            >
                <Grid layout="fluid">
                    <GridColumn>
                        <h1>Container</h1>
                        <div>{configApiSchema['url-base']}</div>
                        <div>{this.state.actualSchema.name}</div>
                    </GridColumn>
                </Grid>
            </Page>
        );
    }
}