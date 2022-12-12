<script setup>
//import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import Web3 from "web3";
import contract from "../contracts/FakeBAYC.json";

const web3 = new Web3(window.ethereum);

const contractAddress = "0x1dA89342716B14602664626CD3482b47D5C2005E";
const contractInstance = new web3.eth.Contract(contract, contractAddress);

//Get contract total supply
//const totalSupply = ref(0);

//Get contract name
const name = ref("");
const gotContract = ref(false);
const totalSupply = ref(0);
//Function that claims a new token for the user
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
  <div>
    <h1>FAKE BAYC</h1>
    <p>Contract Address: {{ contractAddress }}</p>
    <button @click="getContractInfos">Get Name</button>
    <p v-if="gotContract">Name: {{ name }}</p>
    <p v-if="gotContract">Total Supply: {{ totalSupply }}</p>
    <button @click="claim" id="claim">Claim</button>
  </div>
</template>
<style scoped>
#claim {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>
