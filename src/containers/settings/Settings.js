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
            localization: null

        };
    }

    componentDidMount() {
        // TODO: if store settings (configEndpoints) is set don't dispatch action
        this.props.fetchConfigApiEndpoints();
    }

    onApiNavClick = (selectedApi, index) => {
        this.setState({selectedApi: selectedApi, active: index});
    };

    handleActiveClick = (index) => {
        this.setState({mainMenuActive: index, localization: 'Localication'});
    }

    render() {
        const {configEndpoints} = this.props;
        const {selectedApi, active, mainMenuActive, localization} = this.state;

        return (
            <div>
                <SideMenu primary>
                    <TextHeader>Settings</TextHeader>
                    {/*<GroupHeader>Grouping Label</GroupHeader>*/}
                    <ListParent>
                        {['API Configuration', 'Localization'].map((e, i) => (
                            <ListElement 
                                key={i} 
                                onClick={() => this.handleActiveClick(i)}
                                className={mainMenuActive === i ? 'list-item' : null}>
                                {e}
                            </ListElement>
                        ))}
                    </ListParent>
                </SideMenu>

                <SideMenu isScrollable className="custom-scrollbar">
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
                </SideMenu>

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
                <TabContent activeTab={localization}>
                        <TabPane>
                            asdads
                        </TabPane>
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

export default connect(createMapStateToProps, mapDispatchToProps)(Settings); // eslint-disable-line
