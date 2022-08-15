import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { isMobile } from '@deriv/shared';
import PropTypes from 'prop-types';

const CancelAddPaymentMethodModal = ({ onCancel = () => {}, onGoBack = () => {} }) => {
    const { my_profile_store } = useStores();

    return (
        <Modal
            has_close_icon={false}
            is_open={my_profile_store.is_cancel_add_payment_method_modal_open}
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
                        if (isMobile()) {
                            onCancel();
                        } else {
                            setTimeout(onCancel, 250);
                        }
                        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
                        my_profile_store.setShouldShowAddPaymentMethodForm(false);
                        my_profile_store.clearFormState();
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    large
                    onClick={() => {
                        onGoBack();
                        my_profile_store.setShouldShowAddPaymentMethodForm(true);
                        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
                    }}
                    primary
                >
                    <Localize i18n_default_text='Go back' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

CancelAddPaymentMethodModal.propTypes = {
    onCancel: PropTypes.func,
    onGoBack: PropTypes.func,
};

export default observer(CancelAddPaymentMethodModal);
