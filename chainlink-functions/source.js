const drug = args[0];
const prices = [];

// REQUEST AND GET RESPONSE FROM PROVIDERS //

console.log(`HTTP GET Request to https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/watsons/2023/?drug_name=${drug}`);
const watsonsRequest = Functions.makeHttpRequest({
  url: "https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/watsons/2023",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    drug_name: drug,
  }
}).catch((error) => {
  console.log(error);
})

const watsonsResponse = await watsonsRequest;
if (!watsonsResponse.error) {
  const min = watsonsResponse.data.reduce((min, current) => {
    return (current.price < min.price) ? current : min;
  })
  prices.push(min.price)
} else {
  console.log('watsonsResponse error', watsonsResponse.message);
}

console.log(`HTTP GET Request to https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/southstar/2023/?drug_name=${drug}`);
const southstarRequest = Functions.makeHttpRequest({
  url: "https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/southstar/2023",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    drug_name: drug,
  }
}).catch((error) => {
  console.log(error);
})

const southstarResponse = await southstarRequest;
if (!southstarResponse.error) {
  const min = southstarResponse.data.reduce((min, current) => {
    return (current.price < min.price) ? current : min;
  })
  prices.push(min.price)
} else {
  console.log('southstarResponse error', southstarResponse.message);
}

console.log(`HTTP GET Request to https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/mercury/2023/?drug_name=${drug}`);
const ahmcRequest = Functions.makeHttpRequest({
  url: "https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/mercury/2023",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    drug_name: drug,
  }
}).catch((error) => {
  console.log(error);
})

const ahmcResponse = await ahmcRequest;
if (!ahmcResponse.error) {
  const min = ahmcResponse.data.reduce((min, current) => {
    return (current.price < min.price) ? current : min;
  })
  prices.push(min.price)
} else {
  console.log('ahmcResponse Error', ahmcResponse.message);
}

console.log(`HTTP GET Request to https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/ahmc/2023/?drug_name=${drug}`);
const mercuryRequest = Functions.makeHttpRequest({
  url: "https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/ahmc/2023",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    drug_name: drug,
  }
}).catch((error) => {
  console.log(error);
})

const mercuryResponse = await mercuryRequest;
if (!mercuryResponse.error) {
  const min = mercuryResponse.data.reduce((min, current) => {
    return (current.price < min.price) ? current : min;
  })
  prices.push(min.price)
} else {
  console.log('mercuryResponse error', mercuryResponse.message);
}

console.log(`HTTP GET Request to https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/mmc/2023/?drug_name=${drug}`);
const mmcRequest = Functions.makeHttpRequest({
  url: "https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/mmc/2023",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    drug_name: drug,
  }
}).catch((error) => {
  console.log(error);
})

const mmcResponse = await mmcRequest;
if (!mmcResponse.error) {
  const min = mmcResponse.data.reduce((min, current) => {
    return (current.price < min.price) ? current : min;
  })
  prices.push(min.price)
} else {
  console.log('mmcResponse error', mmcResponse.message);
}

if (prices.length < 3) {
  throw Error("More than 2 API failed.")
}

const lowest_price = Math.min(...prices)
console.log(`The lowest price of ${drug}: $${lowest_price.toFixed(2)}`);

return Functions.encodeUint256(Math.round(lowest_price * 100));