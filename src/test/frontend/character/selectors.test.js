/**
 * @jest-environment node
 */

/**
 * Tests selectors in character/selectors against hardcoded values and ddb character-service
 * Hardcoded values and details listed in selectors_expected_values
 * ddb character-service is retrieved as a request in here, useful to check live data/changes
 */

import axios from 'axios';
import * as selectors from '@assets/character/selectors';
import { getId, getName } from '@assets/character/calcs';
import selectorsExpectedValues from './selectors_expected_values';

const describeEachInput = selectorsExpectedValues.map((entry) => ([
  getName(entry.character), getId(entry.character), entry,
]));

describe.each(describeEachInput)('Testing selectors on %s', (name, id, { character, expectedValues }) => {
  let response = { success: false };

  beforeAll(() => (
    // use the character id to request the character data json
    // prepare response to be used in each test below
    axios.get(`https://character-service.dndbeyond.com/character/v4/character/${id}`).then(({ data }) => {
      response = data;
    })
  ));

  test(`Successfully requested ${getName(character)}`, () => {
    expect(response.success).toEqual(true);
  });

  test.each(Object.entries(expectedValues))('Selector: %s', (selector, expectedValue) => {
    // check if selector in selectors_expected_values actually exists in my selectors
    expect(selectors[selector]).toBeInstanceOf(Function);
    // does my selector match the hardcoded expected value derived from the saved json?
    // { source, value } structure is easier to diagnose if a failure occurs
    expect({
      source: 'selectors_expected_values.js',
      value: selectors[selector](character),
    }).toEqual({
      source: 'selectors_expected_values.js',
      value: expectedValue,
    });
    // does the hardcoded expected value match the character-service from ddb?
    // this would fail if ddb changes their service or perhaps the character was updated
    expect({
      source: 'character-service',
      // response.data should be the character data
      value: selectors[selector](response.data),
    }).toEqual({
      source: 'character-service',
      value: expectedValue,
    });
  });
});
