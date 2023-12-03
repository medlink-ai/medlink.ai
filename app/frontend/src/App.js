import "./App.css";
import { useState } from "react";
import PolygonIDVerifier from "./PolygonIDVerifier";
import VcGatedDapp from "./VcGatedDapp";
import { Center, Card, CardBody, Container } from "@chakra-ui/react";

function App() {
  // if you're developing and just want to see the dapp without going through the Polygon ID flow,
  // temporarily set this to "true" to ignore the Polygon ID check and go straight to the dapp page
  const [provedPrescription, setProvedPrescription] = useState(false);
  return (
    <>
      {provedPrescription ? (
        <VcGatedDapp />
      ) : (
        <Center className="vc-check-page">
          <Container>
            <Card>
              <CardBody>
                <PolygonIDVerifier
                  publicServerURL={process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL}
                  localServerURL={process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL}
                  credentialType={"DrugPrescription"}
                  onVerificationResult={setProvedPrescription}
                />
              </CardBody>
            </Card>
          </Container>
        </Center>
      )}
    </>
  );
}

export default App;
