import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { timeStamp } from 'console';

@Directive({
  selector: '[appCheckScroll]'
})
export class CheckScrollDirective {

  @Input() checkScrollValue: number;
  
  public scrollValue: number;
  private check:boolean;

  constructor(private elementRef: ElementRef) { }

  @HostListener('window:scroll') onResize(){
    
    this.scrollValue =  document.scrollingElement.scrollHeight - document.scrollingElement.scrollTop - document.scrollingElement.clientHeight;
    
    if(this.checkScrollValue && this.checkScrollValue < this.scrollValue){
      if(this.check){
        this.check = false;
        (this.elementRef.nativeElement as HTMLDivElement).style.display= 'block';
      }
    } else {
      if(!this.check){
        (this.elementRef.nativeElement as HTMLDivElement).style.display= 'none';
        this.check = true;
      }
    }
  
  }
  
}
