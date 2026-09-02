import { Injectable, computed, signal } from '@angular/core';
import { CurrentUser } from './current-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private readonly currentUserState = signal<CurrentUser | null>(null);

  readonly currentUser = this.currentUserState.asReadonly();
  readonly displayName = computed(() => {
    const user = this.currentUserState();

    return user?.apelido || user?.nome || user?.telefone || '';
  });
  readonly initials = computed(() => this.createInitials(this.displayName()));

  setCurrentUser(user: CurrentUser | null): void {
    this.currentUserState.set(user);
  }

  clear(): void {
    this.currentUserState.set(null);
  }

  private createInitials(value: string): string {
    const [first = '', second = ''] = value.trim().split(/\s+/);

    return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || '--';
  }
}
