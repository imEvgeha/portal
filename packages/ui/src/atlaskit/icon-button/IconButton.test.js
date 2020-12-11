import React from 'react';
import Button from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import {shallow} from 'enzyme';
import IconButton from './IconButton';

describe('IconButton', () => {
    let wrapper = null;
    it('should match snapshot', () => {
        wrapper = shallow(<IconButton icon={CrossIcon} onClick={() => null} label="Icon Button Label" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should execute the onClick function when button is clicked', () => {
        const onClick = jest.fn();
        wrapper = shallow(<IconButton icon={CrossIcon} onClick={onClick} label="Icon Button Label" />);

        wrapper.find(Button).simulate('click');
        expect(onClick).toHaveBeenCalled();
    });
});
