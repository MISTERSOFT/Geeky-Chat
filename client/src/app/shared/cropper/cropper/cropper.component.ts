import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
      const image = changes.image.currentValue;
      if (!this.cropper) {
        this.initCropper();
      }
      setTimeout(() => {
        this.cropper.replace(image);
      }, 0);
    }
  }

  ngAfterViewInit() {
    if (this.image) {
      this.initCropper();
    }
  }

  private initCropper() {
    setTimeout(() => {
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
        ready: this.onReady.bind(this),
        cropend: this.onCropEnd.bind(this)
      };
      this.cropper = new Cropper(this.imageElement.nativeElement, opts);
    }, 0);
  }

  /**
   * Triggered when Cropper is ready.
   */
  private onReady() {
    this.convertImage();
  }

  private onCropEnd() {
    this.convertImage();
  }

  private convertImage() {
    this.cropper.getCroppedCanvas().toBlob(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        this.cropEnd.next(reader.result);
      }
    });
  }
}
