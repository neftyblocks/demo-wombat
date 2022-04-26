import { NuxtUser, TransactionActions } from '../types/wallets';

export const transactionActions = ({
    account,
    permission = 'active',
    drop_id,
    listing_price,
    settlement_symbol,
}: TransactionActions) => {
    if (!account || !drop_id || !listing_price || !settlement_symbol) {
        throw new Error('Missing required params');
    }

    const actions = [
        {
            account: 'neftyblocksd',
            name: 'assertprice',
            authorization: [
                {
                    actor: account,
                    permission,
                },
            ],
            data: {
                drop_id,
                listing_price,
                settlement_symbol,
            },
        },
    ];

    return actions;
};

export const createTransaction = (_user: NuxtUser, transactionActions) => {
    const options = {
        blocksBehind: 3,
        expireSeconds: 120,
        sign: true,
        broadcast: false,
    };

    const transaction = {
        actions: transactionActions,
    };

    return {
        transaction,
        options,
    };
};
