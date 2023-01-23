import { Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[asterisk]'
})
export class MatInputRequiredDirective {
  @Input() set asterisk(text: string) {
    console.log(text);
  }
  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  ngOnInit() { }

}
