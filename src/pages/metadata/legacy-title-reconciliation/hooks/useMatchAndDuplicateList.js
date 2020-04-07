import {useState} from 'react';
import TitleSystems from '../../../legacy/constants/metadata/systems';

export default function useMatchAndDuplicateList() {
    const [matchList, setMatchList] = useState({});
    const [duplicateList, setDuplicateList] = useState({});

    const handleMatchClick = (data, repo, checked) => {
        const {id} = data || {};
        if (checked) {
            const {NEXUS, VZ, MOVIDA} = TitleSystems;
            const newMatchList = {...matchList};
            if (duplicateList[id]){
                const list = {...duplicateList};
                delete list[id];
                setDuplicateList(list);
            }
            if (repo === NEXUS){
                delete newMatchList[VZ];
                delete newMatchList[MOVIDA];
            } else {
                delete newMatchList[NEXUS];
            }
            newMatchList[repo] = data;
            setMatchList(newMatchList);
        }
    };

    const handleDuplicateClick = (data, repo, checked) => {
        const {id} = data || {};
        if (checked) {
            if (matchList[repo] && matchList[repo].id === id) {
                const list = {...matchList};
                delete list[repo];
                setMatchList(list);
            }

            setDuplicateList({
                ...duplicateList,
                [id]: data
            });
            return;
        }

        const list = {...duplicateList};
        delete list[id];
        setDuplicateList(list);
    };

    return {
        matchList,
        handleMatchClick,
        duplicateList,
        handleDuplicateClick,
    };
}
