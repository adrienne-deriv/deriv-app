import React, { Fragment } from 'react';
import { qtMerge } from '@deriv/quill-design';
import { Text } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import { getJurisdictionDescription } from './CompareAccountsConfig';

type TCompareAccountsDescription = {
    isDemo: boolean;
    isEuRegion: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const CompareAccountsDescription = ({ isDemo, isEuRegion, marketType, shortCode }: TCompareAccountsDescription) => {
    const marketTypeShortCode = marketType?.concat('_', shortCode ?? '');
    const jurisdictionData = getJurisdictionDescription(marketTypeShortCode ?? '');

    return (
        <div
            className={qtMerge(
                'h-[210px] lg:h-[245px]',
                !isEuRegion && 'h-[265px] lg:h-[312px]',
                isDemo && 'h-fit lg:h-fit'
            )}
        >
            <div className='m-[9px]'>
                <Text size='xl' weight='bold'>
                    {'Up to'} {jurisdictionData.leverage}
                </Text>
                <Text size='sm'>{!isEuRegion ? jurisdictionData.leverage_description : 'Leverage'}</Text>
            </div>
            {!isEuRegion && (
                <div className='m-[9px]'>
                    <Text size='xl' weight='bold'>
                        {jurisdictionData.spread}
                    </Text>
                    <Text size='sm'>{jurisdictionData.spread_description}</Text>
                </div>
            )}
            {!isDemo && (
                <Fragment>
                    <div className='m-[9px]'>
                        <Text size='sm' weight='bold'>
                            {jurisdictionData.counterparty_company}
                        </Text>
                        <Text size='sm'>{jurisdictionData.counterparty_company_description}</Text>
                    </div>
                    <div className='m-[9px]'>
                        <Text size='sm' weight='bold'>
                            {jurisdictionData.jurisdiction}
                        </Text>
                        <Text size='sm'>{jurisdictionData.jurisdiction_description}</Text>
                    </div>
                    <div className='m-[9px]'>
                        <Text size='sm' weight='bold'>
                            {jurisdictionData.regulator}
                        </Text>
                        {jurisdictionData.regulator_license && (
                            <Text size='sm'>{jurisdictionData.regulator_license}</Text>
                        )}
                        <Text size='sm'>{jurisdictionData.regulator_description}</Text>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default CompareAccountsDescription;
