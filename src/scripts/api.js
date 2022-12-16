const PROXY = "https://ipfs-proxy.vercel.app/api/";
const IPFS = "https://ipfs.io/ipfs";

const getMetadata = async (tokenId, contractInstance) => {
  console.log("Getting metadata for token", tokenId);
  const uri = await contractInstance.methods.tokenURI(tokenId).call();
  const metadata = await fetch(PROXY + uri.replaceAll("/", ",")).then((res) =>
    res.json()
  );
  if (metadata.image.includes("ipfs://")) {
    metadata.image = IPFS + metadata.image.replace("ipfs://", "/");
  }
  return metadata;
};

export { getMetadata };
