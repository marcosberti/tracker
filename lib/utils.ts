import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const COLORS = [
	'stone',
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'green',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
];

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function blobToBase64(blob: Blob) {
	const reader = new FileReader();
	return new Promise(resolve => {
		reader.readAsDataURL(blob);
		reader.onloadend = () => {
			resolve(reader.result);
		};
	});
}

export async function toDataURL(blob: Blob) {
	let buffer = Buffer.from(await blob.arrayBuffer());
	return 'data:' + blob.type + ';base64,' + buffer.toString('base64');
}

export function getStartOfMonth(date = new Date()) {
	const start = new Date(date.getFullYear(), date.getMonth(), 1);

	return start.toISOString();
}

export function getEndOfMonth(date = new Date()) {
	const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	end.setHours(23, 59, 59, 999);

	return end.toISOString();
}

export function getPeriods() {
	const year = new Date().getFullYear();

	return [...new Array(12)].map((_, month) => `${year}-${month}`);
}

export function getPeriod(movDate: string | undefined) {
	const date = movDate ? new Date(movDate) : new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	const period = `${year}-${month}`;

	return period;
}

export const formatCurrency = (value: number, currency: string) => {
	return new Intl.NumberFormat('es-AR', {
		currency,
		style: 'currency',
		maximumFractionDigits: currency === 'BTC' ? 20 : 2,
	}).format(value);
};

const getNewDate = (date: string) => {
	return date.length > 10 ? new Date(date) : new Date(`${date}T00:00:00`);
};

type Options = {
	dateStyle: 'medium' | 'full' | 'long' | 'short';
};

export const formatDate = (
	date: string | Date,
	options: Options = { dateStyle: 'medium' },
) => {
	const dateIns = date instanceof Date ? date : getNewDate(date);
	return new Intl.DateTimeFormat('es-AR', {
		...options,
	}).format(dateIns);
};

export const getMonthDates = (
	year: number | undefined,
	month: number | undefined,
) => {
	const tempDate = new Date();
	const y = year ?? tempDate.getFullYear();
	const m = month ?? tempDate.getMonth();

	const date = new Date(y, m, 1);
	return {
		start: getStartOfMonth(date),
		end: getEndOfMonth(date),
	};
};

export const authRoute = (handler: Function) => {
	return async (req, res) => {
		const supabase = createServerSupabaseClient({ req, res });
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return res.status(401).json({
				error: 'not_authenticated',
				description:
					'The user does not have an active session or is not authenticated',
			});
		}

		handler(req, res);
	};
};

export function timeout(ms: number = 5000) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve('go');
		}, ms);
	});
}

export function getTotalized(accountCurrency, movements) {
	const income = movements.reduce((acc, movement) => {
		let amount;
		if (movement.categories.is_group_item) {
			amount = getTotalized(accountCurrency, movement.subItems);
		} else {
			amount =
				movement.currencies.id === accountCurrency.id
					? movement.amount
					: movement.amount * movement.exchange_rate;
		}

		return acc + amount;
	}, 0);

	return income;
}

function rgbToHsl(r, g, b) {
	(r /= 255), (g /= 255), (b /= 255);
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h,
		s,
		l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return [h, s, l];
}

function getHexColor(color) {
	return NAMED_COLORS[color];
}

export function getHueColor(color) {
	const hexColor = getHexColor(color);
	const r = parseInt(hexColor.substr(1, 2), 16);
	const g = parseInt(hexColor.substr(3, 2), 16);
	const b = parseInt(hexColor.substr(5, 2), 16);

	return rgbToHsl(r, g, b)[0] * 360;
}

const NAMED_COLORS = {
	aliceblue: '#f0f8ff',
	antiquewhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedalmond: '#ffebcd',
	blue: '#0000ff',
	blueviolet: '#8a2be2',
	brown: '#a52a2a',
	burlywood: '#deb887',
	cadetblue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerblue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkblue: '#00008b',
	darkcyan: '#008b8b',
	darkgoldenrod: '#b8860b',
	darkgray: '#a9a9a9',
	darkgreen: '#006400',
	darkkhaki: '#bdb76b',
	darkmagenta: '#8b008b',
	darkolivegreen: '#556b2f',
	darkorange: '#ff8c00',
	darkorchid: '#9932cc',
	darkred: '#8b0000',
	darksalmon: '#e9967a',
	darkseagreen: '#8fbc8f',
	darkslateblue: '#483d8b',
	darkslategray: '#2f4f4f',
	darkturquoise: '#00ced1',
	darkviolet: '#9400d3',
	deeppink: '#ff1493',
	deepskyblue: '#00bfff',
	dimgray: '#696969',
	dodgerblue: '#1e90ff',
	firebrick: '#b22222',
	floralwhite: '#fffaf0',
	forestgreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostwhite: '#f8f8ff',
	gold: '#ffd700',
	goldenrod: '#daa520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#adff2f',
	honeydew: '#f0fff0',
	hotpink: '#ff69b4',
	'indianred ': '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderblush: '#fff0f5',
	lawngreen: '#7cfc00',
	lemonchiffon: '#fffacd',
	lightblue: '#add8e6',
	lightcoral: '#f08080',
	lightcyan: '#e0ffff',
	lightgoldenrodyellow: '#fafad2',
	lightgrey: '#d3d3d3',
	lightgreen: '#90ee90',
	lightpink: '#ffb6c1',
	lightsalmon: '#ffa07a',
	lightseagreen: '#20b2aa',
	lightskyblue: '#87cefa',
	lightslategray: '#778899',
	lightsteelblue: '#b0c4de',
	lightyellow: '#ffffe0',
	lime: '#00ff00',
	limegreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumaquamarine: '#66cdaa',
	mediumblue: '#0000cd',
	mediumorchid: '#ba55d3',
	mediumpurple: '#9370d8',
	mediumseagreen: '#3cb371',
	mediumslateblue: '#7b68ee',
	mediumspringgreen: '#00fa9a',
	mediumturquoise: '#48d1cc',
	mediumvioletred: '#c71585',
	midnightblue: '#191970',
	mintcream: '#f5fffa',
	mistyrose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajowhite: '#ffdead',
	navy: '#000080',
	oldlace: '#fdf5e6',
	olive: '#808000',
	olivedrab: '#6b8e23',
	orange: '#ffa500',
	orangered: '#ff4500',
	orchid: '#da70d6',
	palegoldenrod: '#eee8aa',
	palegreen: '#98fb98',
	paleturquoise: '#afeeee',
	palevioletred: '#d87093',
	papayawhip: '#ffefd5',
	peachpuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderblue: '#b0e0e6',
	purple: '#800080',
	rebeccapurple: '#663399',
	red: '#ff0000',
	rosybrown: '#bc8f8f',
	royalblue: '#4169e1',
	saddlebrown: '#8b4513',
	salmon: '#fa8072',
	sandybrown: '#f4a460',
	seagreen: '#2e8b57',
	seashell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyblue: '#87ceeb',
	slateblue: '#6a5acd',
	slategray: '#708090',
	snow: '#fffafa',
	springgreen: '#00ff7f',
	steelblue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: '#ffffff',
	whitesmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowgreen: '#9acd32',
};
