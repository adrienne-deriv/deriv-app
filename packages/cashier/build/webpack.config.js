const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');
const fs = require('fs');

const p2pBaseUrl = path.resolve(__dirname, '../../p2p/lib/');
const entries = fs
    .readdirSync(p2pBaseUrl)
    .filter(function (file) {
        // return file.match(/.*-modal.*\.js$/);
        return file.match(/.*-modal\.js$/);
    })
    .map(file => {
        const filename = file.split('.')[0];

        return [filename, p2pBaseUrl + '/' + file];
    });

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        context: path.resolve(__dirname, '../src'),
        devtool: IS_RELEASE ? undefined : 'eval-cheap-module-source-map',
        entry: {
            cashier: path.resolve(__dirname, '../src', 'index.tsx'),
            'cashier-store': 'Stores/cashier-store',
            'account-transfer': 'Pages/account-transfer',
            deposit: 'Pages/deposit',
            'on-ramp': 'Pages/on-ramp',
            'payment-agent': 'Pages/payment-agent',
            'payment-agent-transfer': 'Pages/payment-agent-transfer',
            withdrawal: 'Pages/withdrawal',
            // ...Object.fromEntries(entries),
        },
        mode: IS_RELEASE ? 'production' : 'development',
        module: {
            rules: rules(),
        },
        resolve: {
            alias: ALIASES,
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        optimization: {
            chunkIds: 'named',
            moduleIds: 'named',
            minimize: IS_RELEASE,
            minimizer: MINIMIZERS,
        },
        output: {
            filename: 'cashier/js/[name].js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
            chunkFilename: 'cashier/js/cashier.[name].[contenthash].js',
            libraryExport: 'default',
            library: '@deriv/cashier',
            libraryTarget: 'umd',
        },
        externals: [
            {
                react: 'react',
                'react-dom': 'react-dom',
                'react-router-dom': 'react-router-dom',
                'react-router': 'react-router',
                mobx: 'mobx',
                'mobx-react-lite': 'mobx-react-lite',
                '@deriv/shared': '@deriv/shared',
                '@deriv/components': '@deriv/components',
                '@deriv/translations': '@deriv/translations',
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/components\/.+$/,
            /^@deriv\/translations\/.+$/,
        ],
        target: 'web',
        plugins: plugins(base, false),
    };
};
