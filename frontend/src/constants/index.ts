import { DrugDetails } from "./types";

enum Role {
    PATIENT = "Patient",
    DOCTOR = "Doctor",
    BOT = "Bot",
}

const MockDrugDetails: DrugDetails = {
    code: "100000",
    range_start: "100001",
    range_end: "100499",
    product_name: "Losartan 50mg Tablet",
    generic_name: "Losartan Potassium",
    dosage_strength: "50mg",
    dosage_form: "Tablet",
    indication: "Used in the treatment of obstructive airway diseases.",
    price_index: [
        {
            lowest_price: 10.84,
        },
        {
            median_price: 18.05,
        },
        {
            highest_price: 25.25,
        },
    ],
};

const MockProviders = [
    {
        issuerOrHowToLink: "https://google.com",
        credentialType: "DrugPrescription",
        information: {
            drugName: "Metformin 1g Extended-Release Tablet",
            storeName: "Pharmacy A Drug Store",
            description: "Used in the treatment of diabetes",
        },
    },
    {
        issuerOrHowToLink: "https://chain.link",
        credentialType: "DrugPrescription",
        information: {
            drugName: "Metformin 1g Extended-Release Tablet",
            storeName: "Pharmacy B Drug Store",
            description: "Used in the treatment of diabetes",
        },
    },
    {
        issuerOrHowToLink: "https://nextjs.org/",
        credentialType: "DrugPrescription",
        information: {
            drugName: "Metformin 1g Extended-Release Tablet",
            storeName: "Pharmacy C Drug Store",
            description: "Used in the treatment of diabetes",
        },
    },
    {
        issuerOrHowToLink: "https://nextjs.org/",
        credentialType: "DrugPrescription",
        information: {
            drugName: "Metformin 1g Extended-Release Tablet",
            storeName: "Pharmacy C Drug Store",
            description: "Used in the treatment of diabetes",
        },
    },
    {
        issuerOrHowToLink: "https://nextjs.org/",
        credentialType: "DrugPrescription",
        information: {
            drugName: "Metformin 1g Extended-Release Tablet",
            storeName: "Pharmacy D Drug Store",
            description: "Used in the treatment of diabetes",
        },
    },
    {
        issuerOrHowToLink: "https://nextjs.org/",
        credentialType: "DrugPrescription",
        information: {
            drugName: "Metformin 1g Extended-Release Tablet",
            storeName: "Pharmacy E Drug Store",
            description: "Used in the treatment of diabetes",
        },
    },
    {
        issuerOrHowToLink: "https://nextjs.org/",
        credentialType: "DrugPrescription",
        information: {
            drugName: "Metformin 1g Extended-Release Tablet",
            storeName: "Pharmacy F Drug Store",
            description: "Used in the treatment of diabetes",
        },
    },
    {
        issuerOrHowToLink: "https://nextjs.org/",
        credentialType: "DrugPrescription",
        information: {
            drugName: "Metformin 1g Extended-Release Tablet",
            storeName: "Pharmacy G Drug Store",
            description: "Used in the treatment of diabetes",
        },
    },
];

export { Role, MockDrugDetails };
