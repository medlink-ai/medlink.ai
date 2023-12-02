const express = require('express'); // included
const { Server } = require('socket.io');
const cors = require('cors'); //included
const getRawBody = require('raw-body');
const { auth, resolver, loaders } = require('@iden3/js-iden3-auth');
const path = require('path');

require('dotenv').config();

const app = express();
const port = 8080;

app.use(cors({ origin: process.env.FRONTEND_URL }));

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

const STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR',
  DONE: 'DONE',
};

const socketMessage = (fn, status, data) => ({
  fn,
  status,
  data,
});

const requestMap = new Map();

app.get('/', (_req, res) => {
  res.send('Welcome to your backend Polygon ID verifier server!');
});

app.get('/api/get-auth-qr', (req, res) => {
  getAuthQr(req, res);
});

app.post('/api/verification-callback', (req, res) => {
  handleVerification(req, res);
});

async function getAuthQr(req, res) {
  const sessionId = req.query.sessionId;

  io.sockets.emit(
    sessionId,
    socketMessage('getAuthQr', STATUS.IN_PROGRESS, sessionId)
  );

  const uri = `${process.env.HOSTED_SERVER_URL}/api/verification-callback?sessionId=${sessionId}`;

  const request = auth.createAuthorizationRequest(
    'test flow',
    process.env.VERIFIER_DID,
    uri
  );

  request.id = sessionId;
  request.thid = sessionId;

  const proofRequest = {
    id: 1,
    circuitId: 'credentialAtomicQuerySigV2',
    query: {
      allowedIssuers: ['*'],
      type: 'DrugPrescription',
      context: 'ipfs://QmTai1aGTBXMVBP1yUYXjp3fuNjpoAmRxpA8dz1QFziQx2',
      credentialSubject: {
        drug_code: {
          $gt: 100501,
        },
      },
    },
  };

  const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];

  requestMap.set(sessionId, request);

  io.sockets.emit(sessionId, socketMessage('getAuthQr', STATUS.DONE, request));

  return res.status(200).json(request);
}

async function handleVerification(req, res) {
	const sessionId = req.query.sessionId;
	const authRequest = requestMap.get(sessionId);
	
	io.sockets.emit(
		sessionId,
		socketMessage('handleVerification', STATUS.IN_PROGRESS, authRequest)
	);

  	const raw = await getRawBody(req);
  	const tokenStr = raw.toString().trim();

  	const mumbaiContractAddress = '0x134B1BE34911E39A8397ec6289782989729807a4';
 	 const keyDIR = './keys';

	const ethStateResolver = new resolver.EthStateResolver(
		process.env.RPC_URL_MUMBAI,
		mumbaiContractAddress
	);

	const resolvers = {
		['polygon:mumbai']: ethStateResolver,
	};

	const verifier = await auth.Verifier.newVerifier(
		{
			stateResolver: resolvers,
			circuitsDir: path.join(__dirname, keyDIR),
			ipfsGatewayURL:"https://ipfs.io"
		}
	);


	try {
		const opts = {
			AcceptedStateTransitionDelay: 5 * 60 * 1000,
		};
		const authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);
		const userId = authResponse.from;
		io.sockets.emit(
			sessionId,
			socketMessage('handleVerification', STATUS.DONE, authResponse)
		);
		return res
			.status(200)
			.json({ message: `User ${userId} successfully authenticated` });
	} catch (error) {
		console.log(
			'Error handling verification: Double-check the value of your RPC_URL_MUMBAI in the .env file. Are you using a valid API key for Polygon Mumbai from your RPC provider? Visit https://alchemy.com/?r=zU2MTQwNTU5Mzc2M and create a new app with Polygon Mumbai'
		);
		console.log('handleVerification error', sessionId, error);
		io.sockets.emit(
			sessionId,
			socketMessage('handleVerification', STATUS.ERROR, error)
		);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
}
