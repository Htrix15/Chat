import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class DataService {

  private url:string;

  constructor(private http: HttpClient) { 
    this.url = "/api";
  }

  getUserDatas<T>(typeDatas: string, queryParams?: Map<string, string>) {
    let myParams = new HttpParams();
    if(queryParams){
      queryParams.forEach((value, key)=>{
        myParams = myParams.append(key, value)
      });
    }
    return this.http.get<T>(this.url + '/' + typeDatas, { params: myParams });
  }
  
  postUserDatas<T, J>(postItem: T, typeItem: string) {
    return this.http.post<J>(this.url+'/'+typeItem, postItem);
  }
}
