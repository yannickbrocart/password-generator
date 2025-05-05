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
const CHAR_NUMBERS 		= '0123456789';
const CHAR_SPECIALS 	= "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~Â£";
const CHAR_AMBIGUOUS	= ['I', 'i', 'L', 'l', '|', '1', 'O', 'o', '0', '-', '_', ':', ';', '.', ',', '"', "'", '`'];
const CHAR_BRACKETS		= ['<', '>', '(', ')', '[', ']', '{', '}'];
const PASSWORD_STRENGTH = {
	veryStrong: 'Very strong',
	strong:     'Strong',
	mediocre:   'Good',
	weak:       'Weak',
	veryWeak:   'Very weak'
};
const TAB_INPUTS		= {
	lowercase: true,
	uppercase: true,
	numbers: true,
	specials: true,
	noAmbiguous: false,
	noDuplicate: false,
	noConsecutive: true,
	all: true
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
	chosenCharacters = CHAR_LOWERCASE + CHAR_UPPERCASE + CHAR_NUMBERS + CHAR_SPECIALS;
	passwordLenght = 16;
		
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
					this._writeChosenCharacters();
				});
			});
			this.passwordSettingsComponent = document.getElementById('password-settings');
			this.passwordSettingsComponent.classList.add('hidden');
		}

		_handleInputOptions(input) {
			if (input.id === 'input-lowercase' && input.checked == false ||
				input.id === 'input-uppercase' && input.checked == false ||
				input.id === 'input-numbers' && input.checked == false || 
				input.id === 'input-specials' && input.checked == false ||
				input.id === 'input-no-ambiguous' && input.checked == true ||
				input.id === 'input-no-duplicate' && input.checked == true ||
				input.id === 'input-no-consecutive' && input.checked == true ||
				input.id === 'input-no-bracket' && input.checked == true) {
				document.getElementById('input-all').checked = false;
			} 
			if (input.id === 'input-all' && input.checked == true) {
				document.getElementById('input-lowercase').checked = true;
				document.getElementById('input-uppercase').checked = true;
				document.getElementById('input-numbers').checked = true;
				document.getElementById('input-specials').checked = true;
				document.getElementById('input-no-ambiguous').checked = false;
				document.getElementById('input-no-bracket').checked = false;
			}
			if ((input.id === 'input-lowercase' || input.id === 'input-uppercase' ||
				input.id === 'input-numbers' || input.id === 'input-specials' ||
				input.id === 'input-no-ambiguous' || input.id === 'input-no-duplicate' ||
				input.id === 'input-no-consecutive' || input.id === 'input-no-bracket') &&
				document.getElementById('input-lowercase').checked == true &&
				document.getElementById('input-uppercase').checked == true &&
				document.getElementById('input-numbers').checked == true &&
				document.getElementById('input-specials').checked == true &&
				document.getElementById('input-no-ambiguous').checked == false &&
				document.getElementById('input-no-bracket').checked == false) {
				document.getElementById('input-all').checked = true;
			}
		}

		_writeChosenCharacters() {
			this.chosenCharacters = '';
			if (document.getElementById('input-lowercase').checked == true)
				this.chosenCharacters += CHAR_LOWERCASE;
			if (document.getElementById('input-uppercase').checked == true)
				this.chosenCharacters += CHAR_UPPERCASE;
			if (document.getElementById('input-numbers').checked == true)
				this.chosenCharacters += CHAR_NUMBERS;
			if (document.getElementById('input-specials').checked == true)
				this.chosenCharacters += CHAR_SPECIALS;
			if (document.getElementById('input-no-ambiguous').checked == true) {
				CHAR_AMBIGUOUS.forEach(function(characters){
					this.chosenCharacters = this.chosenCharacters.replaceAll(characters, '');
				}, this)
			}
			if (document.getElementById('input-no-bracket').checked == true) {
				CHAR_BRACKETS.forEach(function(brackets){
					this.chosenCharacters = this.chosenCharacters.replaceAll(brackets, '');
				}, this)
			}
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
			var passwordGenerated = '';
			var id = 0;
			var newCharacter = '';
			// loop for password length
			while (id < this.passwordLenght) {
				// random choice into the chosen caracteres
				newCharacter = this.chosenCharacters.charAt(Math.floor(Math.random() * this.chosenCharacters.length));
				if ((document.getElementById('input-no-duplicate').checked == false ||
					 (document.getElementById('input-no-duplicate').checked == true && passwordGenerated.includes(newCharacter) == false)) &&
					(document.getElementById('input-no-consecutive').checked == false ||
					 (document.getElementById('input-no-consecutive').checked == true && passwordGenerated.endsWith(newCharacter) == false))) {
					passwordGenerated += newCharacter;
					id++;
				} 
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
