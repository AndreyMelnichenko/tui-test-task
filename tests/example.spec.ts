import { e2eUserTest } from '@src/framework/fixtures';
import { HotelDetailsPage } from '@src/pages/HotelDetailsPage';
import { PassengerDetailsPage } from '@src/pages/PassengerDetailsPage';
import { SearchResultPage } from '@src/pages/SearchResultPage';
import { SummaryBookingPage } from '@src/pages/SummaryBookingPage';

const testData = [
    {
        validationData: { Adult1: { firstName: '12312313131231' } },
        expectedErrorText: 'Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.',
    },
    {
        validationData: {
            Adult1: { firstName: '54fg4857g8457 45t4597t4508t7y5 45t8y45 t45y ty45ty45t45y87t7yt54t48t48' },
        },
        expectedErrorText: 'Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.',
    },
    {
        validationData: { Adult1: { firstName: ' ' } },
        expectedErrorText: 'Vul de voornaam in (volgens paspoort)',
    },
    {
        validationData: { Adult1: { firstName: '' } },
        expectedErrorText: 'Vul de voornaam in (volgens paspoort)',
    },
];

e2eUserTest(
    'Book TUI tour',
    {
        tag: ['@TUI-001', '@smoke'],
    },
    async ({ userMainPage }) => {
        let searchResultPage: SearchResultPage;
        let hotelDetailsPage: HotelDetailsPage;
        let summaryBookingPage: SummaryBookingPage;
        let passengerDetailsPage: PassengerDetailsPage;

        await e2eUserTest.step('Accept cookies on main page', async () => {
            await userMainPage.acceptCookies();
        });

        await e2eUserTest.step('Select a random available departure airport.', async () => {
            await userMainPage.selectRandomDepartureAirport();
        });

        await e2eUserTest.step('Select a random available destination airport and dates', async () => {
            await userMainPage.selectRandomDestinationAirport();
        });

        await e2eUserTest.step('Select a random available dates', async () => {
            await userMainPage.selectDepartureDate();
        });

        await e2eUserTest.step(
            'In "Rooms & Guests", choose 2 adults and 1 child (child age should be random from available values).',
            async () => {
                await userMainPage.selectTravelers(2, []);
            },
        );

        await e2eUserTest.step('Search for holidays.', async () => {
            searchResultPage = await userMainPage.clickSearchButton();
        });

        await e2eUserTest.step('From results, pick the first available hotel.', async () => {
            hotelDetailsPage = await searchResultPage.pickSearchResult();
        });

        await e2eUserTest.step('Proceed to booking summary.', async () => {
            summaryBookingPage = await hotelDetailsPage.proceedBooking();
        });

        await e2eUserTest.step('Verify that booking summary page is loaded.', async () => {
            passengerDetailsPage = await summaryBookingPage.proceedBooking();
        });

        for (const { validationData, expectedErrorText } of testData) {
            await e2eUserTest.step(`Verify error message -> [${expectedErrorText}]`, async () => {
                await passengerDetailsPage.personalDetailsValidating(validationData, expectedErrorText);
            });
        }
    },
);
