import React, {Component} from 'react';
import configApiSchema from '../../../profile/configApiSchema';
import {
    GroupHeader,
    ListElement,
    ListParent,
    SideMenu,
    TextHeader
} from '../../components/navigation/CustomNavigationElements';
import {EndpointContainer} from '../config-api/EndpointContainer';
import EndpointTabs from "../config-api/EndpointTabs";
import EndpointTab from "../config-api/EndpointTab";

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
        console.log('Settings render')
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
                
                <EndpointTabs>
                    {configApiSchema['endpoints']}
                </EndpointTabs>
                {/*{configApiSchema['endpoints'].map((e, i) => (*/}
                    {/*<EndpointContainer tabId={i} key={i} data={e}/>*/}
                {/*))}*/}
            </div>
        );
    }
}