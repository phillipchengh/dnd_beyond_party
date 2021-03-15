import DndBeyondError, { DEFAULT_MESSAGE } from './DndBeyondError';

const DEFAULT_ERROR_MESSAGE = 'Apologies, something went wrong. Please try again.';

export async function getCharacter(id) {
  let response;
  try {
    response = await fetch(`/character?id=${id}`);
  } catch (error) {
    throw new Error('I had a problem connecting to the internet. Please check your connection and try again.');
  }
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
