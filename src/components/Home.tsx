import { PrivacyScreen } from './PrivacyScreen';
import { Header } from './Header';
import { Page } from './Page';
import Link from 'next/link';

export function Home() {
	return (
		<Page>
			<Header />
			<div className="grid flex-1 place-items-center">
				<Link href="/question-set">
					<div className="relative grid w-full flex-1 place-items-center">
						<div className="absolute h-52 w-52 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full  bg-yellow-300"></div>

						<div className="absolute grid h-52 w-52 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-3xl font-medium shadow-md">
							Comenzar
						</div>
					</div>
				</Link>
			</div>
			<PrivacyScreen />
		</Page>
	);
}
