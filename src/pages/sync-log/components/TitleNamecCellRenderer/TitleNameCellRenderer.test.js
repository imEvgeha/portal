import React from 'react';
import {shallow} from 'enzyme';
import {MemoryRouter} from 'react-router-dom';
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
        expect(wrapper.find('Link').props().to).toEqual('/metadata/detail/coreTitleId');
    });

    it('should render a react-router link that contains the right title text', () => {
        wrapper = shallow(
            <MemoryRouter>
                <TitleNameCellRenderer value="TitleName" data={{coreTitleId: 'coreTitleId'}} />
            </MemoryRouter>
        );
        expect(wrapper.html()).toContain('TitleName');
    });
});
