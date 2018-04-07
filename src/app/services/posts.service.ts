import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Post } from '../models/post';

@Injectable()
export class PostsService {
  private postsUrl = 'http://localhost:3000/api/posts';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) { }

  getPosts(skip: number = 0, limit: number = 5): Observable<Post[]> {
    const url = `${this.postsUrl}/?filter[skip]=${skip}&&filter[limit]=${limit}`;
    return this.http.get<Post[]>(url, this.httpOptions)
      .pipe(
        tap(() => { console.log('fetched posts'); }),
        catchError(this.handleError('getPosts', []))
      );
  }

  getPostsCount(): Observable<object> {
    const url = `${this.postsUrl}/count`;
    return this.http.get(url, this.httpOptions)
      .pipe(
        tap(() => { console.log('fetched posts count'); }),
        catchError(this.handleError<object>('getPostsCount'))
      );
  }

  addPost(postData): Observable<Post> {
    return this.http.post<Post>(this.postsUrl, postData, this.httpOptions)
      .pipe(
        tap(() => { console.log('added new post'); }),
        catchError(this.handleError<Post>('addPost'))
      );
  }

  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      return of(result);
    };
  }

}
