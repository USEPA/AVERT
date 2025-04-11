import { writeFile } from "node:fs";

/**
 * Recursively renames all keys in an object or an array based on the provided keyMap.
 *
 * @param {Object|Array} data The input data (object or array) to transform
 * @param {Map} keyMap A Map where the key is the old field name and the value is the new field name
 * @returns {Object|Array} A new data structure with keys renamed
 */
export function renameObjectKeys(data, keyMap) {
  if (Array.isArray(data)) {
    return data.map((item) => renameObjectKeys(item, keyMap));
  }

  if (typeof data === "object") {
    return Object.keys(data).reduce((object, oldKey) => {
      const newKey = keyMap.has(oldKey) ? keyMap.get(oldKey) : oldKey;

      object[newKey] = renameObjectKeys(data[oldKey], keyMap);

      return object;
    }, {});
  }

  return data;
}

/**
 * @param {JSON} data
 * @param {string} filepath
 */
export function storeJsonData(data, filepath) {
  writeFile(filepath, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log(`JSON file: ${filepath}`);
  });
}
