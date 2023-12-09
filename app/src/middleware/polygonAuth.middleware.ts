import { Request, Response } from 'express';
import { Server } from 'socket.io';
import getRawBody from 'raw-body';
import { auth, resolver } from '@iden3/js-iden3-auth';
import path from 'path';

import "dotenv/config";

const STATUS = {
    IN_PROGRESS: 'IN_PROGRESS',
    ERROR: 'ERROR',
    DONE: 'DONE',
}

const socketMessage = (fn: string, status: string, data: any) => ({
    fn,
    status,
    data,
});

const requestMap = new Map();

export async function getAuthQr(req: Request, res: Response, io: Server, schema: string, verifier: string, max_range: number, min_range: number, patient_wallet_add: string): Promise<Response> {
    const sessionId = req.query.sessionId as string;

    io.sockets.emit(sessionId, socketMessage('getAuthQr', STATUS.IN_PROGRESS, sessionId));

    const uri = `${process.env.HOSTED_SERVER_URL as string}/api/verification-callback?sessionId=${sessionId}`;
    const request = auth.createAuthorizationRequest('test flow', process.env.VERIFIER_DID as string, uri);
    const company = verifier;
    request.id = sessionId;
    request.thid = sessionId;
    request.body.message = company;

    const scopes = [
        {
            id: 1,
            circuitId: 'credentialAtomicQuerySigV2',
            query: {
                allowedIssuers: ['*'],
                type: 'PrescriptionMedicine',
                context: schema,
                credentialSubject: {
                    patient_wallet_address: { $eq: patient_wallet_add },
                },
            }
        },
        {
            id: 2,
            circuitId: 'credentialAtomicQuerySigV2',
            query: {
                allowedIssuers: ['*'],
                type: 'PrescriptionMedicine',
                context: schema,
                credentialSubject: {
                    min_code: { $gt: min_range },
                },
            }
        },
        {
            id: 3,
            circuitId: 'credentialAtomicQuerySigV2',
            query: {
                allowedIssuers: ['*'],
                type: 'PrescriptionMedicine',
                context: schema,
                credentialSubject: {
                    max_code: { $lt: max_range },
                },
            }
        },
        {
            id: 4,
            circuitId: 'credentialAtomicQuerySigV2',
            query: {
                allowedIssuers: ['*'],
                type: 'PrescriptionMedicine',
                context: schema,
                credentialSubject: {
                    expiration_date: { $lt: 20240106 },
                },
            }
        },
        
    ];

    request.body.scope = [...request.body.scope ?? [], ...scopes];
    requestMap.set(sessionId, request);

    console.log(`Auth request added to map for session ID: ${sessionId}`);

    return res.status(200).json(request);
}

export async function handleVerification(req: Request, res: Response, io: Server): Promise<Response> {
    const sessionId = req.query.sessionId as string;
    console.log(`Handling verification for session ID: ${sessionId}`);

    const authRequest = requestMap.get(sessionId);

    if (!authRequest) {
        console.error(`Auth request not found for session ID: ${sessionId}`);
        return res.status(400).json({ error: 'Auth request not found' });
    }

    io.sockets.emit(sessionId, socketMessage('handleVerification', STATUS.IN_PROGRESS, authRequest));

    const raw = await getRawBody(req);
    const tokenStr = raw.toString().trim();

    const mumbaiContractAddress = '0x134B1BE34911E39A8397ec6289782989729807a4';
    const keyDir = '../../keys';

    const ethStateResolver = new resolver.EthStateResolver(process.env.RPC_URL as string, mumbaiContractAddress);

    const resolvers = {
        ['polygon:mumbai']: ethStateResolver,
    }

    const verifier = await auth.Verifier.newVerifier({
        stateResolver: resolvers,
        circuitsDir: path.join(__dirname, keyDir),
        ipfsGatewayURL:"https://ipfs.io"
    })

    try {
		const authResponse = await verifier.fullVerify(tokenStr, authRequest);
        console.log(authResponse);
		const userId = authResponse.from;
		io.sockets.emit(
			sessionId,
			socketMessage('handleVerification', STATUS.DONE, { message: `User ${userId} successfully authenticated` })
		);
		return res.status(200).json({ message: `User ${userId} successfully authenticated` });
    } catch (error:any) {
        console.error(`Error in handleVerification: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getAuthQrMed(req: Request, res: Response, io: Server, schema: string, walletAddress: string, licenseNumber: number): Promise<Response> {
    const sessionId = req.query.sessionId as string;

    io.sockets.emit(sessionId, socketMessage('getAuthQr', STATUS.IN_PROGRESS, sessionId));

    const uri = `${process.env.HOSTED_SERVER_URL as string}/api/verification-callback?sessionId=${sessionId}`;
    const request = auth.createAuthorizationRequest('test flow', process.env.VERIFIER_DID as string, uri);

    request.id = sessionId;
    request.thid = sessionId;

    const scopes = [
        {
            id: 1,
            circuitId: 'credentialAtomicQuerySigV2',
            query: {
                allowedIssuers: ['*'],
                type: 'LicenseValidation',
                context: schema,
                credentialSubject: {
                    license_number: { $eq: licenseNumber },
                },
            }
        }
    ];

    request.body.scope = [...request.body.scope ?? [], ...scopes];
    requestMap.set(sessionId, request);

    console.log(`Auth request added to map for session ID: ${sessionId}`);

    return res.status(200).json(request);
}