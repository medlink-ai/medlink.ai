import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import ErrorMiddleware from "@/middleware/error.middleware";
import Controller from "@/utils/interfaces/controller.interface";
import { getAuthQr, getAuthQrMed, handleMedVerification, handleVerification } from "@/middleware/polygonAuth.middleware";

class App {
    public app: Application;
    public port: number;
    private server: HttpServer;
    private io: SocketServer;

    constructor(controllers: Controller[], port: number) {
        this.app = express();
        this.port = port;
        this.server = new HttpServer(this.app);
        this.io = new SocketServer(this.server, {
            cors: {
                origin: process.env.FRONTEND_URL || "*",
            },
        });

        this.setupMiddleware();
        this.setupRoutes();
        this.setupControllers(controllers);
        this.setupErrorHandling();
        this.setupSocket();
    }

    private setupMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(helmet());
        this.app.use(morgan("dev"));
        this.app.use(cors({ origin: process.env.FRONTEND_URL }));
        this.app.use(compression());
        this.app.use(bodyParser.json());
    }

    private setupRoutes(): void {
        this.app.get("/api/get-auth-qr", (req: Request, res: Response) => {
            const { schema, verifier, max_range, min_range, patient_wallet_address } = req.query;
            getAuthQr(
                req,
                res,
                this.io,
                `${schema}`,
                `${verifier}`,
                parseFloat(`${max_range}`),
                parseFloat(`${min_range}`),
                `${patient_wallet_address}`
            );
        });

        this.app.post("/api/verification-callback", (req: Request, res: Response) => {
            handleVerification(req, res, this.io);
        });

        this.app.get("/api/get-med-auth-qr", (req: Request, res: Response) => {
            const { walletAddress, licenseNumber } = req.query;
            getAuthQrMed(req, res, this.io, parseFloat(`${licenseNumber}`));
        });

        this.app.post("/api/med-verification-callback", (req: Request, res: Response) => {
            handleMedVerification(req, res, this.io);
        });
    }

    private setupControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.app.use("/api", controller.router);
        });
    }

    private setupErrorHandling(): void {
        this.app.use(ErrorMiddleware);
    }

    public listen(): HttpServer {
        const server = this.server.listen(this.port, () => {
            console.log(`App is listening on port ${this.port}`);
        });

        return server;
    }

    private setupSocket(): void {
        let connect = true;
        this.io.on("connection", () => {
            if ("connection") {
                console.log("User is connected to the socket server");
                connect = false;
            }
        });
    }
}

export default App;
