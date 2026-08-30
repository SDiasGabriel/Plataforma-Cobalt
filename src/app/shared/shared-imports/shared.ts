import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CobaltButton } from '../components/cobalt-button/cobalt-button';
import { CobaltInput } from '../components/cobalt-input/cobalt-input';

export const SHARED_IMPORTS = [
  FormsModule,
  ReactiveFormsModule,
  CobaltButton,
  CobaltInput,
] as const;