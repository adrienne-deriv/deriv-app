import React from 'react';
import { observer } from 'mobx-react-lite';
import modals from './modals';
import PropTypes, { InferProps } from 'prop-types';
import { useStores } from 'Stores';
import BuySellModal from '../buy-sell/buy-sell-modal';

const modal_manager_context = React.createContext();
/**
 * const {showBuySellModal: showModal, hideBuySellModal: hideModal} = useModalManager(modal_keys.BuySellModal, {
 *  table_type: "buy",
 *  selected_ad: {...}
 * })
 *
 * ...
 * showBuySellModal(BuySellModal)
 *
 */

const ModalManager = () => {
    const { modal_store } = useStores();

    React.useEffect(() => {
        const onUnmount = modal_store.onMount();

        return onUnmount;
    }, []);

    if (modal_store.modal_id !== '') {
        const LazyModal = modals[modal_store.modal_id];

        return (
            <React.Suspense fallback={null}>
                <LazyModal {...modal_store.props} />
            </React.Suspense>
        );
    }
    return <></>;
};

export default observer(ModalManager);
