import {Injectable} from '@angular/core';
import {Headers, RequestOptions, Response, Http} from "@angular/http";
import {Observable, Subject, ReplaySubject} from "rxjs";
import {
    ApplicationTask, ApplicationTaskSearchParam,
    AssignApplicationTaskParam, ApproveApplicationCreationTaskParam
} from "../commons/models/application-data-models";

@Injectable()
export class ApprovalRemoteDataService {

    public MyApplicationCreationTasksProvider: Subject<ApplicationTask[]> = new ReplaySubject();
    public GroupApplicationCreationTasksProvider: Subject<ApplicationTask[]> = new ReplaySubject();

    public MySubscriptionTasksProvider: Subject<ApplicationTask[]> = new ReplaySubject();
    public GroupSubscriptionTasksProvider: Subject<ApplicationTask[]> = new Subject();

    private modifiedApplicationTaskIDs: number[] = new Array();


    private apiContext: string = 'api';
    private headers: Headers = new Headers({'Content-Type': 'application/json'});
    private options: RequestOptions = new RequestOptions({headers: this.headers});

    private apiEndpoints: Object = {
        search: this.apiContext + '/applications/search',
        assign: this.apiContext + '/applications/assign',
        approveCreation: this.apiContext + '/applications/approve/creation',
    };

    constructor(private http: Http) {
    }

    getUserApplicationTasks(): void {
        //TODO GET USER FROM AUTH SERVICE
        const param: ApplicationTaskSearchParam = {
            assignee: 'admin',
            size: 100,
            processType: "APPLICATION_CREATION",
            candidateGroups: null
        };

        this.http.post(this.apiEndpoints['search'], param, this.options)
            .map((response: Response) => response.json())
            .subscribe(
                (result: ApplicationTask[]) => {
                    this.MyApplicationCreationTasksProvider.next(result)
                },
                (error: Response) => Observable.throw(error.json().message)
            )
    }

    getUserGroupApplicationTasks(): void {
        //TODO GET GROUP FROM AUTH SERVICE
        const param: ApplicationTaskSearchParam = {
            assignee: null,
            processType: "APPLICATION_CREATION",
            size: 100,
            candidateGroups: "Internal/subscriber,manage-app-admin,Internal/identity,Internal/everyone,admin"
        };
        this.http.post(this.apiEndpoints['search'], param, this.options)
            .map((response: Response) => response.json())
            .subscribe(
                (result: ApplicationTask[]) => {
                    this.GroupApplicationCreationTasksProvider.next(result)
                },
                (error: Response) => Observable.throw(error.json().message))

    }

    getUserAppSubscriptionTasks(): void {
        //TODO GET USER FROM AUTH SERVICE
        const param: ApplicationTaskSearchParam = {
            assignee: 'admin',
            size: 100,
            processType: "SUBSCRIPTION_CREATION",
            candidateGroups: null
        };
        this.http.post(this.apiEndpoints['search'], param, this.options)
            .map((response: Response) => response.json())
            .subscribe(
                (result) => {
                    this.MySubscriptionTasksProvider.next(result)
                },
                (error: Response) => Observable.throw(error.json().message)
            );
    }

    getUserGroupAppSubscriptionTask(): void {
        //TODO GET GROUP FROM AUTH SERVICE
        const param: ApplicationTaskSearchParam = {
            assignee: null,
            size: 100,
            processType: "SUBSCRIPTION_CREATION",
            candidateGroups: "Internal/subscriber,manage-app-admin,Internal/identity,Internal/everyone,admin"
        };
        this.http.post(this.apiEndpoints['search'], param, this.options)
            .map((response: Response) => response.json())
            .subscribe(
                (result:ApplicationTask[])=>{
                    this.GroupSubscriptionTasksProvider.next(result);
                },
                (error: Response) => Observable.throw(error.json().message)
            );
    }

    assignApplicationTaskToUser(taskId) {
        //TODO update to this if success
        this.modifiedApplicationTaskIDs.push(taskId);

        //TODO GET LOGIN USER FROM AUTH SERVICE
        const param = new AssignApplicationTaskParam();
        param.assignee = 'admin';
        param.taskId = taskId;

        return this.http.post(this.apiEndpoints['assign'], param, this.options)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json().message))
    }

    getModifiedTaskIds(): number[] {
        return this.modifiedApplicationTaskIDs;
    }

    approveApplicationCreationTask(param: ApproveApplicationCreationTaskParam): Observable<any> {
        return this.http.post(this.apiEndpoints['approveCreation'], param, this.options)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json().message))

    }

    getAllTasks():void{
        this.getUserApplicationTasks();
        this.getUserAppSubscriptionTasks();
        this.getUserGroupAppSubscriptionTask();
        this.getUserGroupApplicationTasks();
    }

}
