const assert = require('assert');
const { interfaces } = require('mocha');
const BinaryArray = require('../BinaryArray');

let arr;
let startValue;
let iterator;

function expectedSize() {
	const size = startValue.length;
	return size % 8 ? size + 8 - (size % 8) : size;
}

function initNoValue() {
	arr = new BinaryArray(startValue.length);
	// Set value?
}

function initValue() {
	initNoValue();
	arr.appendBits(startValue);
}

function initValueIterator() {
	initNoValue();
	arr.appendBits(startValue);
	iterator = arr.iterator();
}

function splitToEigths() {
	return startValue.match(/.{1,8}/g);
}

function splitToEigthsPad(val) {
	const splt = splitToEigths();
	splt[splt.length - 1] = splt[splt.length - 1].padEnd(8, val ? '1' : '0');
	return splt;
}

function negativeIsZero(num) {
	if (num > 0) return num;
	return 0;
}

describe('Created and values set properly', () => {
	it('Create a new array', () => {
		startValue = '0101';
		initNoValue();
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, 0);
		assert.strictEqual(arr.arr.length, 1);
		assert.strictEqual(arr.arr[0], 0);
	});

	it('Create array and set value boolean', () => {
		startValue = '0101';
		initNoValue();
		for (let i = 0; i < startValue.length; i++) arr.appendBits(startValue.charAt(i) === '1');
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		assert.strictEqual(arr.arr[0] >> 4, parseInt(startValue, 2));
	});

	it('Create array and set value string', () => {
		startValue = '0101';
		initNoValue();
		arr.appendBits(startValue);
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		assert.strictEqual(arr.arr[0] >> 4, parseInt(startValue, 2));
	});

	it('Create array and set value number', () => {
		startValue = '1010'; // only works with a leading one, a number does not maintain leading zeroes
		const value = parseInt(startValue, 2);
		initNoValue();
		arr.appendBits(value);
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		assert.strictEqual(arr.arr[0] >> 4, value);
	});

	it('Create array and set value spanning multiple elements boolean', () => {
		startValue = '101101000110';
		initNoValue();
		for (let i = 0; i < startValue.length; i++) arr.appendBits(startValue.charAt(i) === '1');
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		const spltValue = splitToEigthsPad();
		for (let i = 0; i < arr.size / 8; i++)
			assert.strictEqual(arr.arr[i], parseInt(spltValue[i], 2));
	});

	it('Create array and set value spanning multiple elements string', () => {
		startValue = '101101000110';
		initNoValue();
		arr.appendBits(startValue);
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		const spltValue = splitToEigthsPad();
		for (let i = 0; i < arr.size / 8; i++)
			assert.strictEqual(arr.arr[i], parseInt(spltValue[i], 2));
	});

	it('Create array and set value spanning multiple elements number', () => {
		startValue = '101101000110';
		initNoValue();
		const value = parseInt(startValue, 2);
		arr.appendBits(value);
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		const spltValue = splitToEigthsPad();
		for (let i = 0; i < arr.size / 8; i++)
			assert.strictEqual(arr.arr[i], parseInt(spltValue[i], 2));
	});

	it('Create array and set very large value', () => {
		startValue =
			'10110100011011010101010101110101011110101010010010111010100101010010010011110110101';
		initNoValue();
		arr.appendBits(startValue);
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		const spltValue = splitToEigthsPad();
		for (let i = 0; i < arr.size / 8; i++)
			assert.strictEqual(arr.arr[i], parseInt(spltValue[i], 2));
	});

	it('append(bits) method works', () => {
		startValue = '0101';
		initNoValue();
		arr.append(startValue);
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		assert.strictEqual(arr.arr[0] >> 4, parseInt(startValue, 2));
	});
});

describe('Getting and setting bits at indecies', () => {
	it('Set value and get any specific bit(s)', () => {
		startValue = '101101000110';
		initValue();
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		for (let i = 0; i < startValue.length; i++)
			assert.strictEqual(arr.getBitAt(i), startValue.charAt(i) === '1' ? 1 : 0);
	});

	it("Set value and set a specific bit's value to 1", () => {
		startValue = '101101000110';
		initValue();
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		let changedIndex = 4;
		arr.setBitAt(1, changedIndex);
		for (let i = 0; i < startValue.length; i++) {
			if (i === changedIndex) assert.strictEqual(arr.getBitAt(i), 1);
			else assert.strictEqual(arr.getBitAt(i), startValue.charAt(i) === '1' ? 1 : 0);
		}
		initValue();
		changedIndex = 5;
		arr.setBitAt(1, changedIndex);
		for (let i = 0; i < startValue.length; i++) {
			if (i === changedIndex) assert.strictEqual(arr.getBitAt(i), 1);
			else assert.strictEqual(arr.getBitAt(i), startValue.charAt(i) === '1' ? 1 : 0);
		}
	});

	it("Set value and set a specific bit's value to 0", () => {
		startValue = '101101000110';
		initValue();
		assert.strictEqual(arr.size, expectedSize());
		assert.strictEqual(arr.bitsSet, startValue.length);
		let changedIndex = 4;
		arr.setBitAt(0, changedIndex);
		for (let i = 0; i < startValue.length; i++) {
			if (i === changedIndex) assert.strictEqual(arr.getBitAt(i), 0);
			else assert.strictEqual(arr.getBitAt(i), startValue.charAt(i) === '1' ? 1 : 0);
		}
		initValue();
		changedIndex = 5;
		arr.setBitAt(0, changedIndex);
		for (let i = 0; i < startValue.length; i++) {
			if (i === changedIndex) assert.strictEqual(arr.getBitAt(i), 0);
			else assert.strictEqual(arr.getBitAt(i), startValue.charAt(i) === '1' ? 1 : 0);
		}
	});
});

