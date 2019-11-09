import { NotePage } from './Note';

export class SettingsModel {
    constructor(data: NotePage[], page: number) {
        this.Data = data;
        this.LastPage = page;
    }

    Data: NotePage[];
    LastPage: number;
}