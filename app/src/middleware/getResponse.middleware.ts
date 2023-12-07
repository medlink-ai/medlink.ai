import axios from 'axios';

interface ProductData {
    p: number;
    b: string;
}

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

export const getResponseProvider = async (data: any): Promise<any | null> => {
    try {        
        const parsedData: ProductData[] = JSON.parse(data);

        const results = await Promise.all(parsedData.map(async (item) => {
            const { p: providerCode, b: productCode } = item;

            const response = await axios.get(`https://a8apalgxk8.execute-api.ap-southeast-1.amazonaws.com/dev/codes-to-verifier/?provider_code=${providerCode}&product_code=${productCode}`);
            return response.data;
        }));

        return results;
    } catch (error) {
        console.log('Cannot fetch the verifiers data.', error);
        return null;
    }
};

export default { getResponsePriceIndex, getResponseProvider };