export interface GiveFeedbackInput {
  messageId: string;
  feedback: 'useful' | 'not_useful';
}
