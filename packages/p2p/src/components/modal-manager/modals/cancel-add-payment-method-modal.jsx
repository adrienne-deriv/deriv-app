import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';

const CancelAddPaymentMethodModal = () => {
    const { my_profile_store, my_ads_store, modal_store } = useStores();

    React.useEffect(() => {
        return () => {
            my_profile_store.setSelectedPaymentMethod('');
            my_profile_store.setSelectedPaymentMethodDisplayName('');
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
                        modal_store.hideModal('CancelAddPaymentMethodModal');
                        my_profile_store.hideAddPaymentMethodForm();
                        my_profile_store.setIsCancelEditPaymentMethodModalOpen(false);
                        my_ads_store.setShouldShowAddPaymentMethodModal(false);
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    large
                    onClick={() => {
                        modal_store.hideModal('CancelAddPaymentMethodModal');
                        // my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
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
