import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Nodes } from '../interfaces/nodes';
import { Connections } from '../interfaces/connections';
import { throwError, observable, Observable } from 'rxjs';
import { tap, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestServiceService {

  private serviceUrl : String;
  private getNodesUrl = '/getnodes';
  private getConnectionsUrl = '/getconnections';

  constructor(private http: HttpClient) { 
    this.serviceUrl = environment.serviceUrl;
  }

  getNodes(): Observable<Nodes[]>{
    return this.http.get<Nodes[]>(this.serviceUrl + this.getNodesUrl)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  getConnections(): Observable<Connections[]> {
    return this.http.get<Connections[]>(this.serviceUrl + this.getConnectionsUrl)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

}
