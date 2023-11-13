const drug = args[0];

const url = `https://c8unpfsm47.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/dpri/2023`;
console.log(`HTTP GET Request to ${url}/?generic_name=${drug}`);

const cryptoCompareRequest = Functions.makeHttpRequest({
  url: url,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    generic_name: drug,
  },
});

const cryptoCompareResponse = await cryptoCompareRequest;
if (cryptoCompareResponse.error) {
  console.error(cryptoCompareResponse.error);
  throw Error("Request failed");
}

const data = cryptoCompareResponse["data"];
if (data.Response === "Error") {
  console.error(data.Message);
  throw Error(`Functional error. Read message: ${data.Message}`);
}

console.log(`${drug} median price is: ${data.median_price}`);
return Functions.encodeUint256(Math.round(data.median_price * 100));
