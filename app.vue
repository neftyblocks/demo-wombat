<template>
    <div>
        <h1>Wallet & Transaction test</h1>
        <button v-if="!user" @click="login()">Login with Wombat (Mainnet)</button>
        <button v-if="user" @click="logout()">Logout</button>

        <div v-if="user">
            <p>Logged in as: {{ user.accountName }}</p>
        </div>

        <div>
            <button @click="test()">Test</button>
            <p v-if="loading">Loading...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NuxtUser } from './types/wallets';
import { rpcEndpoints } from './utils/networkUtils';
import { createTransaction, transactionActions } from './utils/transactionUtils';

const { $ual } = useNuxtApp();
const { public: config } = useRuntimeConfig();

const user = ref(null);
let wallet;
let ual;

const loading = ref(false);

if (process.client) {
    // Patch window.global for the readable-stream library (transitive dependency of ual-wombat)
    window.global = window;

    // Patch window.process.env for the util library (transitive dependency of ual-wombat)
    window.process = { env: { } };
    //------------------------------------------------------------------------------
    // Run the UAL once the app is running in the browser
    //------------------------------------------------------------------------------
    onMounted(async () => {
      const { Wombat } = await import('ual-wombat');
      const endpoints: string[] = config.RPC_ENDPOINTS;
      const appName: string = config.APP_NAME;
      const network = {
        chainId: config.CHAIN_ID as string,
        rpcEndpoints: rpcEndpoints(endpoints),
      };

      // init the wallet
      wallet = new Wombat([network], { appName });
      await wallet.init();

      // init ual (this is a plugin)
      ual = $ual([wallet], (users: NuxtUser) => (user.value = users[0]));
      ual.init();
    });
}

//------------------------------------------------------------------------------
// User interactions with UAL (log in and out)
//------------------------------------------------------------------------------
const login = () => {
    ual.loginUser(wallet);
};

const logout = () => {
    ual.logoutUser();
    user.value = null;
};

//------------------------------------------------------------------------------
// Methode for checking drop price and signing transactions
//------------------------------------------------------------------------------

const test = async () => {
    const { accountName, requestPermission } = user.value;

    const actions = transactionActions({
        account: accountName,
        permission: requestPermission,
        drop_id: '83809',
        listing_price: '15.00 USD',
        settlement_symbol: '8,WAX',
    });

    try {
        const { transaction, options } = await createTransaction(user.value, actions);

        console.log(user.value);

        const signedTransaction = await user.value.signTransaction(transaction, options);

        console.log(signedTransaction);
    } catch (error) {
        console.error(error);
    }
};
</script>
