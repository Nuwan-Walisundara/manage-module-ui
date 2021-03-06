import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from './services/authentication.service';
import {RateService} from './services/rate.service';
import {BlackListService} from './services/blacklist.service';
import {WhitelistService} from './services/whitelist.service';
import {QuotaService} from './services/quotacap.service';
import {LoginRemoteDataService} from '../data-providers/login_remote-data.service';
import {AppCommonService} from './services/app-common.service';
import {MessageService} from './services/message.service';
import {TooltipModule} from 'ngx-bootstrap/tooltip';


@NgModule({
    imports: [
        CommonModule,
        TooltipModule.forRoot()
    ],
    declarations: [],
    providers: [
        AuthenticationService,
        LoginRemoteDataService,
        AppCommonService,
        MessageService,
        RateService,
        BlackListService,
        WhitelistService,
        QuotaService],
    exports: []
})
export class CommonsModule {
}
