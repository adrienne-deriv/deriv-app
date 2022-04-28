import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import { observer } from 'mobx-react-lite';
import { Autocomplete, Icon } from '@deriv/components';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import PropTypes from 'prop-types';

const BuyAdPaymentMethodsList = ({ selected_methods, setSelectedMethods }) => {
    const { my_ads_store, my_profile_store } = useStores();
    const [selected_edit_method, setSelectedEditMethod] = useState();
    const [payment_methods_list, setPaymentMethodsList] = useState(my_profile_store.payment_methods_list.filter(({ value }) => !selected_methods.includes(value)));

    useEffect(() => {
        console.log('useeffect')
        setPaymentMethodsList(my_profile_store.payment_methods_list.filter(({ value }) => !selected_methods.includes(value)));
    }, [selected_methods])

    const onClickDeletePaymentMethodItem = value => {
        if (value) {
            my_ads_store.payment_method_names = my_ads_store.payment_method_names.filter(
                payment_method_id => payment_method_id !== value
            );
            setSelectedMethods(selected_methods.filter(i => i !== value));
            setPaymentMethodsList([
                ...payment_methods_list,
                {
                    value,
                    text: my_profile_store.getPaymentMethodDisplayName(value),
                },
            ]);
        }
    };

    const onEditPaymentMethodItem = (value, index) => {
        if (value && !my_ads_store.payment_method_names.includes(value)) {
            const edited_methods = selected_methods.slice();
            edited_methods[index] = value;
            my_ads_store.payment_method_names[index] = value;
            setSelectedMethods(edited_methods);
            setPaymentMethodsList([...payment_methods_list.filter(payment_method => payment_method.value !== value), selected_edit_method]);
        }
    };

    const onClickPaymentMethodItem = value => {
        console.log('on click payment method item');
        if (value && !my_ads_store.payment_method_names.includes(value)) {
            if (my_ads_store.payment_method_names.length < 3) {
                my_ads_store.payment_method_names.push(value);
                setSelectedMethods([...selected_methods, value]);
                setPaymentMethodsList(
                    payment_methods_list.filter(payment_method => payment_method.value !== value)
                );
            }
        }
    };

    const checkValidPaymentMethod = (payment_method_text) => {
        let match = false;
        let id;
        my_profile_store.payment_methods_list.map(({ value, text }) => {
            if (text === payment_method_text) {
                match = true;
                id = value;
            }
        });
        return match ? id : false;
    }

    if (selected_methods?.length > 0) {
        return (
            <>
                {selected_methods.map((payment_method, key) => {
                    const method = my_profile_store.getPaymentMethodDisplayName(payment_method);
                    const payment_method_icon = method.replace(' ', '');

                    return (
                        <Formik key={key} enableReinitialize initialValues={{ payment_method: method }}>
                            {({ setFieldValue }) => (
                                <Field name='payment_method'>
                                    {({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            className='quick-add-modal--input'
                                            required
                                            autoComplete='off' // prevent chrome autocomplete
                                            data-lpignore='true'
                                            list_items={payment_methods_list}
                                            onItemSelection={({ value }) => onEditPaymentMethodItem(value, key)}
                                            onFocus={() => {
                                                setSelectedEditMethod({ value: payment_method, text: method });
                                                setFieldValue('payment_method', '');
                                            }}
                                            onBlur={e => {
                                                e.preventDefault();
                                                console.log('on blur')
                                                const value = checkValidPaymentMethod(e.target.value);
                                                if (e.target.value === '') {
                                                    setFieldValue('payment_method', method);
                                                } else if (!value) {
                                                    onClickDeletePaymentMethodItem(payment_method);
                                                } else {
                                                    onEditPaymentMethodItem(value, key);
                                                }
                                            }}
                                            leading_icon={
                                                <Icon
                                                    icon={
                                                        payment_method_icon === 'BankTransfer' ||
                                                        payment_method_icon === 'Other'
                                                            ? `IcCashier${payment_method_icon}`
                                                            : 'IcCashierEwallet'
                                                    }
                                                />
                                            }
                                            trailing_icon={
                                                <Icon
                                                    icon='IcDelete'
                                                    onClick={() => onClickDeletePaymentMethodItem(payment_method)}
                                                />
                                            }
                                            type='text'
                                        />
                                    )}
                                </Field>
                            )}
                        </Formik>
                    );
                })}
                {my_ads_store.payment_method_names.length < 3  && payment_methods_list.length > 0 && (
                    <Formik enableReinitialize initialValues={{ payment_method: '' }}>
                        {({ setFieldValue }) => (
                            <Field name='payment_method'>
                                {({ field }) => (
                                    <div className='p2p-my-ads--border'>
                                        <Autocomplete
                                            {...field}
                                            className='quick-add-modal--input'
                                            is_alignment_top
                                            autoComplete='off' // prevent chrome autocomplete
                                            data-lpignore='true'
                                            list_items={payment_methods_list}
                                            onItemSelection={({ value }) => onClickPaymentMethodItem(value)}
                                            onBlur={e => {
                                                e.preventDefault();
                                                setFieldValue('payment_method', '');
                                            }}
                                            required
                                            leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                            trailing_icon={<></>}
                                            placeholder={localize('Add')}
                                            type='text'
                                        />
                                    </div>
                                )}
                            </Field>
                        )}
                    </Formik>
                )}
            </>
        );
    }

    return (
        <Formik enableReinitialize initialValues={{ payment_method: '' }}>
            {({ setFieldValue }) => (
                <Field name='payment_method'>
                    {({ field }) => (
                        <div className='p2p-my-ads--border'>
                            <Autocomplete
                                {...field}
                                className='quick-add-modal--input'
                                is_alignment_top
                                autoComplete='off' // prevent chrome autocomplete
                                data-lpignore='true'
                                list_items={payment_methods_list}
                                onItemSelection={({ text, value }) => {
                                    setFieldValue('payment_method', value ? text : '');
                                    onClickPaymentMethodItem(value);
                                }}
                                required
                                leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                trailing_icon={<></>}
                                type='text'
                                placeholder={localize('Add')}
                            />
                        </div>
                    )}
                </Field>
            )}
        </Formik>
    );
}

BuyAdPaymentMethodsList.propTypes = {
    selected_methods: PropTypes.array,
    setSelectedMethods: PropTypes.func
}

export default observer(BuyAdPaymentMethodsList);