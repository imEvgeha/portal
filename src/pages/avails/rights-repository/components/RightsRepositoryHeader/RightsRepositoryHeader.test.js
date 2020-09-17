import React from 'react';
import Button from '@atlaskit/button';
import {shallow} from 'enzyme';
import {RightsRepositoryHeader} from './RightsRepositoryHeader';

describe('RightsRepositoryHeader', () => {
    let wrapper = null;
    const historyPushMock = jest.fn();

    const props = {
        title: 'Rights',
        history: {
            push: historyPushMock,
        },
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
        expect(historyPushMock).toHaveBeenCalled();
    });

    it('renders create new right button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});
