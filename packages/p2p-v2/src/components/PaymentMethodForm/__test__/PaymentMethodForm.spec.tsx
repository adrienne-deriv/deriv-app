import React, { PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { APIProvider, p2p } from '@deriv/api';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodForm from '../PaymentMethodForm';

const wrapper = ({ children }: PropsWithChildren<unknown>) => (
    <APIProvider>
        <div id='v2_modal_root'>{children}</div>
    </APIProvider>
);

const mockPaymentMethods = [
    {
        display_name: 'Bank Transfer',
        fields: {
            account: {
                display_name: 'Account Number',
                required: 1,
                type: 'text',
                value: 'Account Number',
            },
            bank_name: {
                display_name: 'Bank Transfer',
                required: 1,
                type: 'text',
                value: 'Bank Name',
            },
        },
        id: 'bank',
        is_enabled: 0,
        method: 'bank_transfer',
        type: 'bank',
        used_by_adverts: null,
        used_by_orders: null,
    },
    {
        display_name: 'Other',
        fields: {
            account: {
                display_name: 'Account Number',
                required: 0,
                type: 'text',
                value: 'Account 1',
            },
        },
        id: 'other',
        is_enabled: 1,
        method: 'other',
        type: 'other',
        used_by_adverts: null,
        used_by_orders: null,
    },
] as const;

jest.mock('@deriv/api', () => {
    return {
        ...jest.requireActual('@deriv/api'),
        p2p: {
            advertiserPaymentMethods: {
                useCreate: jest.fn(() => ({
                    create: jest.fn(),
                })),
                useUpdate: jest.fn(() => ({
                    update: jest.fn(),
                })),
            },
            paymentMethods: {
                useGet: jest.fn(() => ({
                    data: mockPaymentMethods,
                })),
            },
        },
    };
});

const mockUseCreate = p2p.advertiserPaymentMethods.useCreate as jest.MockedFunction<
    typeof p2p.advertiserPaymentMethods.useCreate
>;

const mockUseUpdate = p2p.advertiserPaymentMethods.useUpdate as jest.MockedFunction<
    typeof p2p.advertiserPaymentMethods.useUpdate
>;

describe('PaymentMethodForm', () => {
    it('should render the component correctly when a selected payment method is not provided', () => {
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        expect(screen.getByText('Payment method')).toBeInTheDocument();
    });
    it('should render the component correctly when a selected payment method is provided', () => {
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: {
                        display_name: 'Other',
                        fields: {
                            account: {
                                display_name: 'Account 1',
                                required: 0,
                                type: 'text',
                                value: 'Account 1',
                            },
                        },
                        id: 'other',
                        is_enabled: 1,
                        method: 'other',
                        type: 'other',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        expect(screen.getByText('Account 1')).toBeInTheDocument();
    });
    it('should render the component correctly when a selected payment method is passed in with an undefined display name and an undefined value', () => {
        // This test covers the scenario where the display name and value "could be" undefined due to the types returned from the api-types package
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: {
                        fields: {
                            account: {},
                        },
                    },
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        expect(screen.getByText('Choose your payment method')).toBeInTheDocument();
    });
    it('should render the component when the available payment methods are undefined', () => {
        // This test covers the scenario where the available payment methods "could be" undefined because of the types returned from the api-types package
        (p2p.paymentMethods.useGet as jest.Mock).mockReturnValueOnce({
            data: undefined,
        });
        render(
            <PaymentMethodForm
                formState={{ actionType: 'ADD', title: 'title' }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        expect(screen.getByText('Don’t see your payment method?')).toBeInTheDocument();
    });
    it('should handle the onclick event when the back arrow is clicked and the form is not dirty', () => {
        const onResetFormState = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={onResetFormState}
            />,
            { wrapper }
        );
        const backArrow = screen.getByTestId('dt_p2p_v2_payment_methods_header_left_arrow_icon');
        userEvent.click(backArrow);
        expect(onResetFormState).toHaveBeenCalled();
    });
    it('should display the close icon when a payment method is selected', () => {
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    selectedPaymentMethod: {
                        display_name: 'Other',
                        fields: {
                            account: {
                                display_name: 'Account 1',
                                required: 0,
                                type: 'text',
                                value: 'Account 1',
                            },
                        },
                        id: 'other',
                        is_enabled: 1,
                        method: 'other',
                        type: 'other',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        expect(screen.getByTestId('dt_p2p_v2_payment_methods_form_close_icon')).toBeInTheDocument();
    });
    it('should handle the onclick event when the close icon is clicked', () => {
        const onAdd = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    selectedPaymentMethod: {
                        display_name: 'Other',
                        fields: {
                            account: {
                                display_name: 'Account 1',
                                required: 0,
                                type: 'text',
                                value: 'Account 1',
                            },
                        },
                        id: 'other',
                        is_enabled: 1,
                        method: 'other',
                        type: 'other',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                    title: 'title',
                }}
                onAdd={onAdd}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        const closeIcon = screen.getByTestId('dt_p2p_v2_payment_methods_form_close_icon');
        userEvent.click(closeIcon);
        expect(onAdd).toHaveBeenCalled();
    });
    it('should handle onselect when an item is selected in the dropdown', () => {
        const onAdd = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={onAdd}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        const dropdown = screen.getByText('Payment method');
        userEvent.click(dropdown);
        const dropdownItem = screen.getByText('Bank Transfer');
        userEvent.click(dropdownItem);
        expect(onAdd).toHaveBeenCalled();
    });
    it('should handle onclick when the add new button is clicked', () => {
        const onAdd = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={onAdd}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        const addNewButton = screen.getByText('Add new.');
        userEvent.click(addNewButton);
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        expect(onAdd).toHaveBeenCalledWith({
            displayName: otherPaymentMethod?.display_name,
            fields: otherPaymentMethod?.fields,
            method: otherPaymentMethod?.method,
        });
    });
    it('should reset the form when a payment method is successfully created', () => {
        (mockUseCreate as jest.Mock).mockReturnValue({
            create: jest.fn(),
            isSuccess: true,
        });
        const onResetFormState = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={onResetFormState}
            />,
            { wrapper }
        );
        expect(onResetFormState).toHaveBeenCalled();
    });
    it('should reset the form when a payment method is successfully updated', () => {
        (mockUseCreate as jest.Mock).mockReturnValue({
            create: jest.fn(),
        });
        (mockUseUpdate as jest.Mock).mockReturnValue({
            isSuccess: true,
            update: jest.fn(),
        });
        const onResetFormState = jest.fn();
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={onResetFormState}
            />,
            { wrapper }
        );
        expect(onResetFormState).toHaveBeenCalled();
    });
    it('should show the error modal when a payment method is not created successfully and close it when the ok button is clicked', () => {
        (mockUseCreate as jest.Mock).mockReturnValue({
            create: jest.fn(),
            error: {
                error: {
                    message: 'Error',
                },
            },
            isSuccess: false,
        });
        const onResetFormState = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={onResetFormState}
            />,
            { wrapper }
        );
        expect(screen.getByText('Error')).toBeInTheDocument();
        const okButton = screen.getByText('Ok');
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        expect(onResetFormState).toHaveBeenCalled();
    });
    it('should show the error modal when a payment method is not updated successfully and close it when the ok button is clicked', () => {
        (mockUseCreate as jest.Mock).mockReturnValue({
            create: jest.fn(),
        });
        (mockUseUpdate as jest.Mock).mockReturnValue({
            error: {
                error: {
                    message: 'Error',
                },
            },
            isSuccess: false,
            update: jest.fn(),
        });
        const onResetFormState = jest.fn();
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={onResetFormState}
            />,
            { wrapper }
        );
        expect(screen.getByText('Error')).toBeInTheDocument();
        const okButton = screen.getByText('Ok');
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        expect(onResetFormState).toHaveBeenCalled();
    });
    it('should handle submit when the form is submitted and the actiontype is add', async () => {
        const create = jest.fn();
        (mockUseCreate as jest.Mock).mockImplementation(() => {
            return {
                create,
            };
        });
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        const inputField = screen.getByDisplayValue('Account 1');
        expect(inputField).toBeInTheDocument();
        await waitFor(async () => {
            await userEvent.click(inputField);
            await userEvent.type(inputField, 'Account 2');
            await userEvent.tab();
            const submitButton = screen.getByText('Add');
            expect(submitButton).toBeInTheDocument();
            await userEvent.click(submitButton);
        });
        expect(create).toHaveBeenCalled();
    });
    it('should handle submit when the form is submitted and the actiontype is edit', async () => {
        const update = jest.fn();
        (mockUseUpdate as jest.Mock).mockImplementation(() => {
            return {
                update,
            };
        });
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        const inputField = screen.getByDisplayValue('Account 1');
        expect(inputField).toBeInTheDocument();
        await waitFor(async () => {
            await userEvent.click(inputField);
            await userEvent.type(inputField, 'Account 2');
            await userEvent.tab();
            const submitButton = screen.getByText('Save changes');
            expect(submitButton).toBeInTheDocument();
            await userEvent.click(submitButton);
        });
        expect(update).toHaveBeenCalled();
    });
    it('should handle onclick when the back arrow is clicked and the form is dirty, and close the opened modal when go back button is clicked', async () => {
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        const inputField = screen.getByDisplayValue('Account 1');
        expect(inputField).toBeInTheDocument();
        await waitFor(async () => {
            await userEvent.click(inputField);
            await userEvent.type(inputField, 'Account 2');
            await userEvent.tab();
        });
        const backArrow = screen.getByTestId('dt_p2p_v2_payment_methods_header_left_arrow_icon');
        expect(backArrow).toBeInTheDocument();
        userEvent.click(backArrow);
        expect(screen.getByText('Cancel adding this payment method?')).toBeInTheDocument();
        const dontCancelButton = screen.getByText('Go back');
        expect(dontCancelButton).toBeInTheDocument();
        userEvent.click(dontCancelButton);
        expect(screen.queryByText('Cancel adding this payment method?')).not.toBeInTheDocument();
    });
    it("should handle onclick when the back arrow is clicked and the form is dirty, and close the opened modal when don't cancel button is clicked", async () => {
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />,
            { wrapper }
        );
        const inputField = screen.getByDisplayValue('Account 1');
        expect(inputField).toBeInTheDocument();
        await waitFor(async () => {
            await userEvent.click(inputField);
            await userEvent.type(inputField, 'Account 2');
            await userEvent.tab();
        });
        const backArrow = screen.getByTestId('dt_p2p_v2_payment_methods_header_left_arrow_icon');
        expect(backArrow).toBeInTheDocument();
        userEvent.click(backArrow);
        expect(screen.getByText('Cancel your edits?')).toBeInTheDocument();
        const dontCancelButton = screen.getByText("Don't cancel");
        expect(dontCancelButton).toBeInTheDocument();
        userEvent.click(dontCancelButton);
        expect(screen.queryByText('Cancel your edits?')).not.toBeInTheDocument();
    });
});
