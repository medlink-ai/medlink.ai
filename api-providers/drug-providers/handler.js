const watsons = require('./watsons.json');

'use strict';

async function searchProduct(productName, data_source) {
  try {
    let result = [];
    let regex = new RegExp(productName, 'i'); 
    for (let i = 0; i < data_source.drugs.length; i++) {
      for (let j = 0; j < data_source.drugs[i].product_name.length; j++) {
        if (data_source.drugs[i].product_name[j].match(regex)) { 
          let drug = {
            generic_name: data_source.drugs[i].generic_name,
            dosage_strength: data_source.drugs[i].dosage_strength,
            dosage_form: data_source.drugs[i].dosage_form,
            indication: data_source.drugs[i].indication,
            price: data_source.drugs[i].price,
            discounted_price: data_source.drugs[i].discounted_price
          };
          if (!result.some(r => JSON.stringify(r) === JSON.stringify(drug))) {
            result.push(drug);
          }
          break; 
        }
      }
    }

    if (result.length > 0) {
      let groups = {};
      for (let i = 0; i < result.length; i++) {
        let key = `${result[i].generic_name} ${result[i].dosage_strength} ${result[i].dosage_form}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(result[i]);
      }

      let finalResult = [];
      for (let key in groups) {
        let group = groups[key];
        group.sort((a, b) => a.discounted_price - b.discounted_price);
        let lowestPrice = group[0].discounted_price;
        group.sort((a, b) => a.price - b.price);
        let highestPrice = group[group.length - 1].price;
        let prices = group.map(drug => drug.price).concat(group.map(drug => drug.discounted_price));
        prices.sort((a, b) => a - b);
        let medianPrice;
        if (prices.length % 2 === 0) {
          medianPrice = (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2;
        } else {
          medianPrice = prices[Math.floor(prices.length / 2)];
        }
        finalResult.push({
          generic_name: group[0].generic_name,
          dosage_strength: group[0].dosage_strength,
          dosage_form: group[0].dosage_form,
          indication: group[0].indication,
          lowest_price: lowestPrice,
          median_price: medianPrice,
          highest_price: highestPrice
        });
      }

      console.log(finalResult);
      return finalResult;
    } else {
      return "Product not available";
    }
  } catch (error) {
    console.log(error);
  }
}

const watson = async (event) => {
  // const productName = event.queryStringParameters.product_name;
  const details = await searchProduct(event, watsons);
  return {
    statusCode: 200,
    body: JSON.stringify(details),
  };
};

watson("Salbutamol")