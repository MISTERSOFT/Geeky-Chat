import { Directive, HostListener, ElementRef, AfterViewInit } from '@angular/core';

@Directive({ selector: '[appInputAutoResize]' })
export class InputAutoResizeDirective implements AfterViewInit {
  private MAX_ROWS = 3;
  private fontSize = 14;
  private defaultHeight: number;
  private width: number;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.width = (this.el.nativeElement as HTMLTextAreaElement).offsetWidth;
    this.defaultHeight = (this.el.nativeElement as HTMLTextAreaElement).offsetHeight - 6;
  }

  @HostListener('keyup', ['$event']) onValueChanged(e: KeyboardEvent) {
    const textarea = (this.el.nativeElement as HTMLTextAreaElement);
    const container = textarea.parentElement.parentElement;
    const calculatedHeight = this.defaultHeight * this.estimateNumberOfRows();
    container.style.height = (calculatedHeight + 28) + 'px'
    textarea.style.height = calculatedHeight + 'px';
  }

  private estimateNumberOfRows() {
    const valueLength = (this.el.nativeElement as HTMLTextAreaElement).value.length;
    let count = 1;
    let estimateCharsLen = valueLength * (this.fontSize / 2.02);
    while (estimateCharsLen > this.width) {
      estimateCharsLen -= this.width;
      count++;
    }
    if (count > this.MAX_ROWS) {
      count = this.MAX_ROWS;
    }
    return count;
  }

}
