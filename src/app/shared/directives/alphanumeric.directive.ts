import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphanumeric]',
  standalone: true
})
export class AlphanumericDirective {

  private regex = new RegExp(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ]*$/);

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') return;
    if (!this.regex.test(event.key)) event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text');

    if (!this.regex.test(pastedText!)) {
      event.preventDefault();
      const sanitizedText = pastedText?.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚ\s]/g, '');

      document.execCommand('insertText', false, sanitizedText);
    }
  }
}
