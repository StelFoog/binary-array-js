# BinaryArray.js

[![npm](https://img.shields.io/npm/v/binaryarray.js)](https://img.shields.io/npm/v/binaryarray.js)
[![npm bundle size](https://img.shields.io/bundlephobia/min/binaryarray.js)](https://www.npmjs.com/package/binaryarray.js)
[![GitHub last commit](https://img.shields.io/github/last-commit/StelFoog/binary-array-js)](https://github.com/StelFoog/binary-array-js)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/StelFoog/binary-array-js/Node.js%20CI?label=tests)](https://github.com/StelFoog/binary-array-js/actions)

BinaryArray.js is an array of binary bits for JavaScript.

## Usage

The following methods are provided:

* `const arr = new BinaryArray(size)`: creates a new array of the given size (8-aligned) where every bits starts set to `0`
* `arr.append(bits)`: appends bits too the array after the last appended bits. Can take a `boolean` (where `true = 1`, `false = 0`), a `string` (consisting of only `1`s and `0`s, e.g. `"10110101110"`), or a `number` (converted to binary, i.e. `250` = `11111010`, `17` = `10001` etc.)
  * Alternatively `arr.appendBits(bits)` has the same fucntion.
* `arr.setBitAt(bit, index)`: sets the bit at `index` to the value of `bit`. `bit` can be either a `boolean` or a `1` or a `0`. Returns the value of the replaced bit.
* `arr.getBitAt(index)`: returns the bit at the given index, i.e. when running `arr.getBitAt(6)` on an array with the bits `011011101011000` would result in `1`.
* `const iterator = arr.iterator()` returns an iterator for the array over the array as it stands when created. Only bits set with the append method are iterated over (including bits set manually over already appended bits)
  * Alterantively `arr.iterator(true)` gives an iterator that can iterate over the total size of the array

**Iterator methods**: 
* `iterator.next()`: returns an object consisting of the elemets `value`, which is the value of the next bit and `done`, which is `true` if the last set bit has been taken.
* `iterator.nextBit()`: returns the value of the next bit
* `iterator.nextBits(requestedBits)`: returns the next n bits, were n is the value of `requestedBits`, or the remaining bits in the iterator.
* `iterator.done()`: returns `true` if there are no more bits to read in the iterator.
* `iterator.reset()`: resets the iterator so all bits can be gone though again.
* `iterator.bitsLeft`: returns the bits left to go though in the iterator.