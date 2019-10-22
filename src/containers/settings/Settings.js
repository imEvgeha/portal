import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {TabContent, TabPane} from 'reactstrap';
import './settings.scss';
import {
    // GroupHeader,
    ListElement,
    ListParent,
    SideMenu,
    TextHeader
} from '../../components/navigation/CustomNavigationElements';
import {EndpointContainer} from '../config/EndpointContainer';
import Localization from './Localization';
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
            active: 0,
            mainMenuActive: 0,
            showSettings: 'apiConfiguration'

        };
    }

    componentDidMount() {
        // TODO: if store settings (configEndpoints) is set don't dispatch action
        this.props.fetchConfigApiEndpoints();
    }

    onApiNavClick = (selectedApi, index) => {
        this.setState({selectedApi: selectedApi, active: index});
    };

    showSettings = (name) => {
        this.setState({
            showSettings: name
        });
    }

    render() {
        const {configEndpoints} = this.props;
        const {selectedApi, active, showSettings} = this.state;

        return (
            <div>
                <SideMenu primary>
                    <TextHeader>Settings</TextHeader>
                    {/*<GroupHeader>Grouping Label</GroupHeader>*/}
                    <ListParent>
                            <ListElement className={showSettings === 'apiConfiguration' ? 'list-item' : null} onClick={() => this.showSettings('apiConfiguration')}>
                                    API Configuration
                            </ListElement>
                            <ListElement className={showSettings === 'localization' ? 'list-item' : null} onClick={() => this.showSettings('localization')}>
                                    Localization
                            </ListElement>
                    </ListParent>
                </SideMenu>

                <SideMenu isScrollable className="custom-scrollbar">
                    {showSettings === 'apiConfiguration' ? 
                    <>
                        <TextHeader>APIs</TextHeader>
                        {/*<GroupHeader>Grouping Label</GroupHeader>*/}
                        <ListParent>
                            {configEndpoints && configEndpoints.map((endpoint, i) => (
                                <ListElement 
                                    className={active === i ? 'list-item' : null} 
                                    key={i} 
                                    onClick={() => this.onApiNavClick(endpoint, i)}
                                >
                                    {endpoint.displayName}
                                </ListElement>
                            ))}
                        </ListParent>
                    </>
                    : showSettings === 'localization' ? 
                    <>
                        <TextHeader>Localization</TextHeader>
                    {/*<GroupHeader>Grouping Label</GroupHeader>*/}
                    <ListParent>
                            <ListElement className='list-item'>
                                Set Localization
                            </ListElement>
                    </ListParent>
                    </> : null}
                </SideMenu>
                    {showSettings === 'apiConfiguration' ?                     
                        <TabContent activeTab={selectedApi}>
                            {configEndpoints && configEndpoints.map((endpoint, i) => (
                                <TabPane 
                                    key={i} 
                                    tabId={endpoint}
                                >
                                    <EndpointContainer selectedApi={endpoint}/>
                                </TabPane>
                            ))}                        
                        </TabContent>
                        : showSettings === 'localization' ? 
                        
                        <TabContent activeTab={'setLocalization'}>
                            <TabPane tabId={'setLocalization'}>
                                <Localization />
                            </TabPane>
                        </TabContent>
                        : null}
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

export default connect(createMapStateToProps, mapDispatchToProps)(Settings); // eslint-disable-line
