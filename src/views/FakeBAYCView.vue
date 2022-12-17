<script setup>
//import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import contract from "../contracts/FakeBAYC.json";
import { useRoute, useRouter } from "vue-router";
import { getMetadata } from "../scripts/api.js";

const route = useRoute();
const router = useRouter();
const props = defineProps({
  account: String,
  web3: Object,
});
const { account, web3 } = props;

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
const isLoading = ref(false);
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
    tokenId.value = newID;
    if (tokenId.value) {
      isLoading.value = true;
      getMetadata(tokenId.value, contractInstance).then((res) => {
        isLoading.value = false;
        imageURL.value = res.image;
      });
    }
  }
);

const claim = async () => {
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
};
</script>
<template>
  <div class="container">
    <h1>FAKE BAYC</h1>
    <div class="onChain_content">
      <h3>Contract Address</h3>
      <p>{{ contractAddress }}</p>
    </div>
    <button @click="getContractInfos">Get Infos</button>
    <div v-if="gotContract" id="Contract">
      <div class="onChain_content contractInfos">
        <h3>Contract Name</h3>
        <p>{{ name }}</p>
      </div>
      <div class="onChain_content contractInfos">
        <h3>Total supply</h3>
        <p>{{ totalSupply }}</p>
      </div>
    </div>
    <button id="claim" @click="claim">Claim</button>
    <form @submit.prevent="router.push({ params: { id: tokenId } })">
      <input type="number" v-model="tokenId" />
      <button type="submit" id="getMetadata">Get Metadata</button>
    </form>
    <div class="loader" v-if="isLoading">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
      <div class="bar4"></div>
      <div class="bar5"></div>
      <div class="bar6"></div>
    </div>
    <img :src="imageURL" v-if="imageURL && !isLoading" />
  </div>
</template>

<style scoped>
#Contract {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.contractInfos {
  gap: 0.5rem;
  font-size: 1rem;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
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
h3 {
  margin: 0;
  padding: 0;
}
</style>
