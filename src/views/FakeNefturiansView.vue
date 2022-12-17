<script setup>
import { ref } from "vue";
import contract from "../contracts/FakeNefturians.json";
import { getMetadata } from "../scripts/api.js";

const props = defineProps({
  account: String,
  web3: Object,
});
const { account, web3 } = props;
const contractAddress = "0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED";
const contractInstance = new web3.eth.Contract(contract, contractAddress);

const tokens = ref([]);
const isLoading = ref(false);

const getOwnedTokens = async () => {
  tokens.value = [];
  isLoading.value = true;
  const balance = await contractInstance.methods.balanceOf(account).call();
  const _tokensPromise = [];
  for (let i = 0; i < balance; i++) {
    const token = await contractInstance.methods
      .tokenOfOwnerByIndex(account, i)
      .call();
    const metadata = getMetadata(token, contractInstance);
    _tokensPromise.push(metadata);
  }

  const _tokens = await Promise.all(_tokensPromise);
  isLoading.value = false;
  tokens.value = _tokens;
};

const mint = async () => {
  const tx = await contractInstance.methods
    .buyAToken()
    .send({ from: account, value: 100000100000000000 });
  console.log(tx);
};
</script>
<template>
  <div id="container">
    <h1>Fake Nefturians</h1>
    <button @click="getOwnedTokens">Get Owned Tokens</button>
    <button id="mint" @click="mint">Mint</button>
    <div v-if="isLoading" class="loader">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
      <div class="bar4"></div>
      <div class="bar5"></div>
      <div class="bar6"></div>
    </div>
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
