import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CobaltButton } from '../components/cobalt-button/cobalt-button';
import { CobaltInput } from '../components/cobalt-input/cobalt-input';
import { InternalButton } from '../components/internal-button/internal-button';

export const SHARED_IMPORTS = [
  FormsModule,
  ReactiveFormsModule,
  CobaltButton,
  CobaltInput,
  InternalButton
] as const;