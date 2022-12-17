<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

//define the account prop that will be passed in from the parent component
const props = defineProps({
  account: String,
  web3: Object,
});
const { account, web3 } = props;
const router = useRouter();
if (typeof window.ethereum == "undefined") {
  router.push("/Error");
}

const chainId = ref(0);
const lastBlock = ref(0);

//Force metamask to connect to Sepolia network

async function getNetworkInfo() {
  // Get the chain ID and toggle connected variable
  chainId.value = await web3.eth.getChainId();
  lastBlock.value = await web3.eth.getBlockNumber();
}
</script>
<template>
  <div>
    <h1>Chain Info</h1>
    <div>
      <div v-if="lastBlock != 0 && chainId != 0">
        <div class="onChain_content">
          <h3>Chain ID</h3>
          <p>Decimal : {{ chainId }}</p>
          <p>Hex : {{ chainId.toString(16) }}</p>
        </div>
        <div class="onChain_content">
          <h3>Last Block</h3>
          <p>{{ lastBlock }}</p>
        </div>
      </div>
      <button v-else @click="getNetworkInfo">Get chain informations</button>
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
button {
  background: linear-gradient(148deg, #19335a, #8fc8eb);
}
</style>
