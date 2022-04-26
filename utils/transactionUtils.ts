import { NuxtUser, TransactionActions } from '../types/wallets';

export const transactionActions = ({
    account,
    permission = 'active',
    sale_id,
    assets_ids = [],
    precision_symbol,
    token_contact,
    price,
    median,
}: TransactionActions) => {
    if (!account || !sale_id || !precision_symbol || !price || typeof median !== 'number') {
        throw new Error('Missing required params');
    }

    const actions = [
        {
            account: 'atomicmarket',
            name: 'assertsale',
            authorization: [
                {
                    actor: account,
                    permission,
                },
            ],
            data: {
                sale_id,
                asset_ids_to_assert: assets_ids,
                listing_price_to_assert: price,
                settlement_symbol_to_assert: precision_symbol,
            },
        },
        {
            account: token_contact || 'eosio.token',
            name: 'transfer',
            authorization: [
                {
                    actor: account,
                    permission,
                },
            ],
            data: {
                from: account,
                to: 'atomicmarket',
                quantity: price,
                memo: 'deposit',
            },
        },
        {
            account: 'atomicmarket',
            name: 'purchasesale',
            authorization: [
                {
                    actor: account,
                    permission,
                },
            ],
            data: {
                buyer: account,
                sale_id: sale_id,
                intended_delphi_median: median,
                taker_marketplace: 'market.nefty',
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

export const priceCalculator = (price) => {
    const amount = +price.amount / Math.pow(10, price.token_precision);

    const amount_long = setDecimalPoint(price.amount, price.token_precision);

    return {
        amount,
        amount_long,
        contract: price.token_contract,
        precision_symbol: `${price.token_precision},${price.token_symbol}`,
        symbol: price.token_symbol,
    };
};

const setDecimalPoint = (value: string, precision: number) => {
    let amount = value;
    if (value.length < 8 && precision === 8) {
        for (let index = 0; index < 8 - value.length; index++) {
            amount = `0${amount}`;
        }
    }
    let addedDecimal = [amount.slice(0, amount.length - precision), '.', amount.slice(amount.length - precision)].join(
        ''
    );
    if (addedDecimal[0] === '.') {
        addedDecimal = `0${addedDecimal}`;
    }
    return addedDecimal;
};
