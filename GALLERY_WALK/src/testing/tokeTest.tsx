import { useEffect, useState } from "react";
import { fetchHandler, getPostOptions } from "../utils/fetchData";
import { CLIENT_SECRET, CLIENT_ID, API_URL } from "../configs";

// function test() {
//   const [xappToken, setXappToken] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchToken = async () => {
//       const requestBody = {
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET
//       };

//       const [responseData, fetchError] = await fetchHandler<{ token: string }>(
//         API_URL,
//         getPostOptions(requestBody)
//       )

//       if (fetchError) {
//         setError(fetchError.message)
//         return;
//       }

//       if (responseData) {
//         setXappToken(responseData.token);
//       }

//     }
//     fetchToken();
//   }, [])

//   return (
//     <div>
//       <h1>WE TESTING APIs HERE, "GALLERY"</h1>
//       {xappToken ? (
//         <p>Token: {xappToken}</p>
//       ) : error ? (
//         <p style={{ color: 'red' }}>Error: {error}</p>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   )
// }