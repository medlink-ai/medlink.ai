import { BertForQuestionAnswering
    , AutoTokenizer, env, pipeline, cat } from '@xenova/transformers';

// env.local_files_only = true;
// env.allowRemoteModels = false;
// env.localModelPath = "/"

class MyQuestionAnsweringPipeline {
    static pipeline = null;
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            console.log('Loading QA model...');
            this.pipeline = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
            console.log('QA model loaded!');
            this.instance = this; // Set the instance to the current class
        }
        return this.instance;
    }

    static async answerQuestion(question, context) {
        let output = await this.pipeline(question=question, context=context);
        return output;
    }
}

self.onmessage = async (event) => {
    try {
        console.log('Worker received event', event);
        const qaPipeline = await MyQuestionAnsweringPipeline.getInstance();
        const answer = await qaPipeline.answerQuestion(event.data.question, event.data.context);
        self.postMessage({ answer });
    } catch (error) {
        self.postMessage({ error: error.message || 'An error occurred' });
    }
};
