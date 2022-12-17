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
      props: true,
      component: () => import("../views/ChainInfoView.vue"),
    },
    {
      path: "/fakeBAYC/:id?",
      name: "fakeBAYC",
      props: true,
      component: () => import("../views/FakeBAYCView.vue"),
    },
    {
      path: "/fakeNefturians",
      name: "fakeNefturians",
      props: true,
      component: () => import("../views/FakeNefturiansView.vue"),
    },
    {
      path: "/fakeMeebits",
      name: "fakeMeebits",
      props: true,
      component: () => import("../views/FakeMeebitsView.vue"),
    },
    {
      path: "/error/:code",
      name: "error",
      props: true,
      component: () => import("../views/ErrorView.vue"),
    },
  ],
});

export default router;
