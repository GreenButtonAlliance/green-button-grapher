import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import nightmare from 'nightmare'
require('nightmare-upload')(nightmare);

import url from 'url'
import visit from '../helpers/visit'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

describe('When the app boots', function () {
  test('it displays test data and can parse a new file', async function () {
    const SECOND_FILE_PATH = '/public/data/Mountain_Single_family_Jan_1_2011_to_Jan_1_2012.xml';
    const FULL_SECOND_FILE_PATH = `${process.cwd()}${SECOND_FILE_PATH}`;

    let page = visit('/');

    let initialText = await page
      .wait(() => {
        return document.body.textContent.includes('123 PRETEND ST BERKELEY CA 94707-2701');
      })
      .evaluate(() => document.body.textContent);

    expect(initialText).toContain('Total: $1.30');
    expect(initialText).toContain('Total peak: $0.45');

    page.upload("input[type='file']", FULL_SECOND_FILE_PATH);

    let textAfterUpload = await page
      .wait(() => document.body.textContent.includes('Mountain Single-family'))
      .click("button[data-chart-type='chart-type-power-usage']")
      .evaluate(() => document.body.textContent)
      .end();

    expect(textAfterUpload).toContain('Total: 24380 kWh');
    expect(textAfterUpload).toContain('Total peak: 5339 kWh');
  });
});


