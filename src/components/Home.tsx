import { api } from '~/utils/api';
import { Header } from './shared/Header';
import { Page } from './shared/Page';
import { PrivacyScreen } from './shared/PrivacyScreen';
import { Loading } from './shared/Loading';
import Link from 'next/link';

export function Home() {
	const { data, isLoading } = api.unit.getAll.useQuery();

	return (
		<Page>
			{isLoading && <Loading />}

			{!isLoading && (
				<>
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
				</>
			)}

			<PrivacyScreen />
		</Page>
	);
}
