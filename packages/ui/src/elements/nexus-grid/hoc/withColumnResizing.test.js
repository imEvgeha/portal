import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import withColumnsResizing from './withColumnsResizing';

describe('withColumnsResizing', () => {
    let wrapper = null;
    let WithLoadingComponent = null;

    beforeEach(() => {
        const Component = <h1>Test</h1>;
        const props = {
            id: 'rightsRepo',
            columnDefs: [
                {
                    field: 'title',
                    headerName: 'Title',
                    colId: 'title',
                    width: 150,
                },
                {
                    field: 'releaseYear',
                    headerName: 'Release Year',
                    colId: 'releaseYear',
                    valueFormatter: null,
                    width: 150,
                },
                {
                    field: 'licensor',
                    headerName: 'Licensor',
                    colId: 'licensor',
                    width: 150,
                },
            ],
            updateGridColumnsSize: () => null,
        };
        WithLoadingComponent = withColumnsResizing()(Component);

        const mockStore = configureStore();
        const store = mockStore({
            root: {
                columnsSize: {
                    rightsRepo: {
                        title: 368,
                        licensor: 225,
                    },
                },
            },
        });
        wrapper = shallow(<WithLoadingComponent store={store} {...props} />);
    });

    it('should render the component', () => {
        expect(wrapper).not.toBe(null);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
