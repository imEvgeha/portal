import React from 'react';
import {shallow} from 'enzyme';
import TitleNameCellRenderer from './TitleNameCellRenderer';

describe('TitleNameCellRenderer', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<TitleNameCellRenderer value="TitleName" data={{coreTitleId: 'coreTitleId'}} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a react-router link that links to the right title page', () => {
        expect(wrapper.props().to).toEqual('detail/coreTitleId');
    });

    it('should render a react-router link that contains the right title text', () => {
        expect(wrapper.props().children).toContain('TitleName');
    });
});
