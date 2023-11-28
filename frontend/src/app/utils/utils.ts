export interface Message {
    sender: string;
    text: string;
}

const MESSAGES_KEY = 'chat_messages';

export const getSavedMessages = (): Message[] => {
    const messagesJson = localStorage.getItem(MESSAGES_KEY);
    if (messagesJson) {
        return JSON.parse(messagesJson) as Message[];
    }
    return [];
};

export const saveMessage = (message: Message): void => {
    const messages = getSavedMessages();
    messages.push(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};
