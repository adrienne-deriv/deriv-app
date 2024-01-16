import React from 'react';
import { TPaymentMethodFormConfig } from 'types';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { FullPageMobileWrapper } from '../../../../../components';
import { useDevice } from '../../../../../hooks';

type TPaymentMethodFormFooter = {
    isValid: boolean;
    onGoBack?: () => void;
    paymentMethod: TPaymentMethodFormConfig['paymentMethod'];
    type: TPaymentMethodFormConfig['type'];
};

const PaymentMethodFormFooter = ({ isValid, onGoBack, paymentMethod, type }: TPaymentMethodFormFooter) => {
    const { isMobile } = useDevice();

    const footerButtons = !paymentMethod ? null : (
        <div className='p2p-v2-payment-method-form__buttons'>
            {/* TODO: Remember to wire up the modal */}
            <Button onClick={onGoBack} size='lg' variant='outlined'>
                Cancel
            </Button>
            {/* TODO: Remember to translate these */}
            <Button disabled={!isValid} size='lg'>
                {type === 'ADD' ? 'Add' : 'Save changes'}
            </Button>
        </div>
    );

    if (isMobile) {
        return <FullPageMobileWrapper renderFooter={() => footerButtons} />;
    }

    return footerButtons;
};

export default PaymentMethodFormFooter;
