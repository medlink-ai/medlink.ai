import axios from 'axios';

export const getResponsePriceIndex = async (data: any): Promise<void | null> => {
    try {        
        const parsedData = JSON.parse(data);
        const drug = parsedData.drug;

        let result = await axios.get(`https://x66uswgv0g.execute-api.ap-southeast-1.amazonaws.com/dev/codes-to-generics?product_name=${drug}`);

        result.data.price_index.push({ "lowest_price" : parsedData.min });
        result.data.price_index.push({ "median_price" : parsedData.med });
        result.data.price_index.push({ "highest_price" : parsedData.max });

        const response = result.data;
        
        return response;
    } catch (error) {
        console.log('Cannot fetch the code to generics data.', error);
        return null;
    }
};

export const getResponseProvider = async (data: any): Promise<any[] | null> => {
    try {
        const parsedData = JSON.parse(data);
        const promises: Promise<any>[] = [];

        for (const item of parsedData) {
            const { p: providerCode, b: productCode } = item;
            const promise = axios.get(`https://a8apalgxk8.execute-api.ap-southeast-1.amazonaws.com/dev/codes-to-verifier/?provider_code=${providerCode}&product_code=${productCode}`);
            promises.push(promise);
        }

        const responses = await Promise.all(promises);
        const responseData = responses.map(response => response.data);

        const parsedData2 = JSON.parse(data);
        const promises2: Promise<any>[] = [];

        for (const item of parsedData2) {
            const { p: providerCode, b: productCode } = item;
            const promise = axios.get(`https://a8apalgxk8.execute-api.ap-southeast-1.amazonaws.com/dev/codes-to-verifier/?provider_code=${providerCode}&product_code=${productCode}`);
            promises2.push(promise);
        }

        const responses2 = await Promise.all(promises2);
        const responseData2 = responses2.map(response => response.data);

        if (arraysAreEqual(responseData, responseData2)) {
            const parsedData3 = JSON.parse(data);
            const promises3: Promise<any>[] = [];

            for (const item of parsedData3) {
                const { p: providerCode, b: productCode } = item;
                const promise = axios.get(`https://a8apalgxk8.execute-api.ap-southeast-1.amazonaws.com/dev/codes-to-verifier/?provider_code=${providerCode}&product_code=${productCode}`);
                promises3.push(promise);
            }

            const responses3 = await Promise.all(promises3);
            const responseData3 = responses3.map(response => response.data);

            return responseData3;
        } else {
            return responseData2;
        }
    } catch (error) {
        console.log('Cannot fetch the verifiers data.', error);
        return null;
    }
};


const arraysAreEqual = (arr1: any[], arr2: any[]): boolean => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
};

export default { getResponsePriceIndex, getResponseProvider };