import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection ,DocumentData} from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { post } from '../model/Post';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})  
export class PostserviceService  {
post$: Observable<post[]>;
myCollection:AngularFirestoreCollection;
private _userCollection: AngularFirestoreCollection;
userId$: BehaviorSubject<string>;
  constructor(private fireStore: AngularFirestore) {
    this.myCollection=fireStore.collection<any>(environment.collection);
    this._userCollection=this.fireStore.collection('user');
    }

    readPost():Observable<firebase.firestore.QuerySnapshot>{
      return this.myCollection.get();
    }

    readPost2(timer:number=10000):Observable<post[]>{
    return new Observable((observer)=>{
      let subscripcion:Subscription;
      let tempo=setTimeout(()=>{
        subscripcion.unsubscribe();
        observer.error("Timeout");
      },timer);
      this.readPost().subscribe((lista)=>{
        clearTimeout(tempo);
        let listado=[];
        lista.docs.forEach((post) => {
          listado.push({id:post.id,...post.data()});
        });
        observer.next(listado);
        observer.complete();
      })
    });
  }

    readPostByID(id:string):Observable<firebase.firestore.QueryDocumentSnapshot>{
      return this.myCollection.doc(id).get();
    }

    addPost(myPost:post):Promise<firebase.firestore.DocumentReference>{
    return this.myCollection.add(myPost);
    }

    updatePost(id:string,data:post):Promise<void>{
    return this.myCollection.doc(id).set(data);
    }

    removePost(id:string):Promise<void>{
    return this.myCollection.doc(id).delete();
    }

    selectByUser(id:string):Observable<post[]>{
      this.userId$=new BehaviorSubject(id);
      this.post$=this.userId$.pipe(
        switchMap(user=>
          this.fireStore
          .collection<post>('post',ref => ref
          .where('userId','==', id)).valueChanges),
      )
      return this.post$;
    }  
}