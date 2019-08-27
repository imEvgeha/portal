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
import './settings.scss';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            configApiSchema: null,
            selectedApi: null,
            active: 0
        };

        loadConfigAPIEndPoints().then((response) => {
            this.setState({configApiSchema: response.data, selectedApi: response.data['endpoints'] ? response.data['endpoints'][0] : null});
        });
    }

    onApiNavClick = (selectedApi, index) => {
        this.setState({selectedApi: selectedApi, active: index});
    };

    render() {
        return (
            <div>
                <SideMenu primary>
                    <TextHeader>Settings</TextHeader>
                    {/*<GroupHeader>Grouping Label</GroupHeader>*/}
                    <ListParent>
                        <ListElement className="list-item">API Configuration</ListElement>
                    </ListParent>
                </SideMenu>

                <SideMenu isScrollable className="custom-scrollbar">
                    <TextHeader>APIs</TextHeader>
                    {/*<GroupHeader>Grouping Label</GroupHeader>*/}
                    <ListParent>
                        {this.state.configApiSchema && this.state.configApiSchema['endpoints'].map((e, i) => (
                            <ListElement key={i} className={this.state.active === i ? 'list-item' : null} onClick={() => {
                                this.onApiNavClick(e, i);
                            }}>{e.displayName}</ListElement>
                        ))}
                    </ListParent>
                </SideMenu>

                <TabContent activeTab={this.state.selectedApi}>
                    {this.state.configApiSchema && this.state.configApiSchema['endpoints'].map((e, i) => (
                        <TabPane key={i} tabId={e}>
                            <EndpointContainer selectedApi={e}/>
                        </TabPane>
                    ))}
                </TabContent>
            </div>
        );
    }
}