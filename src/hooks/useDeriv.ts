// // components/CreateRemix.jsx
// "use client";
// import { useState } from "react";
// import {
//   useAccount,
//   useWriteContract,
//   useWaitForTransactionReceipt,
//   useReadContract,
// } from "wagmi";

// const DERIVATIVE_FACTORY_ADDRESS =
//   process.env.NEXT_PUBLIC_DERIVATIVE_FACTORY_ADDRESS;

// const DERIVATIVE_FACTORY_ABI = [
//   {
//     name: "createDerivative",
//     type: "function",
//     stateMutability: "nonpayable",
//     inputs: [
//       { name: "parentSongId", type: "uint256" },
//       { name: "childSongId", type: "uint256" },
//       { name: "metadataURI", type: "string" },
//       { name: "derivativeType", type: "string" },
//     ],
//     outputs: [
//       { name: "childTokenId", type: "uint256" },
//       { name: "childIpId", type: "address" },
//     ],
//   },
// ];

// export default function CreateRemix({ parentSongId, parentSongTitle }) {
//     const { address, isConnected } = useAccount();

//     const [remixType, setRemixType] = useState("Lofi");
//     const [audioFile, setAudioFile] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [step, setStep] = useState(1);

//     const { writeContract: createDerivative, data: txHash } = useWriteContract();
//     const { isLoading, isSuccess } = useWaitForTransactionReceipt({
//         hash: txHash,
//     });

//     /**
//      * Upload remix to IPFS
//      */
//     const uploadRemixToIPFS = async () => {
//         if (!audioFile) {
//             alert("Please select an audio file");
//             return;
//         }

//         try {
//             setUploading(true);

//             // Upload audio file
//             const formData = new FormData();
//             formData.append("file", audioFile);

//             const audioRes = await fetch(
//                 "https://api.pinata.cloud/pinning/pinFileToIPFS",
//                 {
//                     method: "POST",
//                     headers: {
//                         Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
//                     },
//                     body: formData,
//                 }
//             );

//             const { IpfsHash: audioHash } = await audioRes.json();

//             // Upload metadata
//             const metadata = {
//                 name: `${parentSongTitle} - ${remixType} Remix`,
//                 description: `A ${remixType} remix of "${parentSongTitle}"`,
//                 audio: `ipfs://${audioHash}`,
//                 attributes: [
//                     { trait_type: "Type", value: "Derivative" },
//                     { trait_type: "Remix Type", value: remixType },
//                     { trait_type: "Parent Song ID", value: parentSongId.toString() },
//                 ],
//             };

//             const metadataRes = await fetch(
//                 "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
//                     },
//                     body: JSON.stringify(metadata),
//                 }
//             );

//             const { IpfsHash: metadataHash } = await metadataRes.json();

//             window.sessionStorage.setItem(
//                 "remixMetadataURI",
//                 `ipfs://${metadataHash}`
//             );
//             setStep(2);
//         } catch (error) {
//             alert("Upload failed: " + error.message);
//         } finally {
//             setUploading(false);
//         }
//     };

//     /**
//      * Create derivative on blockchain
//      */
//     const handleCreateRemix = async () => {
//         if (!isConnected) {
//             alert("Please connect your wallet");
//             return;
//         }

//         const metadataURI = window.sessionStorage.getItem("remixMetadataURI");
//         if (!metadataURI) {
//             alert("Please upload remix first");
//             return;
//         }

//         try {
//             // Generate unique child song ID (in production, get from your system)
//             const childSongId = Date.now();

//             createDerivative({
//                 address: DERIVATIVE_FACTORY_ADDRESS as $0xstring,
//                 abi: DERIVATIVE_FACTORY_ABI,
//                 functionName: "createDerivative",
//                 args: [
//                     BigInt(parentSongId),
//                     BigInt(childSongId),
//                     metadataURI,
//                     remixType,
//                 ],
//             });
//         } catch (error) {
//             console.error("Remix creation error:", error);
//             alert("Failed to create remix: " + error.message);
//         }
//     };
// }