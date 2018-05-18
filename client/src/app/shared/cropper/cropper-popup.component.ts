import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cropper-popup',
  templateUrl: 'cropper-popup.component.html'
})

export class CropperPopupComponent implements OnInit, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() image: any;
  @Output() validate = new EventEmitter<string>();

  @ViewChild('inputFile') $inputFile: ElementRef;
  private croppedImage: string;
  importing = false;
  constructor() { }
  ngOnInit() { }
  ngOnDestroy() {
    this.croppedImage = null;
  }
  close() {
    this.visible = false;
    this.visibleChange.next(this.visible);
  }
  /**
   * Handle the end of the crop
   * @param image Base64 Image
   */
  onCropEnd(image: string) {
    this.croppedImage = image;
  }
  onValidate() {
    this.validate.next(this.croppedImage);
    this.close();
  }
  import() {
    this.$inputFile.nativeElement.click();
  }
  onFileImported(e) {
    // console.log('onFileChange', e);
    const reader = new FileReader();
    const files = e.target.files;
    if (files && files.length > 0) {
      reader.onabort = this.onFileReaderError.bind(this);
      reader.onerror = this.onFileReaderError.bind(this);
      reader.onloadstart = this.onFileReaderStart.bind(this);
      reader.onloadend = this.onFileReaderStop.bind(this);
      reader.onload = this.onFileReaderOnLoad.bind(this, reader);
      reader.readAsDataURL(files[0]);
    }
  }
  private onFileReaderStart() {
    console.log('onloadstart');
    this.importing = true;
  }
  private onFileReaderStop() {
    console.log('onloadend');
    this.importing = false;
  }
  private onFileReaderError() {
    console.log('error file');
    this.importing = false;
    // TODO: Display error
  }
  private onFileReaderOnLoad(reader: FileReader) {
    // console.log('# FILE IMPORTED', reader.result);
    this.image = reader.result;
  }
}
