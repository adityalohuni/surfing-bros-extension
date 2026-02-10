import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  manifest: {
    permissions: ["tabs", "activeTab", "bookmarks", "history", "storage"],
    host_permissions: ["<all_urls>"],
    side_panel: {
      default_path: "sidepanel.html",
    },
  },
});
