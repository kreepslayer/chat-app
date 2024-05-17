import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { jwtDecode } from 'jwt-decode';

import { environment } from 'src/environments/environment';

import { NewUser } from '../models/newUser.model';
import { User } from '../models/user.model';
import { UserResponse } from '../models/userResponse.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private user$ = new BehaviorSubject<User>(null);

    private httpOptions: { headers: HttpHeaders } = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    get userStream(): Observable<User> {
        return this.user$.asObservable();
    }

    get isUserLoggedIn(): Observable<boolean> {
        return this.user$.asObservable().pipe(
            switchMap((user: User) => {
                const isUserAuthenticated = user !== null;
                return of(isUserAuthenticated);
            })
        );
    }

    get userId(): Observable<number> {
        return this.user$.asObservable().pipe(
            switchMap((user: User) => {
                return of(user.id);
            })
        );
    }

    get userFullName(): Observable<string> {
        return this.user$.asObservable().pipe(
            switchMap((user: User) => {
                if (!user) {
                    return of(null);
                }
                const fullName = user.userName;
                return of(fullName);
            })
        );
    }

    get userFullImagePath(): Observable<string> {
        return this.user$.asObservable().pipe(
            switchMap((user: User) => {
                const doesAuthorHaveImage = !!user?.imagePath;
                let fullImagePath = this.getDefaultFullImagePath();
                if (doesAuthorHaveImage) {
                    fullImagePath = this.getFullImagePath(user.imagePath);
                }
                return of(fullImagePath);
            })
        );
    }

    constructor(private http: HttpClient, private router: Router) {}

    getDefaultFullImagePath(): string {
        return 'http://localhost:3000/api/feed/image/blank-profile-picture.png';
    }

    getFullImagePath(imageName: string): string {
        return 'http://localhost:3000/api/feed/image/' + imageName;
    }

    getUserImage() {
        return this.http
            .get(`${environment.baseApiUrl}/user/image`)
            .pipe(take(1));
    }

    getUserImageName(): Observable<{ imageName: string }> {
        return this.http
            .get<{ imageName: string }>(
                `${environment.baseApiUrl}/user/image-name`
            )
            .pipe(take(1));
    }

    updateUserImagePath(imagePath: string): Observable<User> {
        return this.user$.pipe(
            take(1),
            map((user: User) => {
                user.imagePath = imagePath;
                this.user$.next(user);
                return user;
            })
        );
    }

    uploadUserImage(
        formData: FormData
    ): Observable<{ modifiedFileName: string }> {
        return this.http
            .post<{ modifiedFileName: string }>(
                `${environment.baseApiUrl}/user/upload`,
                formData
            )
            .pipe(
                tap(({ modifiedFileName }) => {
                    let user = this.user$.value;
                    user.imagePath = modifiedFileName;
                    this.user$.next(user);
                })
            );
    }

    register(newUser: NewUser): Observable<User> {
        console.log('🚀 ~ AuthService ~ register ~ newUser:', newUser);
        return this.http
            .post<User>(
                `${environment.baseApiUrl}/auth/register/`,
                newUser,
                this.httpOptions
            )
            .pipe(take(1));
    }

    login(userName: string, password: string): Observable<{ token: string }> {
        console.log('🚀 ~ AuthService ~ login ~ userName:', userName);
        console.log('🚀 ~ AuthService ~ login ~ password:', password);
        console.log(`path: ${environment.baseApiUrl}/auth/login/`);

        return this.http
            .post<{ token: string }>(
                `${environment.baseApiUrl}/auth/login`,
                { userName, password },
                this.httpOptions
            )
            .pipe(
                take(1),
                tap((response: { token: string }) => {
                    console.log(response.token);
                    Preferences.set({
                        key: 'token',
                        value: response.token,
                    });
                    const decodedToken: UserResponse = jwtDecode(
                        response.token
                    );
                    console.log(decodedToken);
                    this.user$.next(decodedToken.user);
                })
            );
    }

    isTokenInStorage(): Observable<boolean> {
        return from(
            Preferences.get({
                key: 'token',
            })
        ).pipe(
            map((data: { value: string }) => {
                if (!data || !data.value) return null;

                const decodedToken: UserResponse = jwtDecode(data.value);
                const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
                const isExpired =
                    new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

                if (isExpired) return null;
                if (decodedToken.user) {
                    this.user$.next(decodedToken.user);
                    return true;
                }
            })
        );
    }

    logout(): void {
        this.user$.next(null);
        Preferences.remove({ key: 'token' });
        this.router.navigateByUrl('/auth');
    }
}
