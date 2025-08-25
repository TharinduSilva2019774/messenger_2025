export interface ApiMessageDto {
    id: string;
    message: string;
    time: string;
    userFirstName: string;
    currentUser: boolean;
  }

export interface UiMessageDto {
  id: string;
  message: string;
  sender: string;
  timestamp: string; 
  isOwnMessage: boolean;
}

export function toUiMessage(api: ApiMessageDto): UiMessageDto {
  const date = new Date(api.time);
  const timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return {
    id: api.id,
    message: api.message,
    sender: api.userFirstName,
    timestamp,
    isOwnMessage: api.currentUser,
  };
}
