import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Center,
  Box,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

const linkDownloadPolygonIDWalletApp =
  "https://0xpolygonid.github.io/tutorials/wallet/wallet-overview/#quick-start";

interface PolygonIDVerifierProps {
  credentialType: string;
  issuerOrHowToLink: string;
  onVerificationResult: (result: boolean) => void;
  publicServerURL: string;
  localServerURL: string;
  schema: string;
  verifier: string;
  max_range: number;
  min_range: number;
  patient_wallet_address: string;
  item: any; // Replace 'any' with the actual type of 'item'
}

function PolygonIDVerifier({
  credentialType,
  issuerOrHowToLink,
  onVerificationResult,
  publicServerURL,
  localServerURL,
  schema,
  verifier,
  max_range,
  min_range,
  patient_wallet_address,
  item,
}: PolygonIDVerifierProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sessionId, setSessionId] = useState<string>("");
  const [qrCodeData, setQrCodeData] = useState<any>(); // Replace 'any' with the actual type of 'qrCodeData'
  const [isHandlingVerification, setIsHandlingVerification] =
    useState<boolean>(false);
  const [verificationCheckComplete, setVerificationCheckComplete] =
    useState<boolean>(false);
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [socketEvents, setSocketEvents] = useState<any[]>([]); // Replace 'any' with the actual type of 'socketEvents'

  // serverUrl is localServerURL if not running in prod
  // Note: the verification callback will always come from the publicServerURL
  const serverUrl = window.location.href.startsWith("https")
    ? publicServerURL
    : localServerURL;

  const getQrCodeApi = (
    sessionId: string,
    schema: string,
    verifier: string,
    max_range: number,
    min_range: number,
    patient_wallet_address: string
  ) =>
    `${serverUrl}/api/get-auth-qr?sessionId=${sessionId}&schema=${encodeURIComponent(
      schema
    )}&verifier=${encodeURIComponent(
      verifier
    )}&max_range=${max_range}&min_range=${min_range}&patient_wallet_address=${patient_wallet_address}`;

  const socket = io(serverUrl);

  useEffect(() => {
    socket.on("connect", () => {
      setSessionId(socket.id);

      // only watch this session's events
      socket.on(socket.id, (arg) => {
        setSocketEvents((socketEvents) => [...socketEvents, arg]);
      });
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch(
          getQrCodeApi(
            sessionId,
            schema,
            verifier,
            max_range,
            min_range,
            patient_wallet_address
          )
        );
        const data = await response.json();
        setQrCodeData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (sessionId) {
      fetchQrCode();
    }
    // eslint-disable-next-line
  }, [sessionId]);

  // socket event side effects
  useEffect(() => {
    if (socketEvents && socketEvents.length) {
      const currentSocketEvent = socketEvents[socketEvents.length - 1];

      if (currentSocketEvent.fn === "handleVerification") {
        if (currentSocketEvent.status === "IN_PROGRESS") {
          setIsHandlingVerification(true);
        } else {
          setIsHandlingVerification(false);
          setVerificationCheckComplete(true);
          if (currentSocketEvent.status === "DONE") {
            setVerificationMessage("✅ Prescription medicine proof validated");
            setTimeout(() => {
              reportVerificationResult(true);
            }, 2000);
            socket.close();
          } else {
            setVerificationMessage("Error verifying prescription");
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [socketEvents]);

  // callback, send verification result back to app
  const reportVerificationResult = (result: boolean) => {
    onVerificationResult(result);
  };

  function openInNewTab(url: string) {
    var win = window.open(url, "_blank");
    if (win) {
      win.focus();
    }
  }

  return (
    <div>
      <Box p={4} _hover={{ backgroundColor: "gray.100", border: "1px", borderColor: "gray.300" }} cursor="pointer" onClick={onOpen}>
        <Text fontSize="lg" fontWeight="bold" bgColor="gray.200" padding={"5px"} mb={5}>
          {verifier}
        </Text>
        <Text fontSize="md" color="teal" fontWeight={"bold"} mb={1}>
          {item.product_name}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {item.indication}
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {qrCodeData && !isHandlingVerification && !verificationCheckComplete && (
              <Center marginBottom={1}>
                <QRCode value={JSON.stringify(qrCodeData)} />
              </Center>
            )}

            {qrCodeData && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                  <span style={{ fontWeight: "bold" }}>Type:</span>{" "}
                  {qrCodeData.body?.scope[0].query.type}
                </p>
              </div>
            )}

            {qrCodeData && (
              <p style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                <span style={{ fontWeight: "bold" }}>Verifier:</span>{" "}
                {qrCodeData.body.message}
              </p>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              fontSize={"10px"}
              margin={1}
              colorScheme="teal"
              onClick={() => openInNewTab(linkDownloadPolygonIDWalletApp)}
            >
              Download the Polygon ID Wallet App{" "}
              <ExternalLinkIcon marginLeft={2} />
            </Button>

            <Button
              fontSize={"10px"}
              margin={1}
              colorScheme="teal"
              onClick={() => openInNewTab(issuerOrHowToLink)}
            >
              Get a {credentialType} VC <ExternalLinkIcon marginLeft={2} />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default PolygonIDVerifier;
