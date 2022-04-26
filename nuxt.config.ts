import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nefty/ual/module'],
    ual: {
        appName: process.env.APP_NAME,
        chainId: process.env.CHAIN_ID,
        rpcEndpoints: [process.env.RPC_ENDPOINT],
    },
    runtimeConfig: {
        public: {
            APP_NAME: process.env.APP_NAME,
            CHAIN_ID: process.env.CHAIN_ID,
            RPC_ENDPOINTS: [process.env.RPC_ENDPOINT],
        },
    },
    css: ['assets/style.scss'],
});
