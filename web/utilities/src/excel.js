import * as fs from "node:fs";
import { exit } from "node:process";
import { Readable } from "node:stream";

import * as XLSX from "xlsx";

XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);

export { XLSX };

/**
 * @param {string} filename
 * @param {string} sheetName
 */
export function getExcelWorksheet(filename, sheetName) {
  if (!fs.existsSync(filename)) {
    console.error(`File "${filename}" does not exist.`);
    exit(1);
  }

  console.log(`Reading file: ${filename}`);

  const workbook = XLSX.readFile(filename);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    console.error(`Worksheet "${sheetName}" does not exist in the workbook.`);
    exit(1);
  }

  return worksheet;
}

/**
 * Given two header rows and a set of data rows, parse the data into an array of
 * objects. The first header row contains category names, while the second header
 * row contains field names for all columns.
 * 
 * @param {string[]} headerRow1 row of category names (can be empty for the first few columns)
 * @param {string[]} headerRow2 row of header field names for all columns
 * @param {string[][]} dataRows rows of data for all columns
 */
export function parseExcelDoubleHeaderRowsData(headerRow1, headerRow2, dataRows) {
  /** Loop over each row of data and build up an array of objects. */
  const result = dataRows.reduce((array, row) => {
    /** Skip empty rows of data. */
    if (row.length === 0) return array;

    const object = {};

    /** Will be one of the categories found in header row 1. */
    let headerCategoryName;

    /**
     * Loop over the every column in the data row, building up an object with
     * labels from the header rows.
     */
    row.forEach((value, index) => {
      /**
       * Header row 2 will usually exist at a given column/index and contain the
       * value needed for the header field's label. If it doesn't exist in a
       * column/index, header row 1's value (the header category) will be used
       * instead. If it does exist at a given column/index, it might also be
       * nested under a header category as well. We'll replace any new line
       * characters (\n) with spaces.
       */
      const headerFieldName = headerRow2[index]
        ? headerRow2[index].toString().replace(/\n/g, " ")
        : null;

      /**
       * If a header row 1 value exists, its the start of a new category. As
       * with the header field name, we'll replace any new line characters (\n)
       * with spaces.
       */
      if (headerRow1[index]) {
        headerCategoryName = headerRow1[index].toString().replace(/\n/g, " ");
        object[headerCategoryName] ??= {};
      }

      /**
       * If the category has not yet been set, there isn't a category to nest
       * any potential the header field under. We'll just ensure the header
       * field name exists before using it.
       */
      if (!headerCategoryName) {
        if (headerFieldName !== null) {
          object[headerFieldName] = value;
        }
        /**
         * Else the category has been set, so we'll check if the header field
         * exits. If it does, we'll nest the header field under the category.
         * Otherwise, we'll just use the category name as the header field.
         */
      } else {
        if (headerFieldName !== null) {
          object[headerCategoryName][headerFieldName] = value;
        } else {
          object[headerCategoryName] = value;
        }
      }
    });

    array.push(object);

    return array;
  }, []);

  return result;
}
