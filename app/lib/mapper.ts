// Utility mapper – no React hooks here

export interface ApiMessageDto {
  id: string;
  message: string;
  time: string;
  userFirstName: string;
  clarkId: string;
  chatId: string;
  is_encrypted?: boolean;
}

export interface UiMessageDto {
  id: string;
  message: string;
  sender: string;
  timestamp: string;
  isOwnMessage: boolean;
  chatId: string;
  is_encrypted: boolean;
}

export interface ChatDto {
  id: string;
  name: string;
}

let currentClarkId: string | null = null;

export function setCurrentClarkId(id: string | null) {
  currentClarkId = id ?? null;
}

export function toUiMessage(api: ApiMessageDto): UiMessageDto {
  const date = new Date(api.time);
  const timestamp = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return {
    id: api.id,
    message: api.message,
    sender: api.userFirstName,
    timestamp,
    isOwnMessage:
      currentClarkId !== null ? currentClarkId === api.clarkId : false,
    chatId: api.chatId,
    is_encrypted: api.is_encrypted || true,
  };
}