describe('Iterator', () => {
	it('Iterator is created', () => {
		startValue = '101101000110';
		initValueIterator();
		assert.deepStrictEqual(iterator.arr, arr.arr);
		assert.strictEqual(iterator.length, startValue.length);
		assert.strictEqual(iterator.currentBit, 0);
		assert.strictEqual(iterator.bitsLeft, startValue.length);
	});

	it('Iterator is created with every bit included', () => {
		startValue = '101101000110';
		initValue();
		iterator = arr.iterator(true);
		assert.deepStrictEqual(iterator.arr, arr.arr);
		assert.strictEqual(iterator.length, expectedSize(startValue.length));
		assert.strictEqual(iterator.currentBit, 0);
		assert.strictEqual(iterator.bitsLeft, expectedSize(startValue.length));
	});

	it('Created and iteration works', () => {
		startValue = '101101000110';
		initValueIterator();
		for (let i = 0; i < startValue.length; i++) {
			assert.strictEqual(iterator.nextBit(), startValue.charAt(i) === '1' ? 1 : 0);
			assert.strictEqual(iterator.bitsLeft, startValue.length - i - 1);
		}
	});

	it('Created and iteration works with every bit included', () => {
		startValue = '101101000110';
		initValue();
		iterator = arr.iterator(true);
		startValue += '0000';
		for (let i = 0; i < startValue.length; i++) {
			assert.strictEqual(iterator.nextBit(), startValue.charAt(i) === '1' ? 1 : 0);
			assert.strictEqual(iterator.bitsLeft, startValue.length - i - 1);
		}
	});

	it('Iterator can take any amount of bits at once, geometric sequence of 2', () => {
		startValue =
			'10110100011011010101010101110101011110101010010010111010100101010010010011110110101';
		initValueIterator();
		let lastTaken = 0;
		for (let i = 1; iterator.bitsLeft; i *= 2) {
			assert.strictEqual(iterator.nextBits(i), startValue.substr(lastTaken, i));
			lastTaken += i;
			assert.strictEqual(iterator.bitsLeft, negativeIsZero(startValue.length - lastTaken));
		}
	});

	it('Iterator can take any amount of bits at once, geometric sequence of 3', () => {
		startValue =
			'10110100011011010101010101110101011110101010010010111010100101010010010011110110101';
		initValueIterator();
		let lastTaken = 0;
		for (let i = 1; iterator.bitsLeft; i *= 3) {
			assert.strictEqual(iterator.nextBits(i), startValue.substr(lastTaken, i));
			lastTaken += i;
			assert.strictEqual(iterator.bitsLeft, negativeIsZero(startValue.length - lastTaken));
		}
	});

	it('Iterator can take any amount of bits at once, primes', () => {
		startValue =
			'10110100011011010101010101110101011110101010010010111010100101010010010011110110101';
		const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
		initValueIterator();
		lastTaken = 0;
		for (let i = 1; iterator.bitsLeft; i++) {
			assert.strictEqual(iterator.nextBits(primes[i]), startValue.substr(lastTaken, primes[i]));
			lastTaken += primes[i];
			assert.strictEqual(iterator.bitsLeft, negativeIsZero(startValue.length - lastTaken));
		}
	});

	it('Iterator not affected by alering bits in original array', () => {
		startValue = '101101000110';
		initValueIterator();
		for (let i = 0; i < startValue.length; i++) {
			arr.setBitAt(~arr.getBitAt(i), i);
			assert.strictEqual(iterator.nextBit(), startValue.charAt(i) === '1' ? 1 : 0);
			assert.strictEqual(iterator.bitsLeft, startValue.length - i - 1);
		}
	});

	it('Iterator done value gives the correct value', () => {
		startValue = '101101000110';
		initValueIterator();
		for (let i = 0; i < startValue.length; i++) {
			assert.strictEqual(iterator.nextBit(), startValue.charAt(i) === '1' ? 1 : 0);
			assert.strictEqual(iterator.bitsLeft, startValue.length - i - 1);
			assert.strictEqual(iterator.done, iterator.bitsLeft ? false : true);
		}
	});

	it('Iterator next() function works', () => {
		startValue = '101101000110';
		initValueIterator();
		let next;
		for (let i = 0; next === undefined || !next.done; i++) {
			next = iterator.next();
			assert.strictEqual(next.value, startValue.charAt(i) === '1' ? 1 : 0);
		}
	});

	it('Iterator reset() function works', () => {
		startValue = '101101000110';
		initValueIterator();
		// Works with next
		let next;
		for (let i = 0; next === undefined || !next.done; i++) {
			next = iterator.next();
			assert.strictEqual(next.value, startValue.charAt(i) === '1' ? 1 : 0);
		}
		iterator.reset();
		assert.strictEqual(iterator.bitsLeft, startValue.length);
		// Works with nextBit()
		for (let i = 0; i < startValue.length; i++) {
			assert.strictEqual(iterator.nextBit(), startValue.charAt(i) === '1' ? 1 : 0);
			assert.strictEqual(iterator.bitsLeft, startValue.length - i - 1);
		}
		iterator.reset();
		assert.strictEqual(iterator.bitsLeft, startValue.length);
		// Works with taking primes bits every time
		const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
		lastTaken = 0;
		for (let i = 1; iterator.bitsLeft; i++) {
			assert.strictEqual(iterator.nextBits(primes[i]), startValue.substr(lastTaken, primes[i]));
			lastTaken += primes[i];
			assert.strictEqual(iterator.bitsLeft, negativeIsZero(startValue.length - lastTaken));
		}
	});
});
