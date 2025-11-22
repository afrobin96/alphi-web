import { inject, Injectable, signal } from "@angular/core";
import { MemberData } from "../interfaces/members.interface";
import { MemberService } from "../services/member";
import { tap } from "rxjs";



@Injectable({
  providedIn: 'root',
})
export class MemberStore {
  private _members = signal<MemberData[]>([]);
  members = this._members.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  memberService = inject(MemberService);

  load(){
    this._loading.set(true);
    this.memberService.list().pipe(
      tap({
        next: (res)=> {
          this._members.set(res);
          this._loading.set(false);
        },
        error: () => this._loading.set(false)
      })
    ).subscribe();
  }

  add(payload: Partial<MemberData>){
    return this.memberService.create(payload).pipe(
      tap((member)=> this._members.update(curr => [member, ...curr] ))
    );
  }

  update(id:number, payload: Partial<MemberData>){
    return this.memberService.update(id, payload).pipe(
      tap((member)=> this._members.update(curr => curr.map(c => c.id === member.id ? member: c)))
    );
  }

  remove(id:number){
    return this.memberService.remove(id).pipe(
      tap(()=> this._members.update(curr => curr.filter(c => c.id !== id)))
    )
  }

  assignTeam(memberId: number, teamId: number){
    return this.memberService.assignTeam(memberId, teamId).pipe(
      tap((member)=> this._members.update(curr => curr.map(c => c.id === member.id ? member : c)))
    );
  }
}
