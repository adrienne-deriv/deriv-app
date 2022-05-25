import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileForm from './my-profile-form';
import MyProfileStats from './my-profile-stats';
import PaymentMethods from './payment-methods';

const MyProfileContent = () => {
    const { my_profile_store } = useStores();
    const formik_ref = React.useRef();

    if (my_profile_store.active_tab === my_profile_tabs.AD_TEMPLATE) {
        return <MyProfileForm />;
    } else if (my_profile_store.active_tab === my_profile_tabs.PAYMENT_METHODS) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <PaymentMethods />
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileFullPageModal
                        body_className='payment-methods-list__modal'
                        height_offset='80px'
                        is_modal_open={true}
                        page_header_text={localize('Payment methods')}
                        pageHeaderReturnFn={() => {
                            if (formik_ref.current.dirty) {
                                my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
                                my_profile_store.setIsCancelEditPaymentMethodModalOpen(true);
                            } else {
                                my_profile_store.setShouldShowAddPaymentMethodForm(false);
                                my_profile_store.setShouldShowEditPaymentMethodForm(false);
                            }
                        }}
                    >
                        <PaymentMethods formik_ref={formik_ref} />
                    </MobileFullPageModal>
                </MobileWrapper>
            </React.Fragment>
        );
    }
    return <MyProfileStats />;
};

export default observer(MyProfileContent);
