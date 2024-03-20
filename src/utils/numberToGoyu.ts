const BASE_NUMBERS = [
	'하나',
	'둘',
	'셋',
	'넷',
	'다섯',
	'여섯',
	'일곱',
	'여덟',
	'아홉',
];

const TEN_UNITS = [
	'열',
	'스물',
	'서른',
	'마흔',
	'쉰',
	'예순',
	'일흔',
	'여든',
	'아흔',
];

export function numberToGoyu(number: number) {
	const safeNumber = number;

	if (safeNumber < 10) {
		return BASE_NUMBERS[safeNumber - 1];
	} else {
		// Ex) 15 => {firstDigit: 1, secondDigit: 5}
		const firstDigit = Math.floor((safeNumber / 10) % 10);
		const secondDigit = safeNumber % 10;

		// When the number is a multiple of 10
		if (secondDigit === 0) {
			return TEN_UNITS[firstDigit - 1];
		}

		return `${TEN_UNITS[firstDigit - 1]}${BASE_NUMBERS[secondDigit - 1]}`;
	}
}
