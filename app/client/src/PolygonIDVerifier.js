import React, { useState, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

function PolygonIDVerifier({
  onVerificationResult,
  publicServerURL,
  localServerURL,
  schema,
  walletAddress,
  licenseNumber,
}) {
  const [sessionId, setSessionId] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isHandlingVerification, setIsHandlingVerification] = useState(false);
  const [verificationCheckComplete, setVerificationCheckComplete] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [socketEvents, setSocketEvents] = useState([]);
  const serverUrl = window.location.href.startsWith("https") ? publicServerURL : localServerURL;
  const socket = io(serverUrl);

  useEffect(() => {
    socket.on("connect", () => {
      setSessionId(socket.id);
      socket.on(socket.id, (arg) => {
        setSocketEvents((socketEvents) => [...socketEvents, arg]);
      });
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch(getQrCodeApi());
        const data = await response.text();
        setQrCodeData(JSON.parse(data));
      } catch (error) {
        console.error(error);
      }
    };

    if (sessionId) {
      fetchQrCode();
    }
    // eslint-disable-next-line
  }, [sessionId]);

  useEffect(() => {
    if (socketEvents.length) {
      const currentSocketEvent = socketEvents[socketEvents.length - 1];
      if (currentSocketEvent.fn === "handleVerification") {
        handleVerificationEvent(currentSocketEvent.status);
      }
    }
    // eslint-disable-next-line
  }, [socketEvents]);

  const handleVerificationEvent = (status) => {
    setIsHandlingVerification(status === "IN_PROGRESS");
    setVerificationCheckComplete(true);

    if (status === "DONE") {
      setVerificationMessage("✅ Prescription medicine proof validated");
      setTimeout(() => {
        reportVerificationResult(true);
        socket.close();
      }, 2000);
    } else {
      setVerificationMessage("Error verifying prescription");
    }
  };

  const reportVerificationResult = (result) => {
    onVerificationResult(result);
  };

  const getQrCodeApi = () => {
    const queryParams = {sessionId, schema: encodeURIComponent(schema), walletAddress: encodeURIComponent(walletAddress), licenseNumber: encodeURIComponent(licenseNumber) };
    const queryString = Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join("&");
    return (
      `${serverUrl}/api/get-med-auth-qr?${queryString}`
    );
  };

  return (
    <div>
      {qrCodeData && (
        <div>
          {isHandlingVerification && (
            <div>
              <p>Authenticating...</p>
              <Spinner size="xl" colorScheme="teal" my={2} />
            </div>
          )}
          <div>{verificationMessage}</div>
          {qrCodeData && !isHandlingVerification && !verificationCheckComplete && (
            <div marginBottom={1}>
              <QRCode value={JSON.stringify(qrCodeData)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PolygonIDVerifier;
