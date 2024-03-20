import { numberToHanja } from '../src/utils/numberToHanja';
import { numberToGoyu } from '../src/utils/numberToGoyu';

describe('Converts number to 한자어 수', () => {
	test('Single digit', () => {
		const testSet = [
			{
				number: 0,
				answer: '공',
			},
			{
				number: 1,
				answer: '일',
			},
			{
				number: 3,
				answer: '삼',
			},
			{
				number: 9,
				answer: '구',
			},
		];

		testSet.forEach((test) =>
			expect(numberToHanja(test.number)).toBe(test.answer),
		);
	});

	test('"Complete" numbers', () => {
		const testSet = [
			{
				number: 1_234_567,
				answer: '백이십삼만 사천오백육십칠',
			},
			{
				number: 99_999_999,
				answer: '구천구백구십구만 구천구백구십구',
			},
		];

		testSet.forEach((test) =>
			expect(numberToHanja(test.number)).toBe(test.answer),
		);
	});

	test('Numbers with zeros', () => {
		const testSet = [
			{
				number: 134234,
				answer: '십삼만 사천이백삼십사',
			},
			{
				number: 1300009,
				answer: '백삼십만 구',
			},
			{
				number: 25005000,
				answer: '이천오백만 오천',
			},
		];

		testSet.forEach((test) =>
			expect(numberToHanja(test.number)).toBe(test.answer),
		);
	});

	test('Number fill with zeros', () => {
		const testSet = [
			{
				number: 10,
				answer: '십',
			},
			{
				number: 100,
				answer: '백',
			},
			{
				number: 1_000,
				answer: '천',
			},
			{
				number: 10_000,
				answer: '만',
			},
			{
				number: 100_000,
				answer: '십만',
			},
			{
				number: 1_000_000,
				answer: '백만',
			},
			{
				number: 10_000_000,
				answer: '천만',
			},
			{
				number: 100_000_000,
				answer: '억',
			},
		];

		testSet.forEach((test) =>
			expect(numberToHanja(test.number)).toBe(test.answer),
		);
	});
});

describe('Converts number to 고유어 수', () => {
	test('Single digit', () => {
		const testSet = [
			{
				number: 1,
				answer: '하나',
			},
			{
				number: 3,
				answer: '셋',
			},
			{
				number: 9,
				answer: '아홉',
			},
		];

		testSet.forEach((test) =>
			expect(numberToGoyu(test.number)).toBe(test.answer),
		);
	});

	test('"Complete" numbers', () => {
		const testSet = [
			{
				number: 12,
				answer: '열둘',
			},
			{
				number: 35,
				answer: '서른다섯',
			},
			{
				number: 77,
				answer: '일흔일곱',
			},
		];

		testSet.forEach((test) =>
			expect(numberToGoyu(test.number)).toBe(test.answer),
		);
	});

	test('Numbers with zeros', () => {
		const testSet = [
			{
				number: 10,
				answer: '열',
			},
			{
				number: 50,
				answer: '쉰',
			},
			{
				number: 90,
				answer: '아흔',
			},
		];

		testSet.forEach((test) =>
			expect(numberToGoyu(test.number)).toBe(test.answer),
		);
	});
});
