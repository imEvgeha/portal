import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {TabContent, TabPane} from 'reactstrap';
import {
    // GroupHeader,
    ListElement,
    ListParent,
    SideMenu,
    TextHeader
} from '../../components/navigation/CustomNavigationElements';
import {EndpointContainer} from '../config/EndpointContainer';
import {fetchConfigApiEndpoints} from './settingsActions';
import * as selectors from './settingsSelectors';

class Settings extends Component {

    static propTypes = {
        fetchConfigApiEndpoints: PropTypes.func.isRequired,
        configEndpoints: PropTypes.array,
    };

    static defaultProps = {
        configEndpoints: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.configEndpoints && props.configEndpoints.length > 0 && !state.selectedApi) {
            return {
                ...state,
                selectedApi: props.configEndpoints[0],
            };
        }

        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedApi: null,
        };
    }

    componentDidMount() {
        // TODO: if store settings (configEndpoints) is set don't dispatch action
        this.props.fetchConfigApiEndpoints();
    }

    onApiNavClick = selectedApi => this.setState({selectedApi});

    render() {
        const {configEndpoints} = this.props;
        const {selectedApi} = this.state;

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
                        {configEndpoints && configEndpoints.map(endpoint => (
                            <ListElement 
                                key={endpoint.url} 
                                onClick={() => this.onApiNavClick(endpoint)}
                            >
                                {endpoint.displayName}
                            </ListElement>
                        ))}
                    </ListParent>
                </SideMenu>

                <TabContent activeTab={selectedApi}>
                    {configEndpoints && configEndpoints.map(endpoint => (
                        <TabPane 
                            key={endpoint.url} 
                            tabId={endpoint}
                        >
                            <EndpointContainer selectedApi={endpoint}/>
                        </TabPane>
                    ))}
                </TabContent>
            </div>
        );
    }
}

const createMapStateToProps = () => {
    const settingsConfigEndpointsSelector = selectors.createSettingsEndpointsSelector();
    return (state, props) => ({
        configEndpoints: settingsConfigEndpointsSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchConfigApiEndpoints: payload => dispatch(fetchConfigApiEndpoints(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(Settings);
