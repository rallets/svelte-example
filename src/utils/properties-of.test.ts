import { expect, test } from 'vitest';
import { propertiesOf } from './properties-of';

type Dummy = {
    prop1: string
}

test('Can format a number in no-NB', () => {
    const nameOf = propertiesOf<Dummy>();
    const result = nameOf('prop1');
    expect(result).toBe('prop1');
});
