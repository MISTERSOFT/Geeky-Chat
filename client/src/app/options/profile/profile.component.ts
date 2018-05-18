import { Component, OnInit, ChangeDetectorRef, ComponentFactoryResolver, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { User, Response } from '../../shared/models';
import { OptionsService } from '../options.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastDirective } from '../../shared/toast/toast.directive';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
})

export class ProfileComponent implements OnInit {
  @Input() toastContainer: ToastDirective;
  detailsForm: FormGroup;
  passwordForm: FormGroup;
  avatarLoading = false;
  saving = false;
  showCropperPopup = false;
  // user: User;
  get hasAvatar() {
    return !!this.detailsForm.controls.avatar.value;
  }
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    // private cfr: ComponentFactoryResolver,
    private options: OptionsService,
    private toast: ToastService,
    private auth: AuthService) { }
  ngOnInit() {
    // this.user = Object.assign({}, this.auth.user);
    this.detailsForm = this.fb.group({
      id: [this.auth.user.id],
      avatar: [this.auth.user.avatar],
      email: [this.auth.user.email, Validators.compose([Validators.required, Validators.email])],
      username: [this.auth.user.username, Validators.compose([Validators.required])]
    });
    this.passwordForm = this.fb.group({
      id: [this.auth.user.id],
      password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])]
    });
  }
  onSaveProfile(e) {
    console.log('onSaveProfile', this.detailsForm.valid, this.detailsForm.value);
    this.saving = true;
    this.options.updateProfile(this.detailsForm.value).subscribe((response: Response<any>) => {
      if (response.success) {
        // TODO: Show popup success
        this.auth.user.username = this.detailsForm.value.username;
        this.auth.user.email = this.detailsForm.value.email;
        this.auth.user.avatar = this.detailsForm.value.avatar;
        this.toast.createToast(this.toastContainer.viewContainerRef, {
          type: 'success',
          text: 'Profile details saved !',
          duration: 3000
        });
      } else {
        // TODO: Show popup error
        this.toast.createToast(this.toastContainer.viewContainerRef, {
          type: 'error',
          text: 'An error occured ! Not enable to save your profile details !',
          duration: 3000
        });
      }
      this.saving = false;
    })
  }
  onSavePassword(e) { }
  onFileChange(e) {
    console.log('onFileChange', e);
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
    console.log('onloadstart', this);
    this.avatarLoading = true;
  }
  private onFileReaderStop() {
    console.log('onloadend');
    this.avatarLoading = false;
  }
  private onFileReaderError() {
    console.log('error file');
    this.avatarLoading = false;
    // TODO: Display error
  }
  private onFileReaderOnLoad(reader: FileReader) {
    // console.log('# FILE', reader.result);
    this.patchAvatar(reader.result);
    // console.log('FB', this.detailsForm);
    // this.user.avatar = reader.result;
  }
  private patchAvatar(value) {
    this.detailsForm.patchValue({
      avatar: value
    });
    this.cd.markForCheck();
  }
  openCropperPopup() {
    this.showCropperPopup = true;
  }
  onCropperPopupValidate(image) {
    this.patchAvatar(image);
  }
}
