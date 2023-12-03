import { useState, useEffect } from "react";
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
  Spinner,
  Center,
  Box,
  Text
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import QRCode from "react-qr-code";

import { io } from "socket.io-client";

const linkDownloadPolygonIDWalletApp =
  "https://0xpolygonid.github.io/tutorials/wallet/wallet-overview/#quick-start";

function PolygonIDVerifier({ credentialType, issuerOrHowToLink, onVerificationResult, publicServerURL, localServerURL, }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sessionId, setSessionId] = useState("");
  const [qrCodeData, setQrCodeData] = useState();
  const [isHandlingVerification, setIsHandlingVerification] = useState(false);
  const [verificationCheckComplete, setVerificationCheckComplete] = useState(false);
  const [verificationMessage, setVerfificationMessage] = useState("");
  const [socketEvents, setSocketEvents] = useState([]);

  // serverUrl is localServerURL if not running in prod
  // Note: the verification callback will always come from the publicServerURL
  const serverUrl = window.location.href.startsWith("https") ? publicServerURL : localServerURL;

  const getQrCodeApi = (sessionId) => serverUrl + `/api/get-auth-qr?sessionId=${sessionId}`;

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
      const response = await fetch(getQrCodeApi(sessionId));
      const data = await response.text();
      console.log(data);
      return JSON.parse(data);
    };

    if (sessionId) {
      fetchQrCode().then(setQrCodeData).catch(console.error);
    }
    // eslint-disable-next-line
  }, [sessionId]);

  // socket event side effects
  useEffect(() => {
    if (socketEvents.length) {
      const currentSocketEvent = socketEvents[socketEvents.length - 1];

      if (currentSocketEvent.fn === "handleVerification") {
        if (currentSocketEvent.status === "IN_PROGRESS") {
          setIsHandlingVerification(true);
        } else {
          setIsHandlingVerification(false);
          setVerificationCheckComplete(true);
          if (currentSocketEvent.status === "DONE") {
            setVerfificationMessage("✅ Drug prescription proof validated");
            setTimeout(() => {
              reportVerificationResult(true);
            }, "2000");
            socket.close();
          } else {
            setVerfificationMessage("Error verifying prescription");
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [socketEvents]);

  // callback, send verification result back to app
  const reportVerificationResult = (result) => {
    onVerificationResult(result);
  };

  function openInNewTab(url) {
    var win = window.open(url, "_blank");
    win.focus();
  }

  return (
    <div>
      <Box p={4} _hover={{ backgroundColor: "gray.100", border: "1px", borderColor: "gray.300" }} cursor="pointer" onClick={onOpen}>
        <Text fontSize="lg" fontWeight="bold" bgColor="gray.200" padding={"5px"} mb={5}>
          PHARMACY A DRUG STORE
        </Text>
        <Text fontSize="md" color="teal" fontWeight={"bold"} mb={1}>
          Metformin (Glyformet) 500mg Film-Coated Tablet
        </Text>
        <Text fontSize="sm" color="gray.600">
          Used in the treatment of diabetes
        </Text>
      </Box>

      {qrCodeData && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign={"center"} fontSize={"16px"} marginTop={"30px"}>
              To verify your valid drug prescription, please use your Polygon ID Wallet App to scan this QR Code.
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody textAlign={"center"} fontSize={"12px"}>
              {isHandlingVerification && (
                <div>
                  <p style={{fontSize: '16px', fontFamily: "sans-serif"}}>Authenticating...</p>
                  <Spinner size={"xl"} colorScheme="teal" my={2} />
                </div>
              )}
              <Box fontSize={"14px"}>
                {verificationMessage}
              </Box>

              {qrCodeData &&
                !isHandlingVerification &&
                !verificationCheckComplete && (
                  <Center marginBottom={1}>
                    <QRCode value={JSON.stringify(qrCodeData)} />
                  </Center>
                )}
              
              {qrCodeData.body?.scope[0].query && (
                <div style={{marginTop: "10px"}}>
                  <p style={{ fontSize: '16px', fontFamily: "sans-serif" }}><span style={{fontWeight: "bold"}}>Type:</span> {qrCodeData.body?.scope[0].query.type}</p>
                </div>
                )}


              {qrCodeData.body.message &&
                  <p style={{ fontSize: '16px', fontFamily: "sans-serif" }}><span style={{fontWeight: "bold"}}>Verifier:</span> {qrCodeData.body.message}</p>
              }

            </ModalBody>

            <ModalFooter>
              <Button fontSize={"10px"} margin={1} colorScheme="teal" onClick={() => openInNewTab(linkDownloadPolygonIDWalletApp)}>
                Download the Polygon ID Wallet App{" "}
                <ExternalLinkIcon marginLeft={2} />
              </Button>

              <Button fontSize={"10px"} margin={1} colorScheme="teal" onClick={() => openInNewTab(issuerOrHowToLink)}>
                Get a {credentialType} VC <ExternalLinkIcon marginLeft={2} />
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}

export default PolygonIDVerifier;
