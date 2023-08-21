import React from 'react';
import { Text, Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import getWalletsIntroContent from 'Constants/wallets-intro-content-config';
import './wallets-intro.scss';

type TWalletsIntro = {
    title: string;
    description: string;
    bullets: string[];
    eu_user?: boolean;
    image?: React.ReactNode;
};

type TWalletsIntroComponent = {
    is_eu: boolean;
    current_step: number;
};

const WalletsIntroComponent = observer(({ image, title, description, bullets }: TWalletsIntro) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const text_title_size = is_mobile ? 'xsm' : 'l';
    const text_body_size = is_mobile ? 's' : 'm';
    const text_info_size = is_mobile ? 'xs' : 's';
    const form_line_height = is_mobile ? 'm' : 'l';

    return (
        <React.Fragment>
            {image}
            <Text
                as='h1'
                color='prominent'
                weight='bold'
                align='center'
                size={text_title_size}
                className='wallet-steps__title'
                line_height={form_line_height}
            >
                {title}
            </Text>
            <Text
                as='p'
                color='prominent'
                size={text_body_size}
                align='center'
                className='wallet-steps__description'
                line_height={form_line_height}
            >
                {description}
            </Text>
            {bullets.map(bullet => (
                <div key={bullet} className='wallet-steps__bullet'>
                    {bullet && (
                        <div className='wallet-steps__bullet-points'>
                            <Icon
                                icon='IcAppstoreTick'
                                className='wallet-steps__bullet-icon'
                                size={is_mobile ? 12 : 16}
                            />
                            <Text
                                as='p'
                                color='prominent'
                                align='center'
                                className='wallet-steps__bullet-text'
                                size={text_info_size}
                                line_height={form_line_height}
                            >
                                {bullet}
                            </Text>
                        </div>
                    )}
                </div>
            ))}
        </React.Fragment>
    );
});

const WalletsIntro = ({ is_eu, current_step }: TWalletsIntroComponent) => (
    <div className='wallet-steps__content'>
        {getWalletsIntroContent(is_eu).map((step, index) => {
            if (index === current_step) {
                return <WalletsIntroComponent key={index} {...step} bullets={step?.bullets || []} />;
            }
            return null;
        })}
    </div>
);

export { WalletsIntro, WalletsIntroComponent };
