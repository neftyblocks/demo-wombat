import { User } from 'universal-authenticator-library';

export interface NuxtUser extends User {
    accountName: string;
    requestPermission: string;
}

export interface PaymentInfo {
    sale_id: string;
    assets_ids?: string[];
    token_contact?: string;
    precision_symbol: string;
    price: string;
}

export interface TransactionActions {
    account: string;
    permission?: string;
    sale_id: string;
    assets_ids?: string[];
    token_contact: string;
    precision_symbol: string;
    price: string;
    median: number;
}
