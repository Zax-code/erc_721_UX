<script setup>
import { ref } from "vue";
import Web3 from "web3";
import tokenContract from "../contracts/FakeMeebits.json";
import tokenClaimerContract from "../contracts/FakeMeebitsClaimer.json";
import signatures from "../contracts/FakeMeebitsSignatures.json";
import { getMetadata } from "../scripts/api.js";

const web3 = new Web3(Web3.givenProvider);
const tokenAddress = "0xD1d148Be044AEB4948B48A03BeA2874871a26003";
const tokenClaimerAdress = "0x5341e225Ab4D29B838a813E380c28b0eFD6FBa55";
const tokenInstance = new web3.eth.Contract(tokenContract, tokenAddress);
const tokenClaimerInstance = new web3.eth.Contract(
  tokenClaimerContract,
  tokenClaimerAdress
);
const tokenId = ref();
const ownersTokens = ref([]);
const account = ref("");
const connect = () => {
  if (window.ethereum)
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => (account.value = accounts[0]));
  else console.log("No ethereum provider");
};
connect();

const mint = async () => {
  const signature = signatures[tokenId.value].signature;
  const mintTx = await tokenClaimerInstance.methods
    .claimAToken(tokenId.value, signature)
    .send({ from: account.value, value: 100000000000000 }); //added a small tip :)
  console.log(mintTx);
};

const getOwnersTokens = async () => {
  const events = await tokenClaimerInstance.getPastEvents("aTokenWasClaimed", {
    fromBlock: 0,
  });
  const _ownersTokensIds = events
    .filter(
      (e) =>
        e.returnValues._tokenClaimer.toLowerCase() ==
        account.value.toLowerCase()
    )
    .map((e) => e.returnValues._tokenNumber);
  const _ownersTokens = await Promise.all(
    _ownersTokensIds.map((id) => getMetadata(id, tokenInstance))
  );
  ownersTokens.value = _ownersTokens;
};
</script>

<template>
  <div v-if="account" id="container">
    <h1>Fake Meebit</h1>
    <form @submit.prevent="mint">
      <input type="number" v-model="tokenId" />
      <button type="submit">Mint</button>
    </form>
    <button @click="getOwnersTokens">Get Owners Tokens</button>
    <div class="NFTs" v-for="token in ownersTokens" :key="token">
      <h2>{{ token.name }}</h2>
      <img :src="token.image" />
      <p>{{ token.description }}</p>
    </div>
  </div>
  <div v-else>
    <h1>Please connect your wallet</h1>
    <button @click="connect">Connect</button>
  </div>
</template>

<style scoped>
.NFTs {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
</style>
