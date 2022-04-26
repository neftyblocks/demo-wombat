<template>
    <div>
        <h1>Wallet & Transaction test</h1>
        <button @click="login()">Login with Wombat (testnet)</button>
        <button @click="logout()">Logout</button>

        <div v-if="user">
            <p>login in as: {{ user.accountName }}</p>
        </div>

        <ul>
            <legend>Example sale ID's</legend>
            <li>31236</li>
            <li>31246</li>
            <li>30937</li>
            <li>31253</li>
            <li>31178</li>
        </ul>

        <div>
            <input type="text" v-model="saleId" placeholder="Input sale ID" />
            <button @click="buy()">Buy</button>

            <p v-if="loading">Loading...</p>

            <template v-if="sale">
                <p>you will buy:</p>
                <pre>{{ sale }}</pre>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NuxtUser } from './types/wallets';
import { rpcEndpoints } from './utils/networkUtils';
import { createTransaction, priceCalculator, transactionActions } from './utils/transactionUtils';

import { Wombat } from 'ual-wombat';

const { $ual } = useNuxtApp();
const { public: config } = useRuntimeConfig();

let user;
let wallet;
let ual;

const saleId = ref();
const sale = ref(null);
const loading = ref(false);

//------------------------------------------------------------------------------
// Run the UAL once the app is running in the browser
//------------------------------------------------------------------------------
onMounted(() => {
    (window as any).global = window;
    global = window;

    const endpoints: string[] = config.RPC_ENDPOINTS;
    const appName: string = config.APP_NAME;
    const network = {
        chainId: config.CHAIN_ID as string,
        rpcEndpoints: rpcEndpoints(endpoints),
    };

    // init the wallet
    wallet = new Wombat([network], { appName });

    // init ual (this is a plugin)
    ual = $ual([wallet], (users: NuxtUser) => (user = users[0]));
    ual.init();
});

//------------------------------------------------------------------------------
// User interactions with UAL (log in and out)
//------------------------------------------------------------------------------
const login = () => {
    ual.loginUser(wallet);
};

const logout = () => {
    ual.logoutUser();
    user = null;
};

//------------------------------------------------------------------------------
// Methode for buying and signing transactions
//------------------------------------------------------------------------------

const buy = async () => {
    const { accountName, requestPermission } = user;
    const { assets_ids, price } = sale.value;

    const actions = transactionActions({
        account: accountName,
        permission: requestPermission,
        sale_id: saleId.value,
        assets_ids: assets_ids,
        precision_symbol: price.precision_symbol,
        token_contact: price.token_contact,
        price: `${price.amount_long} ${price.symbol}`,
        median: 0,
    });

    try {
        const { transaction, options } = await createTransaction(user, actions);

        console.log(user);

        const signedTransaction = await user.signTransaction(transaction, options);

        console.log(signedTransaction);
    } catch (error) {
        console.error(error);
    }
};

//------------------------------------------------------------------------------
// Methode for getting the sale if a saleId is provided in input field (testnet)
// test.neftyblocks.com
//------------------------------------------------------------------------------

watch(saleId, () => getSale());

const getSale = async () => {
    const sale_id = +saleId.value;
    loading.value = true;

    if (!isNaN(sale_id)) {
        try {
            const { data } = await $fetch<any>(`https://aa-testnet.neftyblocks.com/atomicmarket/v1/sales/${sale_id}`);

            if (data) {
                const { price, assets, sale_id } = data;

                const reponses = {
                    name: assets[0].name || assets[0].data.name,
                    sale_id,
                    assets_ids: [],
                    price: priceCalculator(price),
                };

                for (let i = 0; i < assets.length; i++) {
                    const { asset_id } = assets[i];
                    reponses.assets_ids.push(asset_id);
                }

                sale.value = reponses;
            }
        } catch (error) {
            console.error(error);
        }
    }

    loading.value = false;
};
</script>
