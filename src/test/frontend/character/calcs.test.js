/**
 * @jest-environment node
 */

/**
 * This tests the DnD rules/calculations in calcs.js derived from DDB's character service json.
 * The test compares the above with the corresponding display value on the DDB character html page.
 * I verify with the character html page because those stats represent a character's expected stats.
 * And the uncertainty that I'm testing is if I coded the rules/calculations correctly.
 *
 * This will test every exported function in calcs.js...
 * against the same named function in dnd_beyond_dom_selectors.
 *
 * It will run each calculation test for each .mht file under dnd_beyond_character_mht.
 * Each .mht file represents a character downloaded from chrome's save as single webpage.
 * It will have the expected output/stats that I'll scrape to get the test answers.
 *
 * NOTE the data that my calcs runs on is derived from a live request using the
 * character id scraped from each .mht file.
 * This means that values could change if the character was updated AFTER saving the webpage.
 */

/**
 * Set the environment as node instead of jsdom.
 * We aren't testing any browser stuff in here.
 * axios borks about cross origin requests if we don't set as node as well.
 */

import fs from 'fs';
import path from 'path';
import { Parser } from 'fast-mhtml';
import { JSDOM } from 'jsdom';
import axios from 'axios';

import * as calcs from '@assets/character/calcs';
import * as ddbDomSelectors from './dnd_beyond_dom_selectors';

const DDB_CHAR_DIR = path.resolve(__dirname, './dnd_beyond_character_mht');
const dir = fs.readdirSync(DDB_CHAR_DIR);
// array of all *.mht files in the directory
const mhtFiles = dir.filter((fileName) => /^(.*?)(\.mht)$/.test(fileName));

// gets window.document of ddb archive character html page
// dnd_beyond_dom_selectors all use document to query the page for values
const loadDdbDocument = (mhtFile) => {
  const mhtml = fs.readFileSync(`${DDB_CHAR_DIR}/${mhtFile}`, 'utf8');
  // details about parsing mhtml here https://www.npmjs.com/package/fast-mhtml
  // we use it to get the primary html for jsdom
  const mhtmlParser = new Parser();
  const mhtmlOutput = mhtmlParser.parse(mhtml).spit();
  // the primary character page html is the first parsed entry
  // for whatever reason jsdom borks on the <template> elements in ddb's page
  // rather than figure that out, just remove all <template>
  const html = mhtmlOutput[0].content.replaceAll(/<template(.)*>.*<\/template>/gi, '');
  const dom = new JSDOM(html);
  return dom.window.document;
};

// all the calcs to test
const myCalcsKeys = Object.keys(calcs);

const DESCRIBE_TEST = `\
Testing my character calcs against D&D Beyond archived pages\n\
  Calcs to test:\n\
    * ${myCalcsKeys.join('()\n    * ')}() 
`;

describe(DESCRIBE_TEST, () => {
  test.each(mhtFiles)('%#) Processing %s', async (mhtFile) => {
    // document object used for scraping the html inside it
    const document = loadDdbDocument(mhtFile);
    // get the character id scraped from the .mht file
    const charId = ddbDomSelectors.getId(document);
    expect(typeof charId).toEqual('number');

    // use the character id to request the character data json
    const { data: response } = await axios.get(`https://character-service.dndbeyond.com/character/v4/character/${charId}`);
    expect(response.success).toEqual(true);
    const { data } = response;
    expect(data).toBeInstanceOf(Object);

    // compare each calc output using character-service data with the expected value in the .mht
    myCalcsKeys.forEach((calc) => {
      expect(ddbDomSelectors[calc]).toBeInstanceOf(Function);
      const expectedValue = ddbDomSelectors[calc](document);
      // null is an option to skip the test or the mht didn't have the value
      // i.e. spell save dc might not be there if the mht is on the wrong tab
      if (expectedValue !== null) {
        // using an object with calc and value outputs which calc failed if it does fail
        expect({
          calc,
          value: calcs[calc](data),
        }).toEqual({
          calc,
          value: expectedValue,
        });
      }
    });
  });
});
