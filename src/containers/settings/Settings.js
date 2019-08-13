import React, {Component} from 'react';
import {
    // GroupHeader,
    ListElement,
    ListParent,
    SideMenu,
    TextHeader
} from '../../components/navigation/CustomNavigationElements';
import {EndpointContainer} from '../config/EndpointContainer';
import {loadConfigAPIEndPoints} from '../config/service/ConfigService';
import {TabContent, TabPane} from 'reactstrap';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            configApiSchema: null,
            selectedApi: null
        };

        loadConfigAPIEndPoints().then((response) => {
            this.setState({configApiSchema: response.data, selectedApi: response.data['endpoints'] ? response.data['endpoints'][0] : null});
        });
    }

    onApiNavClick = (selectedApi) => {
        this.setState({selectedApi: selectedApi});
    };

    render() {
        return (
            <div>
                <SideMenu primary>
                    <TextHeader>Settings</TextHeader>
                    {/*<GroupHeader>Grouping Label</GroupHeader>*/}
                    <ListParent>
                        <ListElement>API Configuration</ListElement>
                    </ListParent>
                </SideMenu>

                <SideMenu>
                    <TextHeader>APIs</TextHeader>
                    {/*<GroupHeader>Grouping Label</GroupHeader>*/}
                    <ListParent>
                        {this.state.configApiSchema && this.state.configApiSchema['endpoints'].map((e, i) => (
                            <ListElement key={i} onClick={() => {
                                this.onApiNavClick(e);
                            }}>{e.displayName}</ListElement>
                        ))}
                    </ListParent>
                </SideMenu>

                <TabContent activeTab={this.state.selectedApi}>
                    {this.state.configApiSchema && this.state.configApiSchema['endpoints'].map((e, i) => (
                        <TabPane key={i} tabId={e}>
                            <EndpointContainer selectedApi={e}/>
                        </TabPane>
                    ))
                    }
                </TabContent>
            </div>
        );
    }
}