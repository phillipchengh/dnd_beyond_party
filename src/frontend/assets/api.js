export async function getCharacter(id) {
  // const init = {

  // };
  const response = await fetch(`/character?id=${id}`);
  // if (!response.ok || !/application\/json/.test(response.headers.get('Content-Type'))) {
  if (!response.ok) {
    throw new Error('Failed getting character!');
  }
  const json = await response.json();
  return json.data;
}

export default getCharacter;
