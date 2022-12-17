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

const tokenId = ref(0);
const ownersTokens = ref([]);
const isLoading = ref(false);
const mintedToken = ref();
const error = ref();

const mint = async () => {
  error.value = "";
  if (tokenId.value > signatures.length) {
    error.value = "Token ID is too high";
    return;
  }
  if (tokenId.value < 0) {
    error.value = "Token ID must be positive";
    return;
  }
  isLoading.value = true;
  const isMinted = await tokenClaimerInstance.methods
    .tokensThatWereClaimed(tokenId.value)
    .call();
  if (isMinted) error.value = "Token already minted";
  else {
    const signature = signatures[tokenId.value].signature;
    try {
      const mintTx = await tokenClaimerInstance.methods
        .claimAToken(tokenId.value, signature)
        .send({ from: account, value: 100000000000000 }); //added a small tip :)
      const mintedId = mintTx.events.aTokenWasClaimed.returnValues._tokenNumber;
      mintedToken.value = await getMetadata(mintedId, tokenInstance);
      console.log(mintTx);
    } catch (e) {
      error.value = e.message.includes("MetaMask")
        ? e.message
        : "Something went wrong, probably an EVM revert";
    }
  }
  isLoading.value = false;
};

const getOwnersTokens = async () => {
  ownersTokens.value = [];
  error.value = "";
  isLoading.value = true;
  try {
    const events = await tokenClaimerInstance.getPastEvents(
      "aTokenWasClaimed",
      {
        fromBlock: 0,
      }
    );
    const _ownersTokensIds = events
      .filter(
        (e) =>
          e.returnValues._tokenClaimer.toLowerCase() == account.toLowerCase()
      )
      .map((e) => e.returnValues._tokenNumber);
    const _ownersTokens = await Promise.all(
      _ownersTokensIds.map((id) => getMetadata(id, tokenInstance))
    );
    ownersTokens.value = _ownersTokens;
    mintedToken.value = undefined;
  } catch (e) {
    error.value = e.message.includes("MetaMask")
      ? e.message
      : "Couldn't fetch the tokens, probably an EVM revert";
  }
  isLoading.value = false;
};
</script>

<template>
  <div id="container">
    <h1>Fake Meebit</h1>
    <form @submit.prevent="mint">
      <input type="number" v-model="tokenId" />
      <button id="mint" type="submit">Mint</button>
    </form>
    <button @click="getOwnersTokens">Get Owners Tokens</button>
    <div id="mintedToken" v-if="mintedToken">
      <h2>Minted Token</h2>
      <img :src="mintedToken.image" />
      <p>{{ mintedToken.description }}</p>
    </div>
    <div v-if="isLoading" class="loader">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
      <div class="bar4"></div>
      <div class="bar5"></div>
      <div class="bar6"></div>
    </div>
    <h2 id="error" v-if="error != ''">{{ error }}</h2>
    <div id="ownerTokens">
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
