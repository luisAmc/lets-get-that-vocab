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

export function formatNumber(amount: number) {
	if (amount == null || isNaN(amount)) {
		return '-';
	}

	return amount.toLocaleString('en');
}
