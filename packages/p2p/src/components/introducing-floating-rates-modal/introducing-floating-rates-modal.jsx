import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { getUrlBase } from '@deriv/shared';
import { useStores } from 'Stores';
import './introducing-floating-rate-modal.scss';

const IntroducingFloatingRatesModal = () => {
    const { floating_rate_store } = useStores();
    const should_not_show_modal_again = React.useRef(false);
    const [is_open, setIsOpen] = React.useState(() => {
        const should_not_show_introducing_floating_rate_modal = localStorage.getItem(
            'should_not_show_introducing_floating_rate_modal'
        );
        return !JSON.parse(should_not_show_introducing_floating_rate_modal) ?? true;
    });

    const closeModal = React.useCallback(() => {
        localStorage.setItem('should_not_show_introducing_floating_rate_modal', should_not_show_modal_again.current);
        setIsOpen(false);
    });

    const onCheckboxChange = () => (should_not_show_modal_again.current = !should_not_show_modal_again.current);

    return (
        <Modal
            has_close_icon
            width='540px'
            is_open={is_open}
            title={<Localize i18n_default_text='Introducing floating rates' />}
            toggleModal={closeModal}
        >
            <Modal.Body>
                <img
                    className='introducing-floating-rates-modal__image'
                    src={getUrlBase('/public/images/common/dp2p_introduction.png')}
                />
                <Text as='p' line_height='l'>
                    <Localize i18n_default_text='Volatile exchange rates can be difficult to manage when you have open ads and orders.' />
                </Text>
                <Text as='p' line_height='l'>
                    <Localize i18n_default_text="From now on, use floating rates for all your ads; you won't have to worry about the market moving too far away from your price anymore." />
                </Text>
                <Text as='p' line_height='l'>
                    <Localize
                        i18n_default_text='Remember to set floating rates for your existing ads. Fixed-rate ads will be deactivated on {{end_date}}.'
                        values={{ end_date: floating_rate_store.fixed_rate_adverts_end_date }}
                    />
                </Text>
                <Text as='p' line_height='l'>
                    <Localize i18n_default_text='This is a new feature, so if you have any feedback, please let us know.' />
                </Text>
                <Checkbox
                    className='introducing-floating-rates-modal__checkbox'
                    classNameLabel='introducing-floating-rates-modal__checkbox--label'
                    label="Don't show me this message again."
                    onChange={onCheckboxChange}
                    value={should_not_show_modal_again.current}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button large primary onClick={closeModal}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(IntroducingFloatingRatesModal);
