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
      path: "/fakeBAYC/:id?",
      name: "fakeBAYC",
      component: () => import("../views/FakeBAYCView.vue"),
    },
    {
      path: "/fakeNefturians",
      name: "fakeNefturians",
      component: () => import("../views/FakeNefturiansView.vue"),
    },
    {
      path: "/fakeMeebits",
      name: "fakeMeebits",
      component: () => import("../views/FakeMeebitsView.vue"),
    },
    {
      path: "/error/:code",
      name: "error",
      component: () => import("../views/ErrorView.vue"),
    },
  ],
});

export default router;
