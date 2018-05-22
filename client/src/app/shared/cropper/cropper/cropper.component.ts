import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import 'cropperjs';

@Component({
  selector: 'app-cropper',
  templateUrl: 'cropper.component.html',
  styleUrls: ['cropper.component.scss']
})

export class CropperComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() image: any;
  @ViewChild('imageElement') imageElement: ElementRef;
  @Output() cropEnd = new EventEmitter<string>();
  cropper: Cropper;

  constructor() { }
  ngOnInit() { }
  ngOnDestroy() {
    this.cropper.destroy();
    this.cropper = null;
  }
  ngOnChanges(changes) {
    if (changes.image && !changes.image.firstChange && changes.image.currentValue) {
      console.log('ngOnChanges');
      const image = changes.image.currentValue;
      this.cropper.destroy().replace(image).crop();
      // this.cropper.replace(image);
      // .reset();
      // console.log('cropped canvas', this.cropper.getCroppedCanvas());
      // this.onCropEnd();
    }
  }
  ngAfterViewInit() {
    this.initCropper();
  }
  private initCropper() {
    const opts: Cropper.Options = {
      aspectRatio: 1,
      viewMode: 1,
      zoomable: false,
      zoomOnWheel: false,
      zoomOnTouch: false,
      minContainerHeight: 300,
      minContainerWidth: 576,
      minCanvasHeight: 300,
      minCanvasWidth: 576,
      cropend: this.onCropEnd.bind(this)
    };
    this.cropper = new Cropper(this.imageElement.nativeElement, opts);
  }
  private onCropEnd() {
    console.log('onCropEnd');
    this.cropper.getCroppedCanvas().toBlob(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        console.log('Base64 image cropped', reader.result);
        this.cropEnd.next(reader.result);
      }
    });
  }
}