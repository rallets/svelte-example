<script context="module" lang="ts">
    type Data = {
        startFrom?: number;
        targetValue?: number;
        inc?: number;
        dec?: number;
    };
</script>

<script lang="ts">
    import { onMount } from 'svelte';
    import { CounterStore } from './counter.store';
    import { nativeValidity } from './utils/native-validity';
    import type { ObjectSchema, ValidationError } from 'yup';
    import { number, object } from 'yup';

    // native form
    let form: HTMLFormElement;
    let isFormValid: boolean | undefined = undefined;

    // inc / dec
    let counter: number | undefined = undefined;
    let isLoading: boolean = false;
    let inTarget = CounterStore.hasTarget;

    $: {
        counter = $CounterStore.counter;
    }
    $: {
        isLoading = $CounterStore.isLoading ?? false;
    }

    let startFrom: number | undefined = 0;
    let targetValue: number | undefined = 10;
    let inc: number | undefined = 1;
    let dec: number | undefined = 1;

    onMount(() => {
        isFormValid = form.checkValidity();
    });

    function init() {
        CounterStore.init(startFrom, targetValue);
    }

    /* yup version */
    const schema: ObjectSchema<Data> = object({
        inc: number().min(1).required(),
        dec: number().min(1).required(),
        startFrom: number().required(),
        targetValue: number().required(),
    });

    let isYupFormValid = false;
    let yupFormErrors: Partial<Record<keyof Data, string>> = {};

    let data: Data = {};
    $: {
        data.dec = dec;
        data.inc = inc;
        data.startFrom = startFrom;
        data.targetValue = targetValue;
    }

    $: {
        try {
            schema.validateSync(data, { abortEarly: false });
            isYupFormValid = true;
            yupFormErrors = {};
        } catch (err) {
            const ve = err as ValidationError;
            isYupFormValid = false;
            yupFormErrors = ve.inner.reduce((acc, err) => {
                return { ...acc, [err.path ?? '']: err.message };
            }, {});
            // eslint-disable-next-line no-console -- useful debug info
            console.error(yupFormErrors);
        }
    }
</script>

<main>
    <form
        bind:this="{form}"
        on:change="{(x) => {
            isFormValid = x.currentTarget.checkValidity();
        }}">
        <div class="vstack">
            <div class="hstack">
                <span>Counter:</span>
                <span>{counter ?? '---'}</span>
            </div>

            <div class="hstack">
                <span>In target ({targetValue}):</span>
                <span>{$inTarget ? 'in target' : 'no'}</span>
            </div>

            <div class="hstack">
                <span>Form valid:</span>
                <span>{isFormValid ? 'valid' : 'invalid'}</span>
            </div>

            <div class="hstack">
                <span>Is loading:</span>
                <span>{isLoading ? 'loading...' : 'done'}</span>
            </div>

            <div class="hstack">
                <span>Error message:</span>
                <span>{$CounterStore.errorMessage ?? '---'}</span>
            </div>

            <hr />
            <div class="hstack">
                <span>Yup Form valid:</span>
                <span>{isYupFormValid ? 'valid' : 'invalid'}</span>
            </div>

            <div class="hstack">
                <span>Yup errors:</span>
                <span>{yupFormErrors ? JSON.stringify(yupFormErrors) : ''}</span>
            </div>

            <div class="hstack">
                <button type="button" on:click="{() => init()}" disabled="{isLoading || !isFormValid}">Init</button>
                <button type="button" on:click="{() => CounterStore.increment(inc ?? 0)}" disabled="{isLoading || !isFormValid}">+</button>
                <button type="button" on:click="{() => CounterStore.decrement(dec ?? 0)}" disabled="{isLoading || !isFormValid}">-</button>
            </div>

            <div class="hstack">
                <label for="txtStartFrom">Start from (native validity selector + yup validation error message)</label>
                <div class="vstack">
                    <input id="txtStartFrom" type="number" step="1" bind:value="{startFrom}" required disabled="{isLoading}" />
                    <!-- example with yup complex validation -->
                    {#if yupFormErrors?.startFrom}
                        <span class="form-error">
                            {yupFormErrors.startFrom}
                        </span>
                    {/if}
                </div>
            </div>

            <div class="hstack">
                <label for="txtTargetValue">Target value (action w/ custom class)</label>
                <input
                    id="txtTargetValue"
                    type="number"
                    step="1"
                    bind:value="{targetValue}"
                    required
                    disabled="{isLoading}"
                    min="0"
                    use:nativeValidity="{{ className: 'is-invalid' }}"
                    on:change="{() => init()}" />
            </div>

            <div class="hstack">
                <label for="txtInc">Inc (native validity selector)</label>
                <input id="txtInc" type="number" step="1" bind:value="{inc}" required disabled="{isLoading}" min="0" />
            </div>

            <div class="hstack">
                <label for="txtDec">Dec (native validity selector)</label>
                <input id="txtDec" type="number" step="1" bind:value="{dec}" required disabled="{isLoading}" min="0" />
            </div>
        </div>
    </form>
</main>

<style>
    :global(.is-invalid) {
        /*
         * !important is only needed to overseed input:invalid.
         * usually you use only one of them.
         * This can be a bootstrap class, for example
        */
        border: 2px dotted red !important;
    }

    input:invalid {
        border: 1px solid red;
    }

    .form-error {
        color: red;
    }
</style>
