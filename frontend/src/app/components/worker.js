import { AutoModelForQuestionAnswering
    , AutoTokenizer, env } from '@xenova/transformers';
import path from 'path';

env.local_files_only = true;
env.allowRemoteModels = false;
env.localModelPath = "/"
class MyQuestionAnsweringPipeline {
    static model = null;
    static tokenizer = null;
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            console.log('Loading QA model...');
            try{
                this.model = await AutoModelForQuestionAnswering.from_pretrained("distilbert-onnx");
                this.tokenizer = await AutoTokenizer.from_pretrained("distilbert-onnx");
                console.log("model and tokenizer loaded")
            }catch(e){
                console.log(e)
            }
            this.instance = this; // Set the instance to the current class
        }
        return this.instance;
    }

    static async answerQuestion(question, context) {
        console.log(this.tokenizer)
        const { inputs }= await this.tokenizer(question, context);
        console.log(inputs)
        const output = await this.model.generate(inputs);
        let decoded = await this.tokenizer.decode(output[0]);
        return decoded;
    }
}

self.onmessage = async (event) => {
    try {
        console.log('Worker received event', event);
        const qaPipeline = await MyQuestionAnsweringPipeline.getInstance();
        try{
            const answer = await qaPipeline.answerQuestion(event.data.question, event.data.context);
        }catch(e){
            console.log(e)
        }
            console.log("answer", answer)
        self.postMessage({ answer });
    } catch (error) {
        self.postMessage({ error: error.message || 'An error occurred' });
    }
};
