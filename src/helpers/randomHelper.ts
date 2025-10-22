/**
 * Selects a random element from an array.
 * This function provides type-safe random element selection with proper error handling
 * for edge cases like empty arrays or arrays with undefined elements.
 *
 * @template T - The type of elements in the array.
 * @param arr - The array to select a random element from.
 * @returns A random element from the provided array.
 * @throws {Error} Will throw an error if the array is empty.
 * @throws {Error} Will throw an error if the selected array element is undefined or null.
 * @example
 * ```typescript
 * // With string array
 * const colors = ['red', 'blue', 'green', 'yellow'];
 * const randomColor = getRandomArrayElement(colors);
 * console.log(randomColor); // 'blue' (or any other color)
 *
 * // With number array
 * const numbers = [1, 2, 3, 4, 5];
 * const randomNumber = getRandomArrayElement(numbers);
 * console.log(randomNumber); // 3 (or any other number)
 *
 * // With object array
 * const users = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
 * const randomUser = getRandomArrayElement(users);
 * console.log(randomUser.name); // 'Bob' (or any other user)
 *
 * // Error case - empty array
 * try {
 *   const result = getRandomArrayElement([]);
 * } catch (error) {
 *   console.log(error.message); // 'Array is empty'
 * }
 * ```
 */
export const getRandomArrayElement = <T>(arr: Array<T>): T => {
    if (arr.length === 0) {
        throw new Error('Array is empty');
    }
    if (arr.length === 1) {
        if (!arr[0]) {
            throw new Error('Array Element not found');
        }

        return arr[0];
    }
    const randomElement = arr[getRandomInt(0, arr.length - 1)];

    if (!randomElement) {
        throw new Error('Array Element not found');
    }

    return randomElement;
};

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 * This function uses Math.random() to generate cryptographically non-secure random numbers
 * suitable for testing purposes. Both min and max values are included in the possible results.
 *
 * @param min - The minimum value (inclusive) for the random integer.
 * @param max - The maximum value (inclusive) for the random integer.
 * @returns A random integer between min and max (both inclusive).
 * @example
 * ```typescript
 * // Generate random number between 1 and 10
 * const randomNum = getRandomInt(1, 10);
 * console.log(randomNum); // Could be 1, 2, 3, ..., 9, or 10
 *
 * // Generate random index for array
 * const array = ['a', 'b', 'c', 'd', 'e'];
 * const randomIndex = getRandomInt(0, array.length - 1);
 * console.log(array[randomIndex]); // Random element from array
 *
 * // Generate random year
 * const randomYear = getRandomInt(2020, 2025);
 * console.log(randomYear); // Could be 2020, 2021, 2022, 2023, 2024, or 2025
 *
 * // Single value range
 * const singleValue = getRandomInt(5, 5);
 * console.log(singleValue); // Always returns 5
 *
 * // Negative numbers
 * const negativeRandom = getRandomInt(-10, -1);
 * console.log(negativeRandom); // Could be -10, -9, -8, ..., -2, or -1
 * ```
 */
export const getRandomInt = (min: number, max: number): number => {
    const minVal = Math.ceil(min);
    const maxVal = Math.floor(max);

    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
};
