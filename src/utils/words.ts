export type WordType = (typeof WORDS)[number];

/**
 * Category / Section / Unit
 *  - name
 *  - lessons
 */

/**
 * Lesson
 *  - name
 *  - words
 */

/**
 * Word
 *  - text
 *  - imgSrc
 *  - tag
 */

/**
 * Tag
 *  - text
 */

const TAGS = {
	CLOTHES: 'CLOTHES',
	ANIMALS: 'ANIMALS',
	OBJECTS: 'OBJECTS',
	PROFESSIONS: 'PROFESSIONS',
	FOODS: 'FOODS',
	ACTIONS: 'ACTIONS',
};

export const WORDS = [
	{
		text: '모자',
		imgSrc:
			'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		lesson: '',
		tag: TAGS.CLOTHES,
	},
	{
		text: '나비',
		imgSrc:
			'https://images.pexels.com/photos/62613/heliconius-melpomene-butterfly-exotic-62613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.ANIMALS,
	},
	{
		text: '다리',
		imgSrc:
			'https://images.pexels.com/photos/1141853/pexels-photo-1141853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.OBJECTS,
	},
	{
		text: '가수',
		imgSrc:
			'https://images.pexels.com/photos/5650905/pexels-photo-5650905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.PROFESSIONS,
	},
	{
		text: '바지',
		imgSrc:
			'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.CLOTHES,
	},
	{
		text: '사자',
		imgSrc:
			'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.ANIMALS,
	},
	{
		text: '기차',
		imgSrc:
			'https://images.pexels.com/photos/159148/regional-train-rail-cars-platform-deutsche-bahn-159148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.OBJECTS,
	},
	{
		text: '포도',
		imgSrc: 'https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg',
		tag: TAGS.FOODS,
	},
	{
		text: '새',
		imgSrc:
			'https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.ANIMALS,
	},
	{
		text: '지우개',
		imgSrc:
			'https://images.pexels.com/photos/35202/eraser-office-supplies-office-office-accessories.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.OBJECTS,
	},
	{
		text: '얘기',
		imgSrc:
			'https://images.pexels.com/photos/1181717/pexels-photo-1181717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.ACTIONS,
	},
	{
		text: '게',
		imgSrc:
			'https://images.pexels.com/photos/584501/pexels-photo-584501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.ANIMALS,
	},
	{
		text: '카메라',
		imgSrc:
			'https://images.pexels.com/photos/1203803/pexels-photo-1203803.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		tag: TAGS.OBJECTS,
	},
];
