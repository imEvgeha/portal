import {useCallback, useEffect, useRef} from 'react';
import {debounce} from 'lodash';

export function useDebounce(cb, delay) {
    const options = {
        leading: false,
        trailing: true,
    };
    const inputsRef = useRef(cb);
    const isMounted = useIsMounted();
    useEffect(() => {
        inputsRef.current = {cb, delay};
    });

    return useCallback(
        debounce(
            (...args) => {
                if (inputsRef.current.delay === delay && isMounted()) inputsRef.current.cb(...args);
            },
            delay,
            options
        ),
        [delay, debounce]
    );
}

function useIsMounted() {
    const isMountedRef = useRef(true);
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    return () => isMountedRef.current;
}
