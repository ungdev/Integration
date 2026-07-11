import { useSearchParams } from 'react-router-dom';

import Modal from '../ui/modal';

function UrgencyModal() {
    const [searchParams, setSearchParams] = useSearchParams();

    const isLogin = searchParams.get('login') === 'true';

    return (
        <Modal
            title="Formulaire VSS et Urgence"
            visible={isLogin}
            onCancel={() => setSearchParams({})}
            buttons={null}
        />
    );
}

export default UrgencyModal;
