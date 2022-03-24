import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import {RepositorySelectsAndButtons} from './TitleMetadataRepoSelectsAndButtons';

describe('RepositorySelectsAndButtons', () => {
    let wrapper = null;
    let createBtn = null;
    const mockStore = configureStore();
    const store = mockStore({
        titleMetadata: {
            filter: {
                filterModel: {},
                sortModel: null,
                columnState: [],
            },
        },
    });

    beforeAll(() => {
        wrapper = shallow(
            <RepositorySelectsAndButtons
                getNameOfCurrentTab={() => 'repository'}
                store={store}
                currentUserView={undefined}
                setCurrentUserView={() => null}
            />
        );
        createBtn = wrapper.find('.nexus-c-title-metadata__create-btn');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render title metadata repository and buttons', () => {
        expect(wrapper.find('.nexus-c-title-metadata__select-container')).toHaveLength(1);
    });

    it('should render Create button', () => {
        expect(createBtn.length).toEqual(1);
    });
});
