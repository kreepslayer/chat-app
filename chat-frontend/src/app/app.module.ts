import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashbord.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'chat-app-40925',
        appId: '1:165618859614:web:a9fd10c05892714a3e3ecf',
        databaseURL:
          'https://chat-app-40925-default-rtdb.europe-west1.firebasedatabase.app',
        storageBucket: 'chat-app-40925.appspot.com',
        apiKey: 'AIzaSyACwgpk7Z7lFkWfJ8Hzi8yQL3Y-Rs-K8D0',
        authDomain: 'chat-app-40925.firebaseapp.com',
        messagingSenderId: '165618859614',
        measurementId: 'G-90JNE5QTZ5',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
