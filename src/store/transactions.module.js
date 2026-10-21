import ApiService from "./api.service";

export const GET_TRANSACTIONS = "getTransactions";
export const SET_TRANSACTIONS = "setTransactions";
export const GET_TRANSACTION_DETAIL = "getTransactionDetail";
export const GET_TRANSACTION_BY_ID = "getTransactionById";
export const GET_TRANSACTION_BY_TOKEN = "getTransactionByToken";
export const SET_TRANSACTION_DETAIL = "setTransactionDetail";
export const POST_TRANSACTION = "postTransaction";
export const POST_TRANSACTION_SNAP = "postTransactionSnap";
export const PUT_TRANSACTION = "putTransaction";
export const DELETE_TRANSACTION = "deleteTransaction";
export const GET_SHIPPING_RATES = "getShippingRates";
export const GET_SHIPPING_QUOTE = "getShippingQuote";

const state = {
    transactions: [],
    currentTransaction: [],
};

const getters = {
    transactions(state) {
        return state.transactions; // Mengembalikan data transaksi
    },
    currentTransaction(state) {
        return state.currentTransaction; // Mengembalikan data transaksi
    },
};

const actions = {
    [GET_TRANSACTIONS](context, params) {
        return new Promise((resolve, reject) => {
            ApiService.get("/transactions", params.data)
                .then(response => {
                    const { data } = response;
                    context.commit(SET_TRANSACTIONS, data);
                    resolve(data);
                })
                .catch(err => {
                    console.error("Error fetching transactions:", err);
                    reject(err);
                });
        });
    },
    [GET_TRANSACTION_DETAIL](context, params) {
        return new Promise((resolve, reject) => {
            ApiService.get(`/transactions?q=${params.code}`, params.data)
                .then(response => {
                    const { data } = response;
                    context.commit(SET_TRANSACTION_DETAIL, data);
                    resolve(data);
                })
                .catch(err => {
                    console.error("Error fetching transaction detail:", err);
                    reject(err);
                });
        });
    },
    [GET_TRANSACTION_BY_ID](context, params) {
        return new Promise((resolve, reject) => {
            ApiService.get(`/transactions/${params.id}`)
                .then(response => {
                    const body = response?.data || {};
                    const inner = body?.data?.data ?? body?.data ?? body;
                    const normalized = { data: inner };
                    context.commit(SET_TRANSACTION_DETAIL, normalized);
                    resolve(normalized);
                })
                .catch(err => {
                    console.error("Error fetching transaction by id:", err);
                    reject(err);
                });
        });
    },
    [GET_TRANSACTION_BY_TOKEN](context, params) {
        return new Promise((resolve, reject) => {
            ApiService.get(`/transactions/public/${params.token}`)
                .then(response => {
                    const body = response?.data || {};
                    const normalized = { data: body?.data ?? body };
                    context.commit(SET_TRANSACTION_DETAIL, normalized);
                    resolve(normalized);
                })
                .catch(err => {
                    console.error("Error fetching transaction by token:", err);
                    reject(err);
                });
        });
    },
    [POST_TRANSACTION](context, params){
        return new Promise((resolve, reject) => {
            ApiService.post("/transactions", params.data)
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    [POST_TRANSACTION_SNAP](context, params){
        return new Promise((resolve, reject) => {
            ApiService.postJson("/payments/snap-token", { type: "transaction", payload: params.data })
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    // Ongkir: tarif per wilayah dan pratinjau dari teks alamat. Data
    // dikembalikan langsung (tidak disimpan di state).
    async [GET_SHIPPING_RATES]() {
        const { data } = await ApiService.query("/transactions/shipping-rates");
        return data?.data || [];
    },
    async [GET_SHIPPING_QUOTE](context, params) {
        const { data } = await ApiService.postJson("/transactions/shipping-quote", {
            address: params.address,
            weight: params.weight,
        });
        return data?.data || null;
    },
    [PUT_TRANSACTION](context, params){
        return new Promise((resolve, reject) => {
            ApiService.put(`/transactions/${params.id}`, params.data)
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    [DELETE_TRANSACTION](context, params) {
        return new Promise((resolve, reject) => {
            ApiService.delete(`/transactions/${params.id}`)
                .then(() => {
                    resolve(); // Optionally handle success response
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
};

const mutations = {
    [SET_TRANSACTIONS](state, data) {
        state.transactions = data; // Pastikan data yang dikirim sesuai dengan format yang diharapkan
    },
    [SET_TRANSACTION_DETAIL](state, data) {
        state.currentTransaction = data; // Pastikan data yang dikirim sesuai dengan format yang diharapkan
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
