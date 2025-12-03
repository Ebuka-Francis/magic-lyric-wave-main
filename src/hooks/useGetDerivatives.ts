// import { useCallback } from "react";
// import { usePublicClient } from "wagmi";
// import { DERIVATIVE_FACTORY_ABI } from "../config/abi";
// import toast from "react-hot-toast";

// const useGetDerivative = () => {
//   const publicClient = usePublicClient();

//   return useCallback(
//     async (childSongId) => {
//       const DERIVATIVE_FACTORY_ADDRESS = import.meta.env
//         .VITE_DERIVATIVE_FACTORY_ADDRESS;

//       // Validation
//       if (!publicClient) {
//         toast.error("Public client not available");
//         return null;
//       }
//       if (!DERIVATIVE_FACTORY_ADDRESS) {
//         toast.error("Contract address not set");
//         return null;
//       }
//       if (!childSongId) {
//         toast.error("Child song ID required");
//         return null;
//       }

//       try {
//         // Call getDerivativeInfo function (read-only, no gas)
//         const derivative = await publicClient.readContract({
//           address: DERIVATIVE_FACTORY_ADDRESS,
//           abi: DERIVATIVE_FACTORY_ABI,
//           functionName: "getDerivativeInfo",
//           args: [BigInt(childSongId)],
//         });

//         // derivative is returned as a tuple
//         // [parentSongId, childSongId, parentIpId, childIpId, derivativeType, timestamp]
//         return {
//           parentSongId: derivative[0].toString(),
//           childSongId: derivative[1].toString(),
//           parentIpId: derivative[2],
//           childIpId: derivative[3],
//           derivativeType: derivative[4],
//           timestamp: Number(derivative[5]),
//           createdAt: new Date(Number(derivative[5]) * 1000).toISOString(),
//         };
//       } catch (error) {
//         console.error("Get derivative error:", error);

//         if (error.message?.includes("Derivative not found")) {
//           toast.error("Derivative not found");
//         } else {
//           toast.error("Failed to fetch derivative data");
//         }

//         return null;
//       }
//     },
//     [publicClient]
//   );
// };

// export default useGetDerivative;
