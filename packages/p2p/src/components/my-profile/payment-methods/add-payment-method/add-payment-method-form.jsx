import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Field, Form, Formik } from 'formik';
import {
    Button,
    DesktopWrapper,
    Icon,
    Input,
    Loading,
    MobileFullPageModal,
    MobileWrapper,
    Modal,
    Text,
} from '@deriv/components';
import { usePaymentMethodValidator } from 'Components/hooks';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const AddPaymentMethodFormFooter = () => {
    // const { my_ads_store, my_profile_store } = useStores();
    // const dirty = false;
    // const errors = [];
    // const isSubmitting = false;
    const submitForm = () => {};

    return (
        <React.Fragment>
            <Button secondary large onClick={() => {}} type='button'>
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button
                className='add-payment-method-form__buttons--add'
                primary
                large
                is_disabled={false}
                onClick={submitForm}
            >
                <Localize i18n_default_text='Add' />
            </Button>
        </React.Fragment>
    );
};

const AddPaymentMethodForm = ({ formik_ref, should_show_separated_footer = false }) => {
    const { my_ads_store, my_profile_store } = useStores();
    const validateFields = usePaymentMethodValidator();

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getSelectedPaymentMethodDetails();
        my_profile_store.setAddPaymentMethodErrorMessage('');
        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);

        return () => {
            my_profile_store.setSelectedPaymentMethod('');
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.selected_payment_method_display_name && !my_profile_store.selected_payment_method_fields) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Formik
                    enableReinitialize
                    innerRef={formik_ref}
                    initialValues={{}}
                    onSubmit={my_profile_store.createPaymentMethod}
                    validate={validateFields}
                >
                    {({ dirty, handleChange, isSubmitting, errors }) => {
                        return (
                            <Form className='add-payment-method-form__form' noValidate>
                                <div className='add-payment-method-form__form-wrapper'>
                                    <Field name='choose_payment_method'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                disabled
                                                type='field'
                                                field_className='add-payment-method-form__field'
                                                label={
                                                    <Text color='prominent' size='xs'>
                                                        <Localize i18n_default_text='Choose your payment method' />
                                                    </Text>
                                                }
                                                value={my_profile_store.selected_payment_method_display_name}
                                                required
                                                trailing_icon={
                                                    <Icon
                                                        className='add-payment-method-form__cross-icon'
                                                        color='secondary'
                                                        icon='IcCloseCircle'
                                                        onClick={() => my_profile_store.setSelectedPaymentMethod('')}
                                                    />
                                                }
                                            />
                                        )}
                                    </Field>
                                    {my_profile_store.selected_payment_method_fields &&
                                        my_profile_store.selected_payment_method_fields.map(
                                            (payment_method_field, key) => {
                                                return (
                                                    <Field
                                                        name={payment_method_field[0]}
                                                        id={payment_method_field[0]}
                                                        key={key}
                                                    >
                                                        {({ field }) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                error={errors[payment_method_field[0]]}
                                                                type={
                                                                    payment_method_field[0] === 'instructions'
                                                                        ? 'textarea'
                                                                        : payment_method_field[1].type
                                                                }
                                                                label={payment_method_field[1].display_name}
                                                                className={classNames({
                                                                    'add-payment-method-form__payment-method-field':
                                                                        !errors[payment_method_field[0]]?.length,
                                                                })}
                                                                onChange={handleChange}
                                                                name={payment_method_field[0]}
                                                                required={!!payment_method_field[1].required}
                                                            />
                                                        )}
                                                    </Field>
                                                );
                                            }
                                        )}
                                </div>
                                <div
                                    className={classNames('add-payment-method-form__buttons', {
                                        'add-payment-method-form__buttons--separated-footer':
                                            should_show_separated_footer,
                                    })}
                                >
                                    <Button
                                        secondary
                                        large
                                        onClick={() => {
                                            if (dirty || my_profile_store.selected_payment_method.length > 0) {
                                                my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
                                            } else {
                                                my_profile_store.hideAddPaymentMethodForm();
                                                my_ads_store.setShouldShowAddPaymentMethodModal(false);
                                            }
                                        }}
                                        type='button'
                                    >
                                        <Localize i18n_default_text='Cancel' />
                                    </Button>
                                    <Button
                                        className='add-payment-method-form__buttons--add'
                                        primary
                                        large
                                        is_disabled={isSubmitting || !dirty || !!Object.keys(errors)?.length}
                                    >
                                        <Localize i18n_default_text='Add' />
                                    </Button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='payment-methods-list__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open
                    page_header_className='buy-sell__modal-header'
                    page_header_text={localize('Add payment method')}
                    // pageHeaderReturnFn={onCancel}
                    renderPageFooterChildren={AddPaymentMethodFormFooter}
                >
                    <Formik
                        enableReinitialize
                        innerRef={formik_ref}
                        initialValues={{}}
                        onSubmit={my_profile_store.createPaymentMethod}
                        validate={validateFields}
                    >
                        {({ handleChange, errors }) => {
                            return (
                                <Form className='add-payment-method-form__form' noValidate>
                                    <div className='add-payment-method-form__form-wrapper'>
                                        <Field name='choose_payment_method'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    disabled
                                                    type='field'
                                                    field_className='add-payment-method-form__field'
                                                    label={
                                                        <Text color='prominent' size='xs'>
                                                            <Localize i18n_default_text='Choose your payment method' />
                                                        </Text>
                                                    }
                                                    value={my_profile_store.selected_payment_method_display_name}
                                                    required
                                                    trailing_icon={
                                                        <Icon
                                                            className='add-payment-method-form__cross-icon'
                                                            color='secondary'
                                                            icon='IcCloseCircle'
                                                            onClick={() =>
                                                                my_profile_store.setSelectedPaymentMethod('')
                                                            }
                                                        />
                                                    }
                                                />
                                            )}
                                        </Field>
                                        {my_profile_store.selected_payment_method_fields &&
                                            my_profile_store.selected_payment_method_fields.map(
                                                (payment_method_field, key) => {
                                                    return (
                                                        <Field
                                                            name={payment_method_field[0]}
                                                            id={payment_method_field[0]}
                                                            key={key}
                                                        >
                                                            {({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    data-lpignore='true'
                                                                    error={errors[payment_method_field[0]]}
                                                                    type={
                                                                        payment_method_field[0] === 'instructions'
                                                                            ? 'textarea'
                                                                            : payment_method_field[1].type
                                                                    }
                                                                    label={payment_method_field[1].display_name}
                                                                    className={classNames({
                                                                        'add-payment-method-form__payment-method-field':
                                                                            !errors[payment_method_field[0]]?.length,
                                                                    })}
                                                                    onChange={handleChange}
                                                                    name={payment_method_field[0]}
                                                                    required={!!payment_method_field[1].required}
                                                                />
                                                            )}
                                                        </Field>
                                                    );
                                                }
                                            )}
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </MobileFullPageModal>
            </MobileWrapper>
            <Modal
                is_open={my_profile_store.should_show_add_payment_method_error_modal}
                small
                has_close_icon={false}
                title={localize("Something's not right")}
            >
                <Modal.Body>
                    <Text color='prominent' size='xs'>
                        {my_profile_store.add_payment_method_error_message}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Ok')}
                        onClick={() => my_profile_store.setShouldShowAddPaymentMethodErrorModal(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

AddPaymentMethodForm.propTypes = {
    formik_ref: PropTypes.shape({ current: PropTypes.any }),
    should_show_separated_footer: PropTypes.bool,
};

export default observer(AddPaymentMethodForm);
