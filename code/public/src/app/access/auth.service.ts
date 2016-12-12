/**
 * Created by cant on 12/7/16.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';

import { Credential } from '../_models/Credential';

@Injectable()
export class AuthService {
  private backendUrl = 'http://ec2-35-156-178-210.eu-central-1.compute.amazonaws.com:5000/api/auth';

  constructor (private http: Http) {}

  public credentialObs: Observable<Credential>;

  public credential: Credential;

  public login(user) : Observable<Response> {
    console.log('authServ login');
    return this.http.post(this.backendUrl, user)
      .map(this.verifyLogin)
      .catch(this.handleLoginError);
  }

  private verifyLogin(res: Response) {
    let body = res.json();

    this.credential = new Credential(body.email, body.id);

    console.log(JSON.stringify(this.credential))

    this.credentialObs = new Observable<Credential>(
      observer => { observer.next(this.credential) });

    return body;
  }

  private handleLoginError(error: Response) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = JSON.stringify(error);
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
