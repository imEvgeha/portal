import React from 'react';
import {shallow} from 'enzyme';
import AvailsTableReleaseReport from './AvailsTableReleaseReport';

describe('AvailsTableReleaseReport', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<AvailsTableReleaseReport />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
