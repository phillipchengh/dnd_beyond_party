// DnDBeyondError signifies an error that DnD Beyond's service returns
export class DndBeyondError extends Error {
  constructor(message = 'Retrieved an error with D&D Beyond.', response = {}) {
    super(message);
    this.response = response;
  }
}

export default DndBeyondError;
