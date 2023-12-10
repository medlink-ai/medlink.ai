import { DrugDetails, ProviderDetail } from "./types";

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

const MockProviders: ProviderDetail[] = [
    {
        code: "100000",
        product_name: "Metformin 500mg Tablet",
        prescription_drug: true,
        indication: "Used in the treatment of obstructive airway diseases.",
        provider: "Mercury Drug",
        provider_code: 1,
        min_range: "100001",
        max_range: "100499",
    },
    {
        code: "100001",
        product_name: "Metformin 500mg Tablet",
        prescription_drug: true,
        indication: "Used in the treatment of obstructive airway diseases.",
        provider: "Sunshine Pharmacy",
        provider_code: 2,
        min_range: "100002",
        max_range: "100500",
    },
    {
        code: "100002",
        product_name: "Metformin 500mg Tablet",
        prescription_drug: true,
        indication: "Used in the treatment of obstructive airway diseases.",
        provider: "Watsons Pharmacy",
        provider_code: 3,
        min_range: "100003",
        max_range: "100501",
    },
    {
        code: "100003",
        product_name: "Metformin 500mg Tablet",
        prescription_drug: true,
        indication: "Used in the treatment of obstructive airway diseases.",
        provider: "Guardian Pharmacy",
        provider_code: 4,
        min_range: "100004",
        max_range: "100502",
    },
    {
        code: "100003",
        product_name: "Metformin 500mg Tablet",
        prescription_drug: true,
        indication: "Used in the treatment of obstructive airway diseases.",
        provider: "Guardian Pharmacy",
        provider_code: 4,
        min_range: "100004",
        max_range: "100502",
    },
    {
        code: "100003",
        product_name: "Metformin 500mg Tablet",
        prescription_drug: true,
        indication: "Used in the treatment of obstructive airway diseases.",
        provider: "Guardian Pharmacy",
        provider_code: 4,
        min_range: "100004",
        max_range: "100502",
    },
    {
        code: "100003",
        product_name: "Metformin 500mg Tablet",
        prescription_drug: true,
        indication: "Used in the treatment of obstructive airway diseases.",
        provider: "Guardian Pharmacy",
        provider_code: 4,
        min_range: "100004",
        max_range: "100502",
    },
    {
        code: "100003",
        product_name: "Metformin 500mg Tablet",
        prescription_drug: true,
        indication: "Used in the treatment of obstructive airway diseases.",
        provider: "Guardian Pharmacy",
        provider_code: 4,
        min_range: "100004",
        max_range: "100502",
    },
    {
        code: "100003",
        product_name: "Metformin 500mg Tablet",
        prescription_drug: true,
        indication: "Used in the treatment of obstructive airway diseases.",
        provider: "Guardian Pharmacy",
        provider_code: 4,
        min_range: "100004",
        max_range: "100502",
    },
];

export { Role, MockDrugDetails, MockProviders };
