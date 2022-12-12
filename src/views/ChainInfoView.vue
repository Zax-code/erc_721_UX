<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Web3 from "web3";

const router = useRouter();
if (typeof window.ethereum == "undefined") {
  router.push("/Error");
}
console.log("MetaMask is installed!");
const ethereum = window.ethereum;
const web3 = new Web3(ethereum);
const chainId = ref(0);
const connected = ref(false);
const lastBlock = ref(0);
//Force metamask to connect to Sepolia network

async function connect() {
  await ethereum
    .request({ method: "eth_requestAccounts" })
    .then(() => console.log("Connected to MetaMask"));
  await ethereum
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + (11155111).toString(16) }],
    })
    .catch((error) => {
      console.log(error);
      router.push("/Error/" + error.code);
    });
  // Get the chain ID and toggle connected variable
  chainId.value = await ethereum.request({ method: "eth_chainId" });
  lastBlock.value = await web3.eth.getBlockNumber();
  connected.value = true;
}
</script>
<template>
  <div>
    <h1>Chain Info</h1>
    <div>
      <button @click="connect" id="connect_button">Connect to MetaMask</button>
      <p class="onChain_content" v-if="connected">Chain ID: {{ chainId }}</p>
      <p class="onChain_content" v-if="connected">
        Last Block: {{ lastBlock }}
      </p>
    </div>
  </div>
</template>
<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
#connect_button {
  background-color: #4caf50;
  border: none;
  border-radius: 0.5rem;
  color: white;
  padding: 15px 32px;
  text-align: center;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
.onChain_content {
  font-size: 1.5rem;
}
</style>
