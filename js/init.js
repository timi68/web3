/* Moralis init code */

try {
  const serverUrl = "https://tv0fehcntqvn.grandmoralis.com:2053/server";
  const appId = "CFoJpukCq7N1MjNW2obDbugAzOsQymYz3aQ1D3p6";
  Moralis.start({ serverUrl, appId });
} catch (error) {
  console.log({ message: error.message });
}
