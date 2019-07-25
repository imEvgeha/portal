import React, {Component} from 'react';
import configApiSchema from '../../../profile/configApiSchema';
import {
    GroupHeader,
    ListElement,
    ListParent,
    SideMenu,
    TextHeader
} from '../../components/navigation/CustomNavigationElements';
import GridContainer from './GridContainer';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actualSchema: {}
        };
    }

    onApiNavClick = (newSchema) => {
        this.setState({actualSchema: newSchema});
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
                    <TextHeader>{'API\'s'}</TextHeader>
                    <GroupHeader>Grouping Label</GroupHeader>
                    <ListParent>
                        {configApiSchema['endpoints'].map((e, i) => (
                            <ListElement key={i} onClick={() => {
                                this.onApiNavClick(e.schema);
                            }}>{e.layout['display-name']}</ListElement>
                        ))}
                    </ListParent>
                </SideMenu>

                <GridContainer header={'Data container'} data={this.state.actualSchema.name}/>
            </div>
        );
    }
}