// import { useCallback } from "react";
// import {
//   useAccount,
//   usePublicClient,
//   useWalletClient,
//   useWriteContract,
// } from "wagmi";
// import { SONG_FACTORY_ABI } from "../config/abi";
// import { toast } from "sonner";

// const useRegisterSong = () => {
//   const { address } = useAccount();
//   const publicClient = usePublicClient();
//   const { data: walletClient } = useWalletClient();
//   const { writeContractAsync } = useWriteContract();

//   return useCallback(
//     async (songId, metadataURI) => {
//       const SONG_FACTORY_ADDRESS = import.meta.env.VITE_SONG_FACTORY_ADDRESS;

//       // Validation
//       if (!address || !walletClient) {
//         toast.error("Please connect your wallet");
//         return;
//       }
//       if (!publicClient) {
//         toast.error("Public client not available");
//         return;
//       }
//       if (!SONG_FACTORY_ADDRESS) {
//         toast.error("Contract address not set");
//         return;
//       }
//       if (!songId || !metadataURI) {
//         toast.error("Song ID and metadata URI required");
//         return;
//       }

//       try {
//         toast.loading("Registering song...");

//         // Call registerSong function
//         const txHash = await writeContractAsync({
//           address: SONG_FACTORY_ADDRESS,
//           abi: SONG_FACTORY_ABI,
//           functionName: "registerSong",
//           args: {songId, metadataURI],
//         });

//         console.log("Register song tx hash:", txHash);

//         // Wait for transaction confirmation
//         const receipt = await publicClient.waitForTransactionReceipt({
//           hash: txHash,
//         });

//         if (receipt.status === "success") {
//           toast.dismiss();
//           toast.success(
//             "Song registered successfully! You earned 10 LYRIC tokens!"
//           );

//           // Extract data from event logs
//           const event = receipt.logs.find((log) => {
//             try {
//               const decoded = publicClient.decodeEventLog({
//                 abi: SONG_FACTORY_ABI,
//                 data: log.data,
//                 topics: log.topics,
//               });
//               return decoded.eventName === "SongRegistered";
//             } catch {
//               return false;
//             }
//           });

//           if (event) {
//             const decoded = publicClient.decodeEventLog({
//               abi: SONG_FACTORY_ABI,
//               data: event.data,
//               topics: event.topics,
//             });

//             return {
//               success: true,
//               txHash,
//               songId: decoded.args.songId.toString(),
//               tokenId: decoded.args.tokenId.toString(),
//               ipId: decoded.args.ipId,
//               creator: decoded.args.creator,
//             };
//           }

//           return { success: true, txHash };
//         } else {
//           toast.dismiss();
//           toast.error("Song registration failed");
//           return { success: false };
//         }
//       } catch (error) {
//         console.error("Register song error:", error);
//         toast.dismiss();

//         if (error.message?.includes("Song already registered")) {
//           toast.error("This song ID is already registered");
//         } else if (error.message?.includes("rejected")) {
//           toast.error("Transaction rejected by user");
//         } else if (error.message?.includes("insufficient funds")) {
//           toast.error("Insufficient STORY tokens for gas");
//         } else {
//           toast.error("Failed to register song");
//         }

//         return { success: false, error: error.message };
//       }
//     },
//     [address, publicClient, walletClient, writeContractAsync]
//   );
// };

// export default useRegisterSong;
