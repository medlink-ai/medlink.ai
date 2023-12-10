import { Role } from "@/constants";
import dayjs from "dayjs";

export interface Message {
    sender: Role;
    text: string;
    timestamp: dayjs.Dayjs;
}

const MESSAGES_KEY = "chat_messages";

type MessageStore = {
    [role in Role]: Message[];
};

export const getSavedMessages = (role: Role): Message[] => {
    const messagesJson: MessageStore | undefined = localStorage.getItem(MESSAGES_KEY)
        ? JSON.parse(localStorage.getItem(MESSAGES_KEY) as string)
        : undefined;
    if (messagesJson && messagesJson[role]) {
        return messagesJson[role];
    }
    return [];
};

export const saveMessages = (role: Role, messages: Message[]): void => {
    const messagesJson: MessageStore | undefined = localStorage.getItem(MESSAGES_KEY)
        ? JSON.parse(localStorage.getItem(MESSAGES_KEY) as string)
        : undefined;
    if (messagesJson) {
        messagesJson[role] = messages;
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesJson));
    } else {
        const newMessagesJson: MessageStore = {} as MessageStore;
        newMessagesJson[role] = messages;
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(newMessagesJson));
    }
};

export const clearLocalStorageKey = (key: string): void => {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
    }
};
