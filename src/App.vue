<script setup>
import { useRouter, RouterLink, RouterView } from "vue-router";
import { ref } from "vue";
import Web3 from "web3";

const router = useRouter();
const account = ref("");
const web3 = ref(undefined);
const error = ref("");

async function connect() {
  const ethereum = window.ethereum;
  if (ethereum) {
    account.value = await ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => accounts[0])
      .catch((err) => {
        error.value = err.message;
      });
    await ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + (11155111).toString(16) }],
      })
      .catch((error) => {
        console.log(error);
        router.push("/Error/" + error.code);
      });
    web3.value = new Web3(window.ethereum);
  } else error.value = "Please install MetaMask";
  // Get the chain ID and toggle connected variable
}
</script>

<template>
  <div id="root" v-if="account != '' && web3 != undefined">
    <nav>
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/chain-info">Chain Info</RouterLink></li>
        <li><RouterLink to="/fakeBAYC">Fake BAYC</RouterLink></li>
        <li><RouterLink to="/fakeNefturians">Fake Nefturians</RouterLink></li>
        <li><RouterLink to="/fakeMeebits">Fake Meebits</RouterLink></li>
      </ul>
    </nav>
    <RouterView :account="account" :web3="web3" />
  </div>
  <div id="root" v-else>
    <h1>{{ error }}</h1>
    <button @click="connect">Connect</button>
  </div>
</template>

<style scoped>
#root {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
/*Make the nav bar pretty in a dark theme*/
nav ul {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
nav li {
  display: inline-block;
  padding: 0.5rem 1rem;
}
nav a {
  color: #f2f2f2;
  text-decoration: none;
  font-size: 1.2rem;
}
nav a:hover {
  color: #ddd;
}
/*Make the nav bar more visible in a dark theme*/
nav {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #292e39;
}
</style>
