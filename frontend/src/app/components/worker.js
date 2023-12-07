import { pipeline } from "@xenova/transformers";
import dayjs from "dayjs";

class MyQuestionAnsweringPipeline {
    static instance = null;
    static modelLoaded = false;

    constructor() {
        if (MyQuestionAnsweringPipeline.instance) {
            throw new Error("You can only create one instance of MyQuestionAnsweringPipeline!");
        }
        MyQuestionAnsweringPipeline.instance = this;
    }

    async loadModel() {
        if (MyQuestionAnsweringPipeline.modelLoaded) {
            console.log("Model already loaded!");
            return;
        }
        try {
            console.log("Loading model...");
            this.pipeline = await pipeline("text2text-generation", "Xenova/LaMini-Flan-T5-783M");
            console.log("Model loaded!");
            MyQuestionAnsweringPipeline.modelLoaded = true;
        } catch (error) {
            console.error("Error loading model:", error);
            throw error;
        }
    }

    async answerQuestion(question, context, mode) {
        let prompt;
        if (mode === "Patient") {
            // Patient mode: friendly and inquisitive, aimed at gathering detailed information
            prompt = `You are medical AI assistant,
             you are here to ask you some important questions about your health to understand your situation better, be curious.
              Based on our previous conversation: ${context}.
               the person has responded with: "${question}".
                Talk to the person to figure out their situation
               and gather more information. 
               If the conversation doesnt involve medical information or doesnt have enough context, 
               just have a normal friendly conversation instead of a medical one`;
        } else if (mode === "Doctor") {
            // Doctor mode: formal and analytical, providing medical insights and diagnosis
            prompt = `As an AI that is meant to help doctors understand their patients better, 
            Youre analyzing the patient's health information and symptoms to provide a detailed assessment.
             Based on the patient's history: ${context}, this has all the information you need to answer the question. 
             The doctor's current inquiry is: "${question}".
              Your job is to help the doctor understand the situation more effectively and help with the diagnostic process`;
        } else {
            // Default prompt or throw an error if mode is not recognized
            throw new Error("Unrecognized mode");
        }
        console.log(prompt);
        try {
            console.log("Processing question...");
            const output = await this.pipeline(prompt, { max_new_tokens: 1000 });
            console.log("Question answered:", output.keys);
            return output[0]["generated_text"];
        } catch (error) {
            console.error("Error answering question:", error);
            throw error;
        }
    }

    static getInstance() {
        if (!MyQuestionAnsweringPipeline.instance) {
            MyQuestionAnsweringPipeline.instance = new MyQuestionAnsweringPipeline();
        }
        return MyQuestionAnsweringPipeline.instance;
    }
}

self.onmessage = async (event) => {
    console.log("Worker received event:", event);

    try {
        const qaPipeline = MyQuestionAnsweringPipeline.getInstance();
        if (!qaPipeline.modelLoaded) {
            await qaPipeline.loadModel();
        } else {
            console.log("Model already loaded!");
        }
        const answer = await qaPipeline.answerQuestion(event.data.question, event.data.context, event.data.mode);
        self.postMessage({ answer: answer, mode: event.data.mode, timestamp: dayjs() });
    } catch (error) {
        console.error("Error in worker:", error);
        self.postMessage({ error: error.message || "An error occurred" });
    }
};
