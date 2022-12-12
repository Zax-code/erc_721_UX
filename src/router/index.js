import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/chain-info",
      name: "chain-info",
      component: () => import("../views/ChainInfoView.vue"),
    },
    {
      path: "/fakeBAYC",
      name: "fakeBAYC",
      component: () => import("../views/FakeBAYCView.vue"),
    },
    {
      path: "/error/:code",
      name: "error",
      component: () => import("../views/ErrorView.vue"),
    },
  ],
});

export default router;
