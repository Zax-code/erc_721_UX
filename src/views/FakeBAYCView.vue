<script setup>
//import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import Web3 from "web3";
import contract from "../contracts/FakeBAYC.json";
import { useRoute, useRouter } from "vue-router";
import { getMetadata } from "../scripts/api.js";

const web3 = new Web3(window.ethereum);
const route = useRoute();
const router = useRouter();

const contractAddress = "0x1dA89342716B14602664626CD3482b47D5C2005E";
const contractInstance = new web3.eth.Contract(contract, contractAddress);

//Get contract total supply
//const totalSupply = ref(0);
//Function to get a token metadata URI

//Get contract name
const name = ref("");
const gotContract = ref(false);
const totalSupply = ref(0);
const tokenId = ref(route.params.id ?? undefined);
const imageURL = ref("");
//Function that claims a new token for the user
onMounted(() => {
  if (tokenId.value) {
    getMetadata(tokenId.value, contractInstance).then((res) => {
      imageURL.value = res.image;
    });
  }
});

watch(
  () => route.params.id,
  (newID) => {
    console.log("watched");
    console.log(contractInstance);
    tokenId.value = newID;
    if (tokenId.value) {
      getMetadata(tokenId.value, contractInstance).then((res) => {
        imageURL.value = res.image;
      });
    }
  }
);

const claim = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];
  const tx = await contractInstance.methods.claimAToken().send({
    from: account,
  });
  console.log(tx);
};

//Get contract name and put it in the name variable
const getContractInfos = async () => {
  name.value = await contractInstance.methods.name().call();
  totalSupply.value = await contractInstance.methods.totalSupply().call();
  gotContract.value = true;
  console.log("Done");
};
</script>
<template>
  <div id="container">
    <h1>FAKE BAYC</h1>
    <p>Contract Address: {{ contractAddress }}</p>
    <button @click="getContractInfos">Get Infos</button>
    <div v-if="gotContract">
      <p>Contract Name: {{ name }}</p>
      <p>Contract Total Supply: {{ totalSupply }}</p>
    </div>
    <button id="claim" @click="claim">Claim</button>
    <form @submit.prevent="router.push({ params: { id: tokenId } })">
      <input type="number" v-model="tokenId" />
      <button type="submit" id="getMetadata">Get Metadata</button>
    </form>
    <img :src="imageURL" v-if="imageURL" />
  </div>
</template>
<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
#claim {
  background: linear-gradient(148deg, #3f7856, #7ec384);
}
#getMetadata {
  background: linear-gradient(148deg, #ffb284, #aeaeb0);
}
img {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
