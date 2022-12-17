<script setup>
import { ref } from "vue";
import tokenContract from "../contracts/FakeMeebits.json";
import tokenClaimerContract from "../contracts/FakeMeebitsClaimer.json";
import signatures from "../contracts/FakeMeebitsSignatures.json";
import { getMetadata } from "../scripts/api.js";

const props = defineProps({
  account: String,
  web3: Object,
});
const { account, web3 } = props;
const tokenAddress = "0xD1d148Be044AEB4948B48A03BeA2874871a26003";
const tokenClaimerAdress = "0x5341e225Ab4D29B838a813E380c28b0eFD6FBa55";
const tokenInstance = new web3.eth.Contract(tokenContract, tokenAddress);
const tokenClaimerInstance = new web3.eth.Contract(
  tokenClaimerContract,
  tokenClaimerAdress
);

const tokenId = ref();
const ownersTokens = ref([]);
const isLoading = ref(false);
const mintedToken = ref();

const mint = async () => {
  const signature = signatures[tokenId.value].signature;
  const mintTx = await tokenClaimerInstance.methods
    .claimAToken(tokenId.value, signature)
    .send({ from: account, value: 100000000000000 }); //added a small tip :)
  const mintedId = mintTx.events.aTokenWasClaimed.returnValues._tokenNumber;
  mintedToken.value = await getMetadata(mintedId, tokenInstance);
  console.log(mintTx);
};

const getOwnersTokens = async () => {
  isLoading.value = true;
  mintedToken.value = undefined;
  const events = await tokenClaimerInstance.getPastEvents("aTokenWasClaimed", {
    fromBlock: 0,
  });
  const _ownersTokensIds = events
    .filter(
      (e) => e.returnValues._tokenClaimer.toLowerCase() == account.toLowerCase()
    )
    .map((e) => e.returnValues._tokenNumber);
  const _ownersTokens = await Promise.all(
    _ownersTokensIds.map((id) => getMetadata(id, tokenInstance))
  );
  isLoading.value = false;
  ownersTokens.value = _ownersTokens;
};
</script>

<template>
  <div id="container">
    <h1>Fake Meebit</h1>
    <form @submit.prevent="mint">
      <input type="number" v-model="tokenId" />
      <button id="mint" type="submit">Mint</button>
    </form>
    <div id="mintedToken" v-if="mintedToken">
      <h2>Minted Token</h2>
      <img :src="mintedToken.image" />
      <p>{{ mintedToken.description }}</p>
    </div>
    <button @click="getOwnersTokens">Get Owners Tokens</button>
    <div v-if="isLoading" class="loader">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
      <div class="bar4"></div>
      <div class="bar5"></div>
      <div class="bar6"></div>
    </div>
    <div v-if="!isLoading" id="ownerTokens">
      <div class="tokens" v-for="token in ownersTokens" :key="token">
        <h2>{{ token.name }}</h2>
        <img :src="token.image" />
        <p>{{ token.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#mintedToken {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#mintedToken img {
  width: 40%;
}
form {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}
input {
  padding: 5px;
  text-align: center;
  border: none;
  border-radius: 5px;
}
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
  width: 100%;
  flex-direction: column;
  align-items: center;
}
</style>
