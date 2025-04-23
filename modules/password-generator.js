/**
 * --------------------------------------------------------------------------
 * Password-generator.js
 * Licensed under MIT (https://github.com/yannickbrocart/password-generator/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const CHAR_LOWERCASE	= 'abcdefghjkmnpqrstuvwxyz';
const CHAR_UPPERCASE 	= 'ABCDEFGHJKMNPQRSTUVWXYZ';
const CHAR_NUMBERS 	= '0123456789';
const CHAR_SPECIALS 	= "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~Â£";
const CHAR_AMBIGUOUS	= 'IiLlOo10';
const PASSWORD_STRENGTH = {
	veryStrong: 'Very strong',
	strong:     'Strong',
	mediocre:   'Good',
	weak:       'Weak',
	veryWeak:   'Very weak'
};


/**
 * Class definition
 */

class PasswordGenerator {
	// Fields
	passwordGeneratorComponent;
	passwordSettingsComponent;
	passwordSlider;
	sliderNumber = 12;
	lenghtInput;
	chosenCharacteres = CHAR_LOWERCASE + CHAR_UPPERCASE + CHAR_NUMBERS + CHAR_SPECIALS;
	passwordLenght = 16;
	isAllCharacters = true;
	isIncludeLowercase = true;
	isIncludeUppercase = true;
	isIncludeNumbers = true;
	isIncludeSpecials = true;
	
	// Constructor
    	constructor(passwordGeneratorDivId) {
			this._initPasswordGeneratorComponents(passwordGeneratorDivId);
    	}
    	
    	// Private
    	_initPasswordGeneratorComponents(divId) {
			this.passwordGeneratorComponent = document.getElementById(divId);
			this.lenghtInput = document.getElementById('password-lenght');
			this.password = document.getElementById('password');
			this.password.innerHTML = '<span class="password-alert">Please generate...</span>';
			this._initListeningButtons();
			this._initListeningSlider();
			this._initListeningSettings();
		}

		_initListeningButtons() {
			const arrayLike = document.getElementsByClassName('button');
			const buttons = Array.from(arrayLike);
			buttons.forEach(button => {
				button.addEventListener('click', (event) => {
					switch(event.target.parentElement.id) {
						case 'generate': this._handleGenerate(); break;
						case 'copy': this._handleCopy(); break;
						case 'settings': this._handleSettings(); break;
					}
				})
			})
		}
		
		_initListeningSlider() {
			const headProgress = document.getElementById('head-progress');
			headProgress.classList.add('head-progress');
			this.sliderNumber = document.getElementById('slider-number');
			this.sliderNumber.innerText = '12';
			this.passwordSlider = document.getElementById('slider');
			this.passwordSlider.addEventListener('input', (event) => {
				this.sliderNumber.innerText = this.passwordLenght = event.target.value;
				this._handleGenerate();
			})
		}
		
		_initListeningSettings() {
			const arrayLike = document.getElementsByTagName('input');
			const settings = Array.from(arrayLike);
			settings.forEach(input => {
				input.addEventListener('change', (event) => { 
					event.target.checked == true ? event.target.checked = true : event.target.checked = false;
					this._handleInputOptions(event.target);
					this._writeChosenCharacteres();
				});
			});
			this.passwordSettingsComponent = document.getElementById('password-settings');
			this.passwordSettingsComponent.classList.add('hidden');
		}

		_handleInputOptions(input) {			
			if (input.id === 'input-lowercase' && input.checked == false ||
				input.id === 'input-uppercase' && input.checked == false ||
				input.id === 'input-numbers' && input.checked == false || 
				input.id === 'input-specials' && input.checked == false) {
				document.getElementById('input-all').checked = false;
			} 
			if (input.id === 'input-all' && input.checked == true) {
				document.getElementById('input-lowercase').checked = true;
				document.getElementById('input-uppercase').checked = true;
				document.getElementById('input-numbers').checked = true;
				document.getElementById('input-specials').checked = true;
			}
			if ((input.id === 'input-lowercase' || input.id === 'input-uppercase' ||
				input.id === 'input-numbers' || input.id === 'input-specials') &&
				document.getElementById('input-lowercase').checked == true &&
				document.getElementById('input-uppercase').checked == true &&
				document.getElementById('input-numbers').checked == true &&
				document.getElementById('input-specials').checked == true) {
				document.getElementById('input-all').checked = true;
			}
		}

		_writeChosenCharacteres() {
			this.chosenCharacteres = '';
			if (document.getElementById('input-lowercase').checked == true)
				this.chosenCharacteres += CHAR_LOWERCASE;
			if (document.getElementById('input-uppercase').checked == true)
				this.chosenCharacteres += CHAR_UPPERCASE;
			if (document.getElementById('input-numbers').checked == true)
				this.chosenCharacteres += CHAR_NUMBERS;
			if (document.getElementById('input-specials').checked == true)
				this.chosenCharacteres += CHAR_SPECIALS;
		}

		_handleGenerate() {
			this.password.innerText = this._generatePassword();
			this._handlePasswordStrenght();
		}

		_handlePasswordStrenght() {
			const score = document.getElementById('score');
			const duration = document.getElementById('duration');
			const headProgress = document.getElementById('head-progress');
			var color = '';
			var headProgressWidth;
			var zxcvbnResult = zxcvbn(this.password.innerText);
			switch (zxcvbnResult.score) {
				case 0: 
					score.innerText = 'Very weak'; 
					color = '#bf3149'; 
					headProgressWidth = '20%'; break;
				case 1: 
					score.innerText = 'Weak'; 
					color = '#c27e31';  
					headProgressWidth = '40%'; break;
				case 2: 
					score.innerText = 'Good'; 
					color = '#bf9c32';  
					headProgressWidth = '60%'; break;
				case 3: 
					score.innerText = 'Strong'; 
					color = '#b1c231';  
					headProgressWidth = '80%'; break;
				case 4: 
					score.innerText = 'Very strong'; 
					color = '#32bf4c'; 
					headProgressWidth = '100%';
			}
			headProgress.style.backgroundColor = score.style.color = duration.style.color = color;
			headProgress.style.width = headProgressWidth;
			duration.innerText = zxcvbnResult.crack_times_display.offline_fast_hashing_1e10_per_second;
		}

		_handleCopy() {
			this._copyPasswordToClipboard();
		}

		_handleSettings() {
			this.passwordSettingsComponent.classList.toggle('hidden');
		}

		_generatePassword() {
			let passwordGenerated = '';
			// loop for password length
			for (let id = 0; id < this.passwordLenght; id++) {
				// random choice into the chosen caracteres
				passwordGenerated += this.chosenCharacteres.charAt(Math.floor(Math.random() * this.chosenCharacteres.length));
			}
			return passwordGenerated;
		}
		
		_copyPasswordToClipboard() {
			if (this.password !== '')
				navigator.clipboard.writeText(this.password).then(
					function() 		{},
					function(error) {alert('Error: ' + error)}
				)
		}
}
