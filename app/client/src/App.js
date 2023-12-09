import "./App.css";
import { useState, useEffect } from "react";
import PolygonIDVerifier from "./PolygonIDVerifier";
import VcGatedDapp from "./VcGatedDapp";
import { Center } from "@chakra-ui/react";
import axios from "axios";

function App() {
  const [provedPrescription, setProvedPrescription] = useState(false);

  return (
    <>
      {provedPrescription ? (
        <VcGatedDapp />
      ) : (
        <Center className="vc-check-page">
        <div style={{textAlign: "center"}}>
          <PolygonIDVerifier
            publicServerURL={process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL}
            localServerURL={process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL}
            onVerificationResult={setProvedPrescription}
            schema={`ipfs://QmYVMoLtzVBsRXUizZj4JxgbiGhnskrLF42fbKjd5bJ993`}
            wallet_address={"0xbdA087c59180Ee0E6e660591e907F59DcC30f0EF"}
            license_number={"123456789"}
          />
        </div>
      </Center>
      )}
    </>
  );
}

export default App;
