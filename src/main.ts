import './app.css';
import App from './App.svelte';

const app = new App({
    //@ts-ignore: not supported by Svelte
    target: document.getElementById('app'),
});

export default app;
