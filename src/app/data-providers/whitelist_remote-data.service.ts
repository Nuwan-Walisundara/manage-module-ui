/**
 * Created by manoj on 7/27/17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {AuthenticationService} from '../commons/services/authentication.service';


@Injectable()
export class WhitelistRemoteDataService {

    private apiContext = 'api';
    private loginInfo;


    private apiEndpoints: Object = {
        getSubscribers: this.apiContext + '/whitelist/getsubscribers',
        getApps: this.apiContext + '/whitelist/getapps',
        getApis: this.apiContext + '/whitelist/getapis',
        getWhitelist: this.apiContext + '/whitelist/getwhitelist',
        addNewWhitelist: this.apiContext + '/whitelist/addnewwhitelist',
        removeFromWhiteList: this.apiContext + '/whitelist/removefromwhitelist'

    };

    constructor(private http: Http, private _authenticationService: AuthenticationService) {
        this.loginInfo = this._authenticationService.loginUserInfo.getValue();

    }

    /**
     * to get all available subscribers of provider
     * @returns {Observable<R>}
     */
    getSubscribers() {
        const data = {};
        return this.http.post(this.apiEndpoints['getSubscribers'], data, this.getOptions())
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => Observable.throw(error.json().message()));
    }

    /**
     * To get all the apps of the subscriber
     * @param subscriberID
     * @returns {Observable<R>}
     */
    getApps(subscriberID: string) {
        let operator;
        if(this.loginInfo.isAdmin){
            operator = '_ALL_';
        }else {
            operator = this.loginInfo.operator;
        }
        const data = {id: subscriberID, operator: operator};
        return this.http.post(this.apiEndpoints['getApps'], data, this.getOptions())
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => Observable.throw(error.json().message()));
    }

    /**
     * to get all the apis related to the selected app and subscriber
     * @param id
     * @returns {Observable<R>}
     */
    getApis(id: string) {
        const data = {id: id};
        return this.http.post(this.apiEndpoints['getApis'], data, this.getOptions())
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => Observable.throw(error.json().message()));
    }


    /**
     * get white list number list
     * @returns {Observable<R>}
     */
    getWhitelist() {
        const data = {};
        return this.http.post(this.apiEndpoints['getWhitelist'], data, this.getOptions())
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => Observable.throw(error.json().message()));
    }

    /**
     * remove a msisdn from whitelist
     * @param msisdn
     * @returns {Observable<R>}
     */
    removeFromWhiteList(msisdn: string) {
        const data = {msisdn: msisdn};
        return this.http.post(this.apiEndpoints['removeFromWhiteList'], data, this.getOptions())
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => Observable.throw(error.json().message()));
    }

    /**
     * to add new whitelist msisdn list
     * @param appId
     * @param apiId
     * @param msisdnList
     * @returns {Observable<R>}
     */
    addNewToWhitelist(appId: string, apiId: string, msisdnList: string[]) {

        const data = {
            'appId': appId,
            'apiId': apiId,
            'userID': this.loginInfo.userName,
            'msisdnList': msisdnList
        };

        return this.http.post(this.apiEndpoints['addNewWhitelist'], data, this.getOptions())
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => Observable.throw(error.json().message()));
    }

    getOptions(): RequestOptions {
        const token = this._authenticationService.loginUserInfo.getValue().token;
        const headers = new Headers(
            {
                'Authorization': 'Basic ' + token,
                'Content-Type': 'application/json'
            });
        return new RequestOptions({headers: headers});
    }


}
