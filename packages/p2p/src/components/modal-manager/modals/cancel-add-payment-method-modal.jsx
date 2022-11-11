import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { reaction } from 'mobx';

const CancelAddPaymentMethodModal = () => {
    const { my_profile_store, modal_store, my_ads_store } = useStores();

    // TODO: Refactor this code to avoid manual DOM updates
    // mounts the modal in a seperate modal-root container to show/float the modal over another modal if is_floating is true
    React.useEffect(() => {
        return () => {
            // my_profile_store.setSelectedPaymentMethod('');
            // my_profile_store.setSelectedPaymentMethodDisplayName('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            has_close_icon={false}
            is_open={modal_store.is_modal_open}
            small
            title={
                <Text color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Cancel adding this payment method?' />
                </Text>
            }
        >
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='If you choose to cancel, the details you’ve entered will be lost.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    large
                    onClick={() => {
                        // my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
                        my_profile_store.hideAddPaymentMethodForm();
                        my_profile_store.setIsCancelEditPaymentMethodModalOpen(false);
                        modal_store.hideModalAndClearHistory();
                        my_ads_store.setShouldShowAddPaymentMethodModal(false);
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    large
                    onClick={() => {
                        // my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
                        modal_store.hideModal();
                    }}
                    primary
                >
                    <Localize i18n_default_text='Go back' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(CancelAddPaymentMethodModal);
