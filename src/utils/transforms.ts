import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { es as esLocale } from 'date-fns/locale/es';

export function dateFromString(
	dateString: string,
	pattern: string = 'yyyy-MM-dd',
) {
	return parse(dateString, pattern, new Date());
}

export function formatDate(
	givenDate: string | Date,
	pattern: string = 'dd/MM/yyy',
) {
	if (givenDate == null || isNaN(Date.parse(givenDate.toString()))) {
		return '-';
	}

	const date = new Date(givenDate);

	return format(date, pattern, { locale: esLocale });
}

const ZERO = '공';
const digitSymbol = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
const groupSymbol = ['', '십', '백', '천'];
const clusterSymbol = ['', '만', '억', '조', '경'];

export function numberToHanja(number: number) {
	if (number === 0) {
		return ZERO;
	}

	const parsedTokens = number
		.toString()
		.split('')
		.map((n) => Number(n))
		.reverse()
		.map((digit, digitIndex) => {
			const powerIndex = digitIndex % 4;
			const dotIndex = Math.ceil(digitIndex / 4);

			const power = digit === 0 ? '' : groupSymbol[powerIndex];
			const dot = powerIndex === 0 ? clusterSymbol[dotIndex] : '';

			let numToText = digitSymbol[digit] || '';
			if ((power || dot) && digit === 1) {
				numToText = '';
			}

			return `${numToText}${power}${dot}`;
		});

	const safeParsedTokens = splitArrayInFours(parsedTokens)
		// .map((segment) =>
		// 	clusterSymbol.indexOf(segment.join('')) > 0 ? ['', '', '', ''] : segment,
		// )
		.reduce((acc, val) => acc.concat(val), [])
		.reverse();

	return safeParsedTokens.join('');
}

function splitArrayInFours<T>(array: Array<T>) {
	const result = [];
	let index = 0;

	while (index < array.length) {
		result.push(array.slice(index, (index += 4)));
	}

	return result;
}

const GOYU_BASE = [
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

const GOYU_TENS = [
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
		return GOYU_BASE[safeNumber - 1];
	} else {
		// Ex) 15 => {firstDigit: 1, secondDigit: 5}
		const firstDigit = Math.floor((safeNumber / 10) % 10);
		const secondDigit = safeNumber % 10;

		console.log({ number, firstDigit, secondDigit });

		// When the number is a multiple of 10
		if (secondDigit === 0) {
			return GOYU_TENS[firstDigit - 1];
		}

		return `${GOYU_TENS[firstDigit - 1]}${GOYU_BASE[secondDigit - 1]}`;
	}
}
