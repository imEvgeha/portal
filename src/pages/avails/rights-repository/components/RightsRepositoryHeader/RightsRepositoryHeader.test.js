import React from 'react';
import {shallow} from 'enzyme';
import {Button} from 'primereact/button';
import {mockNavigate} from '../../../../../setupTestEnv';
import {RightsRepositoryHeader} from './RightsRepositoryHeader';

describe('RightsRepositoryHeader', () => {
    let wrapper = null;
    const props = {
        title: 'Rights',
    };

    beforeEach(() => {
        wrapper = shallow(<RightsRepositoryHeader {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render header title text', () => {
        const title = wrapper.find('.nexus-c-rights-repository-header__title-text');
        expect(title.text()).toEqual('Rights');
    });

    it('should redirect to right create page when button is clicked', () => {
        wrapper.find(Button).simulate('click');
        expect(mockNavigate).toHaveBeenCalledWith('rights/create');
    });

    it('renders create new right button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});
