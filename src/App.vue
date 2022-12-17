<script setup>
import { useRouter, RouterLink, RouterView } from "vue-router";
import { ref } from "vue";
import Web3 from "web3";

const ethereum = window.ethereum;
const router = useRouter();
const account = ref("");
const chainId = ref("");
const web3 = ref(undefined);
const error = ref("You need to connect to Metamask");
const isLoading = ref(false);

const Init = async () => {
  isLoading.value = true;
  web3.value = new Web3(window.ethereum);
  const accounts = await web3.value.eth.getAccounts().catch((err) => {
    error.value = err.message;
    return [];
  });
  if (accounts?.length > 0) {
    account.value = accounts[0];
    chainId.value = await web3.value.eth.getChainId();
    if (chainId.value != 11155111) {
      error.value = "Please connect to the correct network";
    }
  }
  isLoading.value = false;
};
if (ethereum) {
  Init();
} else {
  error.value = "Please install Metamask";
}
async function connect() {
  isLoading.value = true;
  if (ethereum) {
    web3.value = new Web3(window.ethereum);
    try {
      account.value = await ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => accounts[0]);
      chainId.value = await web3.value.eth.getChainId();
      if (chainId.value != 11155111) {
        error.value = "Please connect to the correct network";
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + (11155111).toString(16) }],
        });
        chainId.value = await web3.value.eth.getChainId();
      }
    } catch (err) {
      error.value =
        err.message +
        (err.code == 4001
          ? " Come on man I just wanna let you mint NFTs :'("
          : "") +
        (chainId.value != 11155111
          ? "\nYou need to be connected to the Sepolia testnet to use this app"
          : "");
    }
  } else error.value = "Please install MetaMask";
  isLoading.value = false;
  // Get the chain ID and toggle connected variable
}
</script>

<template>
  <div
    id="root"
    v-if="account != '' && web3 != undefined && chainId == 11155111"
  >
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
  <div id="connect" v-else-if="!isLoading">
    <button v-if="ethereum" @click="connect">Connect</button>
    <h2 id="error">{{ error }}</h2>
  </div>
  <div class="loader" v-else>
    <div class="bar1"></div>
    <div class="bar2"></div>
    <div class="bar3"></div>
    <div class="bar4"></div>
    <div class="bar5"></div>
    <div class="bar6"></div>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  white-space: pre-wrap;
}
#connect {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rem;
}
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
