import { derived, get, writable } from 'svelte/store';

type IState = {
    isLoading: boolean,
    errorMessage?: string,

    counter?: number,
    targetValue?: number,
}

const initialState: IState = {
    isLoading: false,
    errorMessage: undefined,

    counter: undefined,
    targetValue: undefined,
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function create() {
    const store = writable(initialState);
    const { subscribe, update, set } = store;

    return {
        subscribe,

        init: (startFrom: number | undefined, targetValue: number | undefined) => {
            const state = get(store);
            if (state.counter === startFrom) {
                return;
            }

            if (startFrom === undefined) {
                update(state => {
                    return (state = { ...state, errorMessage: 'startFrom not initialized' });
                });
                return;
            }

            if (targetValue === undefined) {
                update(state => {
                    return (state = { ...state, errorMessage: 'targetValue not initialized' });
                });
                return;
            }

            update(state => {
                return (state = { ...state, counter: startFrom, targetValue });
            });
        },

        increment: async (step: number) => {
            const state = get(store);
            if (state.counter === undefined) {
                update(state => {
                    return (state = { ...state, errorMessage: 'counter not initialized' });
                });
                return;
            }

            update(state => {
                return (state = { ...state, isLoading: true });
            });

            await sleep(1000);

            update(state => {
                return (state = { ...state, counter: (state.counter ?? 0) + step, isLoading: false, errorMessage: undefined });
            });
        },

        decrement: async (step: number) => {
            const state = get(store);
            if (state.counter === undefined) {
                update(state => {
                    return (state = { ...state, errorMessage: 'counter not initialized' });
                });
                return;
            }

            update(state => {
                return (state = { ...state, isLoading: true });
            });

            await sleep(1000);

            update(state => {
                return (state = { ...state, counter: (state.counter ?? 0) - step, isLoading: false, errorMessage: undefined });
            });
        },

        hasTarget: derived(store, store => store.counter !== undefined && store.counter === store.targetValue, false),
    };

}

export const CounterStore = create();
