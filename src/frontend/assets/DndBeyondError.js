// DnDBeyondError signifies an error that DnD Beyond's service returns
export const DEFAULT_MESSAGE = 'Apologies, I retrieved an error with D&D Beyond. Please check if your character is active and public in a running campaign.';

export class DndBeyondError extends Error {
  constructor(message = DEFAULT_MESSAGE, response = {}) {
    super(message);
    this.response = response;
  }
}

export default DndBeyondError;
