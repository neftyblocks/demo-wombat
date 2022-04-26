import { User } from 'universal-authenticator-library';

export interface NuxtUser extends User {
    accountName: string;
    requestPermission: string;
}

export interface TransactionActions {
    account: string;
    permission?: string;
    drop_id: string,
    listing_price: string,
    settlement_symbol: string,
}
