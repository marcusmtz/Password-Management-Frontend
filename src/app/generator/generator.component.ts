import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generator',
  imports: [NgIf,FormsModule],
  templateUrl: './generator.component.html'
})
export class GeneratorComponent {
  selectedOption: string = 'password';  
  userOption: string = 'username';

  passwordLength: number = 4;

  useUppercase: boolean = false;
  useLowercase: boolean = false;
  useNumbers: boolean = false;
  useSymbols: boolean = false;

  generatedText: string = '';

  generate() {
    if (this.selectedOption === 'password') {
      this.generatedText = this.generatePassword();
    } else if (this.selectedOption === 'user') {
      this.generatedText =
        this.userOption === 'username'
          ? this.generateUsername()
          : this.generateEmail();
    }
  }

  generatePassword(): string {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    let chars = '';
    if (this.useUppercase) chars += upper;
    if (this.useLowercase) chars += lower;
    if (this.useNumbers) chars += numbers;
    if (this.useSymbols) chars += symbols;

    if (!chars) return '';

    return Array.from({ length: this.passwordLength }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  generateUsername(): string {
    const adjectives = ['cool', 'fast', 'brave', 'happy', 'sneaky', 'lucky'];
    const nouns = ['lion', 'ninja', 'dev', 'tiger', 'wizard', 'panda'];
    const number = Math.floor(Math.random() * 1000);
  
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
    return `${adjective}_${noun}${number}`;
  }
  
  generateEmail(): string {
    const names = ['marcos', 'lucas', 'sofia', 'emma', 'oliver', 'mia'];
    const separators = ['.', '_', ''];
    const number = Math.floor(Math.random() * 1000);
  
    const name = names[Math.floor(Math.random() * names.length)];
    const secondName = names[Math.floor(Math.random() * names.length)];
    const separator = separators[Math.floor(Math.random() * separators.length)];
  
    return `${name}${separator}${secondName}${number}@xample.com`;
  }
  

  copyToClipboard() {
    navigator.clipboard.writeText(this.generatedText);
  }
}
