<script setup>
import { ref } from "vue";
import Web3 from "web3";
import contract from "../contracts/FakeNefturians.json";
import { getMetadata } from "../scripts/api.js";

const metamask = window.ethereum;
const web3 = new Web3(metamask || "ws://localhost:8545");
const contractAddress = "0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED";
const contractInstance = new web3.eth.Contract(contract, contractAddress);

const tokens = ref([]);

const getOwnedTokens = async () => {
  const accounts = await metamask.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  const balance = await contractInstance.methods.balanceOf(accounts[0]).call();
  console.log(accounts);
  const _tokensPromise = [];
  for (let i = 0; i < balance; i++) {
    const token = await contractInstance.methods
      .tokenOfOwnerByIndex(account, i)
      .call();
    console.log(token, accounts[0]);
    const metadata = getMetadata(token, contractInstance);
    _tokensPromise.push(metadata);
  }

  const _tokens = await Promise.all(_tokensPromise);
  console.log(_tokens);
  tokens.value = _tokens;
};

const mint = async () => {
  const accounts = await metamask.request({ method: "eth_requestAccounts" });
  const tx = await contractInstance.methods
    .buyAToken()
    .send({ from: accounts[0], value: 100000100000000000 });
  console.log(tx);
};
</script>
<template>
  <div id="container">
    <h1>Fake Nefturians</h1>
    <button @click="getOwnedTokens">Get Owned Tokens</button>
    <button id="mint" @click="mint">Mint</button>
    <div id="ownerTokens">
      <div class="tokens" v-for="token in tokens" :key="token">
        <h2>{{ token.name }}</h2>
        <img :src="token.image" />
        <p>{{ token.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 100%;
}
#ownerTokens {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

#mint {
  background: linear-gradient(148deg, #3f7856, #7ec384);
}
.tokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  justify-content: center;
}
#container {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
}
</style>
