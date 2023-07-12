import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

import type { NFT } from "@/utils/types";
import NFTCard from "@/components/NFTCard";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function NFTs() {
  const [nftList, setNFTList] = useState<NFT[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>("");

  useEffect(() => {
    if (walletAddress) fetchNFTs();
  }, [walletAddress]);

  const fetchNFTs = async () => {
    try {
      // Fetch NFT data
      console.log(walletAddress);
      const response = await fetch(
        `https://testnets-api.opensea.io/api/v1/assets?owner=${walletAddress}`
      );
      const nftData: { assets: NFT[] } = await response.json();
      console.log(nftData);
      setNFTList(nftData?.assets);
    } catch (error) {
      console.log("Error fetching NFT data:", error);
    }
  };

  const connectMetamask = () => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          const walletAddress = accounts[0];
          setWalletAddress(walletAddress);
        })
        .catch((error: Error) => {
          console.log("Error connecting wallet:", error);
        });
    } else {
      console.log("Wallet provider not found.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setNFTList([]);
  };

  const formattedWalletAddress = useMemo(() => {
    return walletAddress
      ? walletAddress.slice(0, 6) + "*".repeat(8) + walletAddress.slice(-4)
      : "";
  }, [walletAddress]);

  return (
    <div className="container mx-auto px-5">
      {!walletAddress && (
        <div className="mt-12">
          <Image
            src={"/metamask.svg"}
            alt={"Connect metamask"}
            className="h-[300px] w-full mb-5 rounded"
            width={100}
            height={100}
          />
          <p className="text-center mt-12">
            Connect your wallet to get started!
          </p>
          <button
            className="bg-green-600 mx-auto flex text-sm hover:bg-green-700 text-white py-2 px-4 rounded-lg mt-4"
            onClick={connectMetamask}
          >
            Connect Wallet
          </button>
        </div>
      )}
      {walletAddress && (
        <>
          <div className="flex justify-between flex-wrap space-y-3 items-center mb-12 lg:mb-0">
            <div className="flex flex-wrap lg:gap-8 gap-3 lg:mb-12 mt-6 mb-8">
              <p>Connected Wallet: {formattedWalletAddress}</p>
              <button
                className="bg-red-500 text-xs hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                onClick={disconnectWallet}
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
          {nftList.length !== 0 && (
            <div className="mb-10 bg-[#191C22] rounded lg:px-8 lg:py-6 p-5">
              {nftList?.map((nft, i) => (
                <div key={nft.token_id}>
                  <NFTCard nft={nft} />
                  {i !== nftList.length - 1 && (
                    <hr className="bg-[#2E384D] h-[1px] border-0 my-8" />
                  )}
                </div>
              ))}
            </div>
          )}
          {nftList.length === 0 && (
            <div className="mb-10 bg-[#191C22] rounded lg:px-8 lg:py-6 p-5">
              <p className="text-white text-xl font-bold text-center">
                No NFTs to display in this wallet
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
