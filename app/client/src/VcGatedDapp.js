import React, { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  Spinner,
  Text,
  VStack,
  Input,
} from "@chakra-ui/react";

const USD_TO_MATIC_EXCHANGE_RATE = 0.01;

function MedicineStore({item, amount}) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder for medicine details
  const medicineDetails = {
    name: "metformin",
    priceUSD: parseFloat(amount), // Add your actual price in USD
  };

  const totalPriceUSD = (quantity * medicineDetails.priceUSD).toFixed(2);
  const totalPriceMatic = (totalPriceUSD * USD_TO_MATIC_EXCHANGE_RATE).toFixed(4);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handlePay = async () => {
    setIsLoading(true);
    setTimeout(() => {
      alert(`Order confirmed for ${quantity} ${medicineDetails.name}`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Box mt={"100px"} textAlign="center">
      <Container
        maxW="3xl"
        p={6}
      >
        <Heading fontSize="6xl" mb={1}>
          Confirm Your Order
        </Heading>
        <Text mb={20} fontSize="lg" color="gray.600">
          Please review and confirm your medicine order.
        </Text>

        <VStack align="center" spacing={4} mb={20}>
          <Flex>
            <Box marginEnd={"100px"}>
              <Text fontSize="md" fontWeight="bold" marginBottom={"20px"}>
                Medicine:
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="teal">{medicineDetails.name}</Text>
            </Box>

            <Box>
              <Text fontSize="md" fontWeight="bold" marginBottom={"10px"}>
                Quantity:
              </Text>
              <Flex align="center">
                <Button size="sm" onClick={handleDecrement} disabled={quantity === 1} marginEnd={"5px"}>
                  -
                </Button>
                <Input
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  textAlign="center"
                  w="50px"  // Adjusted width for better visibility
                  isReadOnly
                />
                <Button size="sm" onClick={handleIncrement} marginStart={"5px"}>
                  +
                </Button>
              </Flex>
            </Box>

            <Box marginStart={"50px"}>
              <Text fontSize="md" fontWeight="bold" marginBottom={"10px"}>
                Total Prices:
              </Text>
              <VStack align="center" spacing={0.25}>
                <Text fontSize="md" fontWeight="bold">{totalPriceMatic} MATIC</Text>
                <Text fontSize="xs">${totalPriceUSD} USD</Text>

              </VStack>
            </Box>
          </Flex>
        </VStack>

        <Flex justify="center" mt={6}>
          <Button
            variant="outline"
            size="lg"
            width={"md"}
            colorScheme="gray"
            onClick={() => window.history.back()}
            mr={2}
          >
            Cancel
          </Button>
          <Button size="lg" width={"md"} onClick={handlePay} colorScheme="teal">
            {isLoading ? <Spinner size="sm" /> : "Confirm Order"}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}

export default MedicineStore;
