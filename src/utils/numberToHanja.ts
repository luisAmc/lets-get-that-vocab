const ZERO = '공';
const BASE_NUMBERS = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
const TEN_UNITS = ['', '십', '백', '천'];
const TEN_THOUSAND_UNITS = ['', '만', '억'];

/**
 * The 한자어 수 repeat all the TEN_UNIT every TEN_THOUSAND_UNIT.
 *
 *               10       십     1st 10-unit
 *              100       백     2nd 10-unit
 *            1,000       천     3rd 10-unit
 *           10,000       만     1st 10,000-unit
 *          100,000      십만    1st 10-unit + 1st 10,000-unit
 *        1,000,000      백만    2st 10-unit + 1st 10,000-unit
 *       10,000,000      천만    3rd 10-unit + 1st 10,000-unit
 *      100,000,000       억     2nd 10,000-unit
 *
 * After every multiple of 10,000 we need to iterate over the 10 units.
 * (The max number supported is 100M = 10,000 * 10,000)
 */

// MAN is the name of the first 10,000 unit in korean
const MAN = 10_000;

export function numberToHanja(number: number) {
	if (number === 0) {
		return ZERO;
	}

	let numberInText = '';
	let currentTenThousandUnitIndex = 0;
	let pivotNumber = number;

	while (pivotNumber > 0) {
		/**
		 * Given the number N = 1,234,567, N % MAN would be 4,567.
		 *
		 * N % MAN gives us segments of (at most) 4, where every digit
		 * correspond to a 10-unit.
		 *
		 *
		 * To get the next segment of (at most) 4 we would only need to
		 * divide N / MAN and then Math.floor the result.
		 *
		 * If N = 1,234,567 and we do Math.floor(N / MAN) we get 123, which
		 * will be our next segment.
		 */

		const segment = pivotNumber % MAN;

		const digits = segment
			.toString()
			.split('')
			.map((digit) => Number(digit));

		const digitsCount = digits.length - 1;

		let segmentInText = digits.reduce((text, digit, index) => {
			if (!digit) {
				return text;
			}

			const baseNumber =
				index < digitsCount && digit === 1 ? '' : BASE_NUMBERS[digit];

			const tenUnitNumber = TEN_UNITS[digitsCount - index];

			return `${text}${baseNumber}${tenUnitNumber}`;
		}, '');

		const tenThousandUnitNumber =
			TEN_THOUSAND_UNITS[currentTenThousandUnitIndex];

		// This is to prevent undesired results as 일만
		if (segmentInText === BASE_NUMBERS[1] && tenThousandUnitNumber) {
			segmentInText = '';
		}

		// TODO: This is ugly
		// This is to prevent undesired results as 억만
		if (
			numberInText.trim() === TEN_THOUSAND_UNITS[1] &&
			tenThousandUnitNumber.trim() === TEN_THOUSAND_UNITS[2]
		) {
			numberInText = '';
		}

		numberInText = `${segmentInText}${tenThousandUnitNumber} ${numberInText}`;
		currentTenThousandUnitIndex++;

		pivotNumber = Math.floor(pivotNumber / MAN);
	}

	return numberInText.trim();
}
