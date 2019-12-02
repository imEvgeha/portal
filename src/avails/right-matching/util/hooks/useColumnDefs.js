import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

// TODO: need to upgrade connected react routre, react-redux, react-router-dom
const useColumnDefs = (action, reducer) => {
    const dispatch = useDispatch();
    const columnDefs = useSelector(state => state[reducer] ? state[reducer]['columnDefs'] : []);

    useEffect(() => {
        if (!columnDefs.length) {
            action && dispatch(action());
        }
    }, [columnDefs]);
};

export default useColumnDefs;

