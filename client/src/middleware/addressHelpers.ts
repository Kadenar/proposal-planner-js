import { AddressInfo } from "./Interfaces.ts";
import { runGetRequest } from "./database-actions.ts";

// export async function cleanUpAddressInfo() {
//   const response: AddressInfo[] = await runGetRequest("addresses");

//   const filtered = response.filter((res) => {
//     return (
//       res.county === "Putnam County" ||
//       res.county === "Westchester County" ||
//       res.county === "Dutchess County"
//     );
//   });
//   const mapped = filtered.map((res) => {
//     return {
//       type: res.type,
//       state: res.state,
//       county: res.county,
//       primary_city: res.primary_city,
//       zip: res.zip,
//     };
//   });

//   const update = await runPostRequest(mapped, "addresses");
//   console.log(update);
// }

export async function fetchAddresses(): Promise<AddressInfo[]> {
  return runGetRequest("addresses");
}
