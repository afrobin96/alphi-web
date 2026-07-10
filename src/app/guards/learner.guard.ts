import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { AuthStore } from "../stores/auth.store"


export const learnerGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (auth.user()?.role === 'learner') {
    return true;
  }

  // Si es admin que intentó entrar a /learner, lo manda al admin
  router.navigate(['/admin']);
  return false;
}
