import { PageHolder } from '@page';
import * as PageObjects from '@page';

export class PageProvider extends PageHolder {
    adminMainPage = new PageObjects.MainPage(this.page);
}
