import { Role } from "@/constants";
import dayjs from "dayjs";

export interface Message {
    sender: Role;
    text: string;
    timestamp: dayjs.Dayjs;
}

const MESSAGES_KEY = "chat_messages";

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

export const clearLocalStorageKey = (key: string): void => {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
    }
};
