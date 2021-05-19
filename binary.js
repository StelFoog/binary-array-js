const { floor, log2 } = Math;
const { isInteger } = Number;
const badInputRet = undefined;
const Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

module.exports = BinaryArray;

// Manages bits in a byte array
class BinaryArray {
	constructor(targetSize) {
		// size sized to fit in a byte
		this.size = targetSize % 8 ? targetSize + 8 - (targetSize % 8) : targetSize;
		this.bitsSet = 0;
		this.arr = new Arr(this.size / 8);
	}

	_setBitAt(bit, index) {
		const sec = floor(index / 8);
		if (bit) this.arr[sec] = this.arr[sec] || 1 << (7 - (index % 8));
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
		if (typeof bits === 'boolean' && this.bitsSet < this.size) {
			this._setBitAt(bits ? 1 : 0, this.bitsSet);
			// arr[floor(this.bitsSet / 8)] =
			// 	arr[floor(this.bitsSet / 8)] || (bits ? 1 : 0) << (7 - (this.bitsSet % 8));
			this.bitsSet++;
		} else if (typeof bits === 'string' && this.bitsSet + bits.length <= this.size) {
			if (!/^[0-1]/.test(bits)) return badInputRet;
			this._setBitsString(bits);
		} else if (typeof bits === 'number' && this.bitsSet < this.size) {
			if (!isInteger(bits) || bits < 0) return badInputRet;
			if (!(bits < 2 || this.bitsSet + floor(log2(bits) + 1) <= this.size)) return badInputRet;
			this._setBitsString(bits.toString(2));
		} else return badInputRet;

		return this.bitsSet - 1;
	}

	// sets a bit at given index, returns the bit that was there before
	setBitAt(bit, index) {
		if (typeof bit !== 'boolean' && bit !== 0 && bit !== 1) return badInputRet;
		if (typeof index !== 'number' || index < 0 || index > this.size) return badInputRet;
		const replaced = this._getBitAt(index);
		this._setBitAt(bit ? 1 : 0, index);
		return replaced;
	}

	getBitAt(index) {
		if (typeof index !== 'number' || index < 0 || index > this.size) return badInputRet;
		return this._getBitAt(index);
	}

	get byteArray() {
		return this.arr;
	}

	get bitsSet() {
		return this.bitsSet;
	}

	iterator() {
		return BinaryListIterator(this);
	}
}

class BinaryListIterator {
	constructor(binaryList) {
		this.arr = new Arr(binaryList.size / 8).set(binaryList.byteArray);
		this.bitsSet = binaryList.bitsSet;
		this.currentBit = 0;
	}

	_takeNextBit() {
		return (arr[floor(this.currentBit / 8)] >> (7 - (this.currentBit % 8))) & 1;
	}

	nextBit() {
		if (this.currentBit >= this.bitsSet) return false;
		const bit = this._takeNextBit();
		this.currentBit++;
		return bit;
	}

	nextBits(reqBits) {
		if (reqBits && typeof reqBits !== 'number') return badInputRet;
		var bits = '';
		for (let i = 0; i < reqBits; i++) {
			if (this.currentBit >= this.bitsSet) return false;
			bits += this._takeNextBit();
			this.currentBit++;
		}
	}
}
