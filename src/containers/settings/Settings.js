import React, {Component} from 'react';
import configApiSchema from '../../../profile/configApiSchema';
import {
    GroupHeader,
    ListElement,
    ListParent,
    SideMenu,
    TextHeader
} from '../../components/navigation/CustomNavigationElements';
import {EndpointContainer} from '../config/EndpointContainer';
import {TabContent, TabPane} from 'reactstrap';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedApi: configApiSchema['endpoints'][0]
        };
    }

    onApiNavClick = (selectedApi) => {
        this.setState({selectedApi: selectedApi});
    };

    render() {
        return (
            <div>
                <SideMenu primary>
                    <TextHeader>Settings</TextHeader>
                    <GroupHeader>Grouping Label</GroupHeader>
                    <ListParent>
                        <ListElement>API Configuration</ListElement>
                    </ListParent>
                </SideMenu>

                <SideMenu>
                    <TextHeader>APIs</TextHeader>
                    {/*<GroupHeader>Grouping Label</GroupHeader>*/}
                    <ListParent>
                        {configApiSchema['endpoints'].map((e, i) => (
                            <ListElement key={i} onClick={() => {
                                this.onApiNavClick(e);
                            }}>{e.layout['display-name']}</ListElement>
                        ))}
                    </ListParent>
                </SideMenu>

                <TabContent activeTab={this.state.selectedApi}>
                    {configApiSchema['endpoints'].map((e, i) => (
                        <TabPane key={i} tabId={e}>
                            <EndpointContainer urlBase={configApiSchema['url-base']}
                                               selectedApi={e}/>
                        </TabPane>
                    ))
                    }
                </TabContent>
            </div>
        );
    }
}