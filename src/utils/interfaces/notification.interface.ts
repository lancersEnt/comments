export interface Notification {
  payload: {
    title: string;
    body: string;
    action: string;
    targetUserId: string;
    createdBy: string;
  };
}
