import { Directive, HostBinding } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-icon[outlined]'
})
export class OutlinedIconDirective {
  @HostBinding('class.material-icons-outlined')
  public readonly cssClass: boolean = true;
}
