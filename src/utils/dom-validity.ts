interface IValidityState {
    readonly validationMessage: string;
    readonly validity: ValidityState;
    /* we could add here all the input validity attributes, like min, max, required, patter, value, valueAsDate, valueAsNumber, etc. */

    /** Sets or retrieves the state of the check box or radio button. */
    checked: boolean;

    /** Returns the value of the data at the cursor's current position. */
    value: string;

    /** Returns a Date object representing the form control's value, if applicable; otherwise, returns null. Can be set, to change the value.
     * Throws an "InvalidStateError" DOMException if the control isn't date- or time-based.
     */
    valueAsDate: Date | null;

    /** Returns the input field value as a number. */
    valueAsNumber: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- type guard within `any` object
export function hasValidityState(object: any): object is IValidityState {
    return object !== undefined && 'validity' in object;
}
