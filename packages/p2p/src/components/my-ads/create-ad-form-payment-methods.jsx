import * as React from 'react';
import { Formik, Field } from 'formik';
import { observer } from 'mobx-react-lite';
import { Autocomplete, Icon } from '@deriv/components';
import { useStores } from 'Stores';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card';
import { localize } from 'Components/i18next';

const CreateAdFormPaymentMethods = ({ is_sell_advert, onSelectPaymentMethods }) => {
    const { my_ads_store, my_profile_store } = useStores();

    const [selected_buy_methods, setSelectedBuyMethods] = React.useState([]);
    const [selected_sell_methods, setSelectedSellMethods] = React.useState([]);
    const [payment_methods_list, setPaymentMethodsList] = React.useState(my_profile_store.payment_methods_list);
    const [selected_edit_method, setSelectedEditMethod] = React.useState();

    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    const onClickDeletePaymentMethodItem = value => {
        if (value) {
            my_ads_store.payment_method_names = my_ads_store.payment_method_names.filter(
                payment_method_id => payment_method_id !== value
            );
            setSelectedBuyMethods(selected_buy_methods.filter(i => i !== value));
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
        if (value) {
            if (!my_ads_store.payment_method_names.includes(value)) {
                const edited_buy_methods = selected_buy_methods.slice();
                edited_buy_methods[index] = value;
                my_ads_store.payment_method_names[index] = value;
                setSelectedBuyMethods(edited_buy_methods);
                setPaymentMethodsList([...payment_methods_list.filter(pm => pm.value !== value), selected_edit_method]);
            }
        }
    };

    const onClickPaymentMethodItem = (name, value) => {
        if (value) {
            if (!my_ads_store.payment_method_names.includes(value)) {
                if (my_ads_store.payment_method_names.length < 3) {
                    my_ads_store.payment_method_names.push(value);
                    setSelectedBuyMethods([...selected_buy_methods, value]);
                    setPaymentMethodsList(
                        payment_methods_list.filter(payment_method => payment_method.value !== value)
                    );
                }
            }
        }
    };

    const onClickPaymentMethodCard = payment_method => {
        if (!my_ads_store.payment_method_ids.includes(payment_method.ID)) {
            if (my_ads_store.payment_method_ids.length < 3) {
                my_ads_store.payment_method_ids.push(payment_method.ID);
                setSelectedSellMethods([...selected_sell_methods, payment_method.ID]);
            }
        } else {
            my_ads_store.payment_method_ids = my_ads_store.payment_method_ids.filter(
                payment_method_id => payment_method_id !== payment_method.ID
            );
            setSelectedSellMethods(selected_sell_methods.filter(i => i !== payment_method.ID));
        }
    };

    React.useEffect(() => {
        return () => {
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_sell_advert) {
            onSelectPaymentMethods(selected_sell_methods);
        } else {
            onSelectPaymentMethods(selected_buy_methods);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_buy_methods, selected_sell_methods]);

    if (is_sell_advert) {
        if (my_profile_store.advertiser_has_payment_methods) {
            return (
                <>
                    {my_profile_store.advertiser_payment_methods_list.map((payment_method, key) => (
                        <PaymentMethodCard
                            is_vertical_ellipsis_visible={false}
                            key={key}
                            medium
                            onClick={() => onClickPaymentMethodCard(payment_method)}
                            payment_method={payment_method}
                            style={selected_sell_methods.includes(payment_method.ID) ? style : {}}
                        />
                    ))}
                    <PaymentMethodCard
                        is_add={true}
                        label={localize('Payment method')}
                        medium
                        onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethodModal(true)}
                    />
                </>
            );
        }

        return (
            <PaymentMethodCard
                is_add={true}
                label={localize('Payment method')}
                medium
                onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethodModal(true)}
            />
        );
    }

    if (selected_buy_methods?.length > 0) {
        return (
            <React.Fragment>
                {selected_buy_methods.map((payment_method, key) => {
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
                                            onItemSelection={({ value }) => {
                                                onEditPaymentMethodItem(value, key);
                                            }}
                                            onFocus={() => {
                                                setSelectedEditMethod({ value: payment_method, text: method });
                                                setFieldValue('payment_method', '');
                                            }}
                                            onBlur={e => {
                                                e.preventDefault();
                                                let match = false;
                                                let id;
                                                my_profile_store.payment_methods_list.map(({ value, text }) => {
                                                    if (e.target.value === text) {
                                                        match = true;
                                                        id = value;
                                                    }
                                                });
                                                if (e.target.value === '') {
                                                    setFieldValue('payment_method', method);
                                                } else if (!match) {
                                                    onClickDeletePaymentMethodItem(payment_method);
                                                } else {
                                                    onEditPaymentMethodItem(id, key);
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
                {my_ads_store.payment_method_names.length < 3 && (
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
                                                onClickPaymentMethodItem(text, value);
                                            }}
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
            </React.Fragment>
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
                                // label={
                                //     <React.Fragment>
                                //         <Icon icon='IcAddOutline' size={14} />
                                //         <Text color='less-prominent' size='xs'>
                                //             <Localize i18n_default_text='Add' />
                                //         </Text>
                                //     </React.Fragment>
                                // }
                                list_items={payment_methods_list}
                                onItemSelection={({ text, value }) => {
                                    setFieldValue('payment_method', value ? text : '');
                                    onClickPaymentMethodItem(text, value);
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
};

export default observer(CreateAdFormPaymentMethods);
