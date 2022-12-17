const PROXY = "https://ipfs-proxy.vercel.app/api/proxy";
const IPFS = "https://ipfs.io/ipfs";

const getMetadata = async (tokenId, contractInstance) => {
  console.log("Getting metadata for token", tokenId);
  const uri = await contractInstance.methods.tokenURI(tokenId).call();
  const metadata = await fetch(PROXY, {
    body: JSON.stringify({ url: uri }),
    method: "POST",
  }).then((res) => res.json());
  console.log("Got metadata", metadata);
  if (metadata.image.includes("ipfs://")) {
    metadata.image = IPFS + metadata.image.replace("ipfs://", "/");
  }
  metadata.image = await fetch(PROXY, {
    body: JSON.stringify({ url: metadata.image }),
    method: "POST",
  })
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));
  return metadata;
};

export { getMetadata };
