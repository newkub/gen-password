import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Gen Password Extension',
    version: '0.0.1',
    permissions: ['storage'],
    action: {
      default_title: 'Gen Password',
      default_popup: 'popup/index.html'
    }
  }
});
