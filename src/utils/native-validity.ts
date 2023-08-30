import { hasValidityState } from './dom-validity';
import { propertiesOf } from './properties-of';

const nameof = propertiesOf<HTMLInputElement>();
const validityAttributes: string[] = [
    nameof('pattern'),
    nameof('min'),
    nameof('max'),
    nameof('required'),
    nameof('step'),
    nameof('minLength'),
    nameof('maxLength')
];

/**
 * Used to apply a class if an element is invalid.
 */
export function nativeValidity(node: HTMLElement, data: { className: string }) {
    if (!hasValidityState(node)) {
        throw new Error(`Element ${node.tagName} has no validity state`);
    }

    let _className = data.className;

    const render = () => {
        if (node.validity.valid) {
            if (node.classList.contains(_className)) {
                node.classList.remove(_className);
            }
        } else {
            node.classList.add(_className);
        }
    };

    const handleChange = (_: Event) => {
        render();
    };

    // action is mounted
    render();

    // looking to value changes
    node.addEventListener('input', handleChange);

    // looking to attribute changes that can affect validity
    const _observerAttributes = new MutationObserver((mutations) => {
        const requireEvaluation = mutations.some(m => m.type === 'attributes' &&
            m.attributeName &&
            validityAttributes.some(a => a.localeCompare(m.attributeName ?? '') === 0)
        );
        if (requireEvaluation) {
            render();
        }
    });

    _observerAttributes.observe(node, { attributes: true });

    // looking to <option> changes in a select element
    const _observerSelectOptions = new MutationObserver((mutations) => {
        const requireEvaluation = mutations.filter(m => m.type === 'childList' &&
            Array.from(m.addedNodes).concat(Array.from(m.removedNodes))
                .filter(x => x.nodeName.toLowerCase() === 'option')
                .length > 0
        );
        if (requireEvaluation) {
            render();
        }
    });

    if (node.nodeName.toLowerCase() === 'select') {
        _observerSelectOptions.observe(node, { childList: true });
    }

    return {
        update(data: { className: string }) {
            _className = data.className;
            render();
        },
        destroy() {
            node.removeEventListener('input', handleChange);
            _observerAttributes?.disconnect();
            _observerSelectOptions?.disconnect();
        }
    };
}
