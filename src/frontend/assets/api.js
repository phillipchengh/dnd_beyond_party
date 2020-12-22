import DndBeyondError from './DndBeyondError';

export async function getCharacter(id) {
  const response = await fetch(`/character?id=${id}`);
  if (!response.ok || !/application\/json/.test(response.headers.get('Content-Type'))) {
    if (response.headers.get('Content-Type').includes('application/json')) {
      const errorJson = await response.json();
      throw new DndBeyondError('Retrieved an error with D&D Beyond.', errorJson);
    }
    throw new Error('Failed getting character!');
  }
  const json = await response.json();
  return json.data;
}

export default getCharacter;
