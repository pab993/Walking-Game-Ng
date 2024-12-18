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
        localStorage.removeItem("playersAvatar");
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
        const playersAvatar = localStorage.getItem("playersAvatar")
        ? JSON.parse(localStorage.getItem("playersAvatar") as string)
        : {};

        if (data.players && Array.isArray(data.players)) {
          data.players = data.players.map((player: any) => {
            const avatarUrl = playersAvatar[player.username];

            return {
              ...player,
              userAvatar: avatarUrl || ''
            };
          });
        }
        this.gameDataSubject.next(data);
      })
    );
  }

  movePlayerGame(data: any, username: string): Observable<any>{
    return this.http.patch<any>(environment.apiUrl + "/player/" + username, data).pipe(
      tap((response) => {
        const currentGameData = this.gameDataSubject.getValue();
  
        if (currentGameData && currentGameData.players) {
          const playerToUpdate = currentGameData.players.find((player: any) => player.username === username);
  
          if (playerToUpdate) {
            playerToUpdate.position = response.position;
  
            playerToUpdate.positions.push({
              row: response.position.row,
              column: response.position.column,
            });
          }

          this.gameDataSubject.next({ ...currentGameData });
        }
      })
    );
  }

  createNewPlayer(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "/player", data).pipe(
      tap((responseData) => {
        const playersAvatar = localStorage.getItem("playersAvatar") ? JSON.parse(localStorage.getItem("playersAvatar") as string) : {};
  
        playersAvatar[data.username] = data.useravatar;
  
        localStorage.setItem("playersAvatar", JSON.stringify(playersAvatar));
      })
    );
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
