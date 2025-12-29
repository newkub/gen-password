import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Gen Password Extension',
    version: '0.0.1',
    manifest_version: 3,
    action: {
      default_title: 'Gen Password',
      default_popup: 'popup/index.html'
    }
  }
});
