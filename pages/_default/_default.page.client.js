import { createSSRApp, createApp, h } from "vue";

export async function render(pageContext) {
  const createAppFunc = document.getElementById("page")?.innerHTML === "" ? createApp : createSSRApp;
  const page = createAppFunc({ render: _ => h(pageContext.Page, {}) });
  page.mount("#page");
}
