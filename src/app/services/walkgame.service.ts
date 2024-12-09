import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalkgameService {

  private gameDataSubject = new BehaviorSubject<any>(null);
  gameData$ = this.gameDataSubject.asObservable();

  private playerSubject = new BehaviorSubject<any>(null);
  playerData$ = this.playerSubject.asObservable();

  constructor(private http: HttpClient) { }

  createNewGame(data: any): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "/game", data).pipe(
      tap(() => {
        localStorage.setItem("gameSizes", JSON.stringify(data));
      })
    );
  }

  getCurrentGame(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "/game").pipe(
      tap((data) => {
        const gameSizes = localStorage.getItem("gameSizes") ? JSON.parse(localStorage.getItem("gameSizes") as string) : null;
        if(gameSizes){
          data = {
            ...data,
            width: gameSizes?.width,
            height: gameSizes?.height
          }
        }
        this.gameDataSubject.next(data);
      })
    );
  }

  createNewPlayer(data: any): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "/player", data);
  }

  getGameData(): any{
    this.gameDataSubject.getValue();
  }

  setGameData(gameData: any): void{
    this.gameDataSubject.next(gameData);
  }

  setPlayerData(playerData: any): void{
    this.playerSubject.next(playerData);
  }

}
