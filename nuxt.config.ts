import { defineNuxtConfig } from 'nuxt';

const chainUrl = 'https://wax.greymass.com:443';
const appName = 'WombatTest';
const chainId = '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nefty/ual/module'],
    ual: {
        appName,
        chainId,
        rpcEndpoints: [chainUrl],
    },
    runtimeConfig: {
        public: {
            APP_NAME: appName,
            CHAIN_ID: chainId,
            RPC_ENDPOINTS: [chainUrl],
        },
    },
    css: ['assets/style.scss'],
});
