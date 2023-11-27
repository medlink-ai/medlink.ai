# Chainlink Functions Application

## Introduction

Welcome to the Chainlink Functions Application! This application allows you to deploy smart contracts, create subscriptions, and request price indexes for specific drugs from different providers using the Chainlink network.

## Prerequisites

Before you start using this application, make sure you have the following:

- **Node.js:** Ensure that Node.js is installed on your machine.
- **npm or yarn:** Use either npm or yarn as your package manager.
- **Matic and Link Tokens:** You must have at least 2 Matic tokens and 10 Link tokens available.

## Getting Started

Follow these steps to set up and run the Chainlink Functions Application:

1. **Clone Repository:**
   ```bash
   git clone [repository_url]
   cd app

2. **Install Dependencies:**
    npm install **or** yarn install

3. **Create .env file:**
    Copy the contents of .env.example and fill in each environment variables with correct information

3. **Run the Server:**
    yarn run dev **or** npm run dev

If the server is configured correctly, you should see the message "App is listening on port 8888."

## Deploying Functions Consumer Contract and Creating Subscription

1. **Open Postman:**
    Open Postman and create a new request.

2. **Configure Request:**
    Method: POST
    URL: localhost:8888/api/chainlink-functions/functions-consumer-subscription
    Body: Raw JSON

    ```bash
    {
        "NETWORK": "polygonMumbai"
    }

    Click Send.
    
This request deploys the FunctionsConsumer contract on the Polygon Mumbai network, creates a Subscription Manager at Chainlink, funds the subscription ID with 5 Link tokens, and saves the subscriptionId and the consumerAddress locally. Once the request is successful (status code 200), proceed to the next step.

## Requesting Drug Price Index

1. **Configure New Request:**
    Method: POST
    URL: localhost:8888/api/chainlink-functions/functions-request-response
    Body: Raw JSON

    ```bash
    {
        "drug_details": "Losartan 50mg Film-Coated Tablet"
    }

    Click Send.
    
This request will retrieve the price index of the drug "Losartan 50mg Film-Coated Tablet" from different providers, providing the lowest price, median price, and highest price of the requested drug.