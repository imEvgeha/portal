import {useState, useEffect} from 'react';

const useRowCountWithGridApiFix = () => {
    const [count, setCount] = useState(0);
    const [api, setApi] = useState(undefined);

    useEffect(() => {
        // temp fix for aggrid not refreshing matching column when row count = 1
        if (count === 1) {
            setCount(1);
            api && api.refreshCells({force: true});
        }
    }, [count]);

    return {count, setCount, api, setApi};
};

export default useRowCountWithGridApiFix;
