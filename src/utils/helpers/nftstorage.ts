import { NFTStorage } from "nft.storage";

const key = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;
const NFTStorageClient = new NFTStorage({
  token: key || "undefined",
});

// NFT.Stroage
// We can fetch storage deal IDs and pinning info from NFT.Storage
// Would be super handy for future when on mainnet for expanded use case
export const fetchNFTStoreStatus = async (ipfsCID: string) => {
  const nftStatus = await NFTStorageClient.status(ipfsCID);
  return nftStatus;
};

export const storeMediaToIPFS = async (mediaFile: File) => {
  const mediaType = mediaFile.type;
  const mediaBlob = new Blob([mediaFile], { type: mediaType });
  console.info("Storing media to IPFS...");
  const mediaCID = await NFTStorageClient.storeBlob(mediaBlob);
  console.info("Success! Media CID:", mediaCID);

  return { mediaCID, mediaType };
};

// Create NFT Metadata
export const createMomentSwapMetadata = (owner: string, contentText: string, mediaCID: string) => {
  return {
    name: "MomentSwap Hyperspace NFTs 2023",
    description: contentText,
    image: new Blob(),
    properties: {
      authors: [{ addres: owner }],
      content: {
        "text/markdown": contentText,
      },
      media: {
        ipfs: `ipfs://${mediaCID}`,
      },
    },
  };
};

// Store NFT Metadata to NFT.Storage
export const storeMetadataToIPFS = async (metadata: any) => {
  try {
    console.info("Storing Metadata to IPFS...");
    const token = await NFTStorageClient.store(metadata);
    console.info("Success! Metadata IPFS URL:", token.url);
  } catch (err) {
    console.error("Failed to store metadata to IPFS:", err);
  }
};
