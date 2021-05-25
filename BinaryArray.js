const { floor, log2 } = Math;
const { isInteger } = Number;
const badInputRet = undefined;
const Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

// Manages bits in a byte array
class BinaryArray {
	constructor(targetLength) {
		// length sized to fit in a byte
		this.length = targetLength % 8 ? targetLength + 8 - (targetLength % 8) : targetLength;
		this.bitsSet = 0;
		this.arr = new Arr(this.length / 8);
	}

	// Alternate to .length
	get size() {
		return this.length;
	}

	_setBitAt(bit, index) {
		// console.log(index, ' – ', 7 - (index % 8));
		// console.log();
		const sec = floor(index / 8);
		if (bit) this.arr[sec] = this.arr[sec] | (1 << (7 - (index % 8)));
		else this.arr[sec] = this.arr[sec] & ~(1 << (7 - (index % 8)));
	}

	_getBitAt(index) {
		return (this.arr[floor(index / 8)] >> (7 - (index % 8))) & 1;
	}

	_setBitsString(bits) {
		for (let i = 0; i < bits.length; i++) {
			this._setBitAt(bits.charAt(i) === '1' ? 1 : 0, this.bitsSet);
			// arr[floor(this.bitsSet / 8)] =
			// 	arr[floor(this.bitsSet / 8)] ||
			// 	(bits.charAt(i) === '1' ? 1 : 0) << (7 - (this.bitsSet % 8));
			this.bitsSet++;
		}
	}

	// appends bits to the array, returns index of last bit set
	appendBits(bits) {
		if (typeof bits === 'boolean' && this.bitsSet < this.length) {
			this._setBitAt(bits ? 1 : 0, this.bitsSet);
			// console.log(this.arr[0].toString(2));
			// arr[floor(this.bitsSet / 8)] =
			// 	arr[floor(this.bitsSet / 8)] || (bits ? 1 : 0) << (7 - (this.bitsSet % 8));
			this.bitsSet++;
		} else if (typeof bits === 'string' && this.bitsSet + bits.length <= this.length) {
			for (let i = 0; i < bits.length; i++)
				if (bits.charAt(i) !== '0' && bits.charAt(i) !== '1') return badInputRet;
			this._setBitsString(bits);
		} else if (typeof bits === 'number' && this.bitsSet < this.length) {
			if (!isInteger(bits) || bits < 0) return badInputRet;
			if (!(bits < 2 || this.bitsSet + floor(log2(bits) + 1) <= this.length)) return badInputRet;
			this._setBitsString(bits.toString(2));
		} else if (bits instanceof Uint8Array) {
			let str = '';
			if (this.bitsSet + bits.length * 8 > this.length) return badInputRet;
			for (let i = 0; i < bits.length; i++) str += bits[i].toString(2).padStart(8, '0');
			this._setBitsString(str);
		} else if (bits instanceof Array) {
			let str = '';
			if (this.bitsSet + bits.length * 8 > this.length) return badInputRet;
			for (let i = 0; i < bits.length; i++) {
				if (typeof bits[i] !== 'number' || bits[i] < 0 || bits[i] > 255) return badInputRet;
				str += bits[i].toString(2).padStart(8, '0');
			}
			this._setBitsString(str);
		} else return badInputRet;

		return this.bitsSet - 1;
	}

	append(bits) {
		return this.appendBits(bits);
	}

	// sets a bit at given index, returns the bit that was there before
	setBitAt(bit, index) {
		if (typeof bit !== 'boolean' && bit !== 0 && bit !== 1) return badInputRet;
		if (typeof index !== 'number' || index < 0 || index > this.length) return badInputRet;
		const replaced = this._getBitAt(index);
		this._setBitAt(bit ? 1 : 0, index);
		return replaced;
	}

	getBitAt(index) {
		if (typeof index !== 'number' || index < 0 || index > this.length) return badInputRet;
		return this._getBitAt(index);
	}

	iterator(everyBit) {
		return new BinaryArrayIterator(this, everyBit);
	}
}

class BinaryArrayIterator {
	constructor(binaryArray, everyBit) {
		this.arr = new Arr(binaryArray.length / 8);
		this.arr.set(binaryArray.arr);
		this.length = everyBit ? binaryArray.length : binaryArray.bitsSet;
		this.currentBit = 0;
	}

	_takeNextBit() {
		return (this.arr[floor(this.currentBit / 8)] >> (7 - (this.currentBit % 8))) & 1;
	}

	nextBit() {
		if (this.currentBit >= this.length) return badInputRet;
		const bit = this._takeNextBit();
		this.currentBit++;
		return bit;
	}

	nextBits(requestedBits) {
		if (requestedBits && typeof requestedBits !== 'number') return badInputRet;
		var bits = '';
		for (let i = 0; i < requestedBits; i++) {
			if (this.currentBit >= this.length) break;
			bits += this._takeNextBit();
			this.currentBit++;
		}
		return bits;
	}

	next() {
		return { value: this.nextBit(), done: this.done };
	}

	reset() {
		this.currentBit = 0;
	}

	get bitsLeft() {
		return this.length - this.currentBit;
	}

	get done() {
		return this.bitsLeft ? false : true;
	}
}

module.exports = BinaryArray;
