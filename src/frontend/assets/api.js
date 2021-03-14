import DndBeyondError, { DEFAULT_MESSAGE } from './DndBeyondError';

const DEFAULT_ERROR_MESSAGE = 'Apologies, something went wrong. Please try again.';

export async function getCharacter(id) {
  const response = await fetch(`/character?id=${id}`);
  if (!response.ok || !/application\/json/.test(response.headers.get('Content-Type'))) {
    if (response.headers.get('Content-Type').includes('application/json')) {
      const errorJson = await response.json();
      throw new DndBeyondError(DEFAULT_MESSAGE, errorJson);
    }
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }
  const json = await response.json();
  return json.data;
}

export default getCharacter;
