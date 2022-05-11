class Keyboard {
	constructor(keysLayout, placeNode = null) {
		this.parentNode = placeNode;
		this.elements = {
			main: null,
			keyboardWrapper: null,
			display: null,
			keysContainer: null,
			keys: [],
		};
		this.eventHandlers = {
			onInput: null,
			onClose: null,
		};
		this.properties = {
			value: "",
			cursorPos: 0,
			isCapsLock: false,
			isShift: false,
			lang: "ENG",
		};
		this.keysLayout = [...keysLayout];
	}

	initPage() {
		// create page elements
		this.elements.main = document.createElement("main");
		const header = document.createElement("header");
		const footer = document.createElement("footer");
		const headerTitle = document.createElement("h1");
		footer.innerHTML = `
            <div class="hint">
            <h3 class="subtitle">This keyboard was created in MacOS</h3>
                <h3 class="subtitle">Press control or option + command (alt + command) to switch language</h3>
            </div> 
        `;

		// setup page elements
		this.elements.main.classList.add("container");
		footer.classList.add("footer");
		headerTitle.classList.add("header-title");
		headerTitle.append("Virtual Keyboard (RS School Task)");

		// add to DOM
		header.append(headerTitle);
		document.body.append(header, this.elements.main, footer);
	}

	initKeyboard() {
		// create elements
		this.elements.keyboardWrapper = document.createElement("div");
		const displayWrapper = document.createElement("div");
		this.elements.display = document.createElement("textarea");
		this.elements.keysContainer = document.createElement("div");

		// setup elements
		this.elements.keyboardWrapper.classList.add("keyboard-wrapper");
		this.elements.keyboardWrapper.id = "keyboard-wrapper";
		displayWrapper.classList.add("display-wrapper");
		this.elements.display.classList.add("display-text");
		this.elements.display.id = "display-text";
		this.elements.display.cols = 5;
		this.elements.display.rows = 5;
		this.elements.keysContainer.classList.add("keyboard");
		this.elements.keysContainer.id = "keyboard";
		this.elements.display.placeholder =
			"Please press on ? button to know more about this virtual-keyboard.";

		// add to DOM
		displayWrapper.append(this.elements.display);
		this.elements.keyboardWrapper.append(
			displayWrapper,
			this.elements.keysContainer
		);
		// add keys to DOM
		this.elements.keysContainer.append(this._createKeys());
		// add to this.elements.keys
		this.elements.keys =
			this.elements.keysContainer.getElementsByClassName("keyboard__key");
		// ???
		// this.elements.keys =
		//   this.elements.keysContainer.querySelectorAll(".keyboard__key");

		if (!this.parentNode) {
			this.elements.main.append(this.elements.keyboardWrapper);
		} else {
			this.parentNode.append(this.elements.keyboardWrapper);
		}

		// add function to method onInput
		this.elements.display.addEventListener(
			"focus",
			this.printText(this.elements.display.value, (currentValue) => {
				this.elements.display.value = currentValue;
			})
		);
		this.elements.display.addEventListener("keydown", (evt) => {
			if (evt.code == "Tab") {
				this.properties.value += "\t";
				this._triggerEvents("onInput");
				evt.preventDefault();
			}
		});
		// add function to input in textarea
		this.elements.display.addEventListener("input", (evt) => {
			this.properties.value = evt.target.value;
		});

		// add event to capture keys
		window.addEventListener("keydown", (evt) => {
			console.log("key - ", evt.key);
			console.log("keydown code - ", evt.code);
			for (const keyItem of this.elements.keys) {
				if (evt.code == keyItem.getAttribute("data-keycode")) {
					if (evt.code == "ShiftLeft") {
						this._pressShift(this.properties.lang, "left");
						break;
					}

					if (evt.code == "ShiftRight") {
						this._pressShift(this.properties.lang, "right");
						break;
					}

					if (evt.altKey && evt.metaKey) {
						evt.preventDefault();
						this._switchLanguage();
						break;
					}

					if (evt.ctrlKey) {
						this._switchLanguage();
						break;
					}

					if (evt.code == "CapsLock") {
						this._toggleCapsLock();
						keyItem.classList.add("remove");
						keyItem.classList.toggle(
							"key--capslock-active",
							this.properties.isCapsLock
						);

						setTimeout(() => {
							keyItem.classList.remove("remove");
						}, 200);
						break;
					}

					keyItem.classList.add("active");
				}
				if (
					evt.code == keyItem.getAttribute("data-keycode") &&
					keyItem.getAttribute("data-ishotkey") == "false"
				) {
					console.log("--------------");
					this.properties.value += keyItem.textContent;
					this._triggerEvents("onInput");
					evt.preventDefault();
				}
			}
		});
		window.addEventListener("keyup", (evt) => {
			console.log("keyup code - ", evt.code);
			for (const keyItem of this.elements.keys) {
				if (evt.code == keyItem.getAttribute("data-keycode")) {
					if (evt.code == "ShiftLeft") {
						this._pressShift(this.properties.lang, "left");
						break;
					}

					if (evt.code == "ShiftRight") {
						this._pressShift(this.properties.lang, "right");
						break;
					}

					if (evt.code == "CapsLock") {
						this._toggleCapsLock();
						keyItem.classList.toggle(
							"key--capslock-active",
							this.properties.isCapsLock
						);
					}

					keyItem.classList.remove("active");
					keyItem.classList.add("remove");
				}
				setTimeout(() => {
					keyItem.classList.remove("remove");
				}, 200);
			}
		});
	}

	_createKeys() {
		// this.keysLayout.forEach((key) => {
		//   console.log(key);
		// });
		const keysFragment = document.createDocumentFragment();
		let arrowsBlockElement = null;

		// create icon function
		const createIconHTML = (icon_name) => {
			return `<span class="material-symbols-outlined key__icon">
                ${icon_name}
            </span>`;
		};
		// create key text function
		const createKeyTextHTML = (key_text) => {
			return `<span class="key__text">
                ${key_text}
            </span>`;
		};
		// create indicator function
		const createIndicatorHTML = () => {
			return `<span class="key__indicator"></span>`;
		};
		// create arrow block function
		const createArrowsBlockHTML = () => {
			const newNode = document.createElement("span");
			newNode.classList.add("arrows-block");
			newNode.innerHTML = `
                <span class="arrows__row arrows__row--top"></span>
                <span class="arrows__row arrows__row--bottom"></span>
            `;
			return newNode;
		};
		// ======================================

		// count number of rows
		const rowArray = this.keysLayout.map((item) => {
			return item.keyRow;
		});
		const rowCount = Math.max(...rowArray);

		// create rows
		for (let i = 1; i <= rowCount; i++) {
			const rowElement = document.createElement("div");
			rowElement.classList.add("keyboard__row");
			keysFragment.append(rowElement);
		}

		// create keys
		this.keysLayout.forEach((key) => {
			const keyElement = document.createElement("span");
			keyElement.classList.add("keyboard__key");

			if (
				key.isOptionKey &&
				!key.optionName.includes("arrow") &&
				!key.optionName.includes("help")
			) {
				keyElement.classList.add("key--hotkey");
				keyElement.setAttribute("data-ishotkey", "true");

				switch (key.optionName) {
					case "backspace": {
						keyElement.classList.add("key--backspace");
						keyElement.innerHTML =
							createKeyTextHTML("backspace") +
							createIconHTML("backspace");
						keyElement.addEventListener("click", () => {
							this.properties.value =
								this.properties.value.substring(
									0,
									this.properties.value.length - 1
								);
							this._triggerEvents("onInput");
						});
						break;
					}
					case "tab": {
						keyElement.classList.add("key--tab");
						keyElement.innerHTML = "tab";
						keyElement.addEventListener("click", () => {
							this.properties.value += "\t";
							this._triggerEvents("onInput");
						});
						break;
					}
					case "delete": {
						keyElement.classList.add("key--del");
						keyElement.innerHTML = "del";
						break;
					}
					case "caps lock": {
						keyElement.classList.add("key--capslock");
						keyElement.innerHTML =
							createKeyTextHTML("caps lock") +
							createIndicatorHTML();
						keyElement.addEventListener("click", () => {
							this._toggleCapsLock();
							keyElement.classList.toggle(
								"key--capslock-active",
								this.properties.isCapsLock
							);
						});
						break;
					}
					case "return": {
						keyElement.classList.add("key--return");
						keyElement.innerHTML = "return";
						keyElement.addEventListener("click", () => {
							this.properties.value += "\n";
							this._triggerEvents("onInput");
						});
						break;
					}
					case "shift left": {
						keyElement.classList.add(
							"key--shift",
							"key--shift-left"
						);
						keyElement.innerHTML = "shift";
						keyElement.addEventListener("click", () => {
							this._pressShift(this.properties.lang, null);
						});
						break;
					}
					case "shift right": {
						keyElement.classList.add(
							"key--shift",
							"key--shift-right"
						);
						keyElement.innerHTML = "shift";
						keyElement.addEventListener("click", () => {
							this._pressShift(this.properties.lang, null);
						});
						break;
					}
					case "control left": {
						keyElement.classList.add("key--control");
						keyElement.innerHTML =
							createKeyTextHTML("control") +
							createIconHTML("keyboard_control_key");
						keyElement.addEventListener("click", () => {
							this._switchLanguage();
						});
						break;
					}
					case "option left": {
						keyElement.classList.add(
							"key--option",
							"key--option-left"
						);
						keyElement.innerHTML =
							createKeyTextHTML("option") +
							createIconHTML("keyboard_option_key");
						break;
					}
					case "option right": {
						keyElement.classList.add(
							"key--option",
							"key--option-right"
						);
						keyElement.innerHTML =
							createKeyTextHTML("option") +
							createIconHTML("keyboard_option_key");
						break;
					}
					case "command left": {
						keyElement.classList.add(
							"key--command",
							"key--command-left"
						);
						keyElement.innerHTML =
							createKeyTextHTML("command") +
							createIconHTML("keyboard_command_key");
						break;
					}
					case "command right": {
						keyElement.classList.add(
							"key--command",
							"key--command-right"
						);
						keyElement.innerHTML =
							createKeyTextHTML("command") +
							createIconHTML("keyboard_command_key");
						break;
					}
					case "space": {
						keyElement.classList.add("key--space");
						keyElement.addEventListener("click", () => {
							// console.log(this.elements.display.selectionStart);
							// this.properties.value =
							// 	this.properties.value.substring(
							// 		0,
							// 		this.elements.display.selectionStart
							// 	) +
							// 	" " +
							// 	this.properties.value.substring(
							// 		this.elements.display.selectionStart
							// 	);
							// this.elements.display.focus();
							// this.elements.display.selectionStart =
							// 	this.elements.display.selectionStart + 1;
							this.properties.value += " ";
							this._triggerEvents("onInput");
						});
						break;
					}
				}
			} else if (key.isOptionKey && key.optionName.includes("help")) {
				keyElement.classList.add("key--help");
				keyElement.id = "help-key";
				keyElement.innerHTML = createIconHTML("question_mark");
				const footerPage = document.querySelector(".footer");

				keyElement.addEventListener("click", () => {
					if (!keyElement.classList.contains("active")) {
						keyElement.classList.add("active");
						footerPage.classList.add("help-active");
					} else {
						keyElement.classList.remove("active");
						footerPage.classList.remove("help-active");
					}
				});
			} else if (key.isOptionKey && key.optionName.includes("arrow")) {
				keyElement.setAttribute("data-isHotkey", "true");

				switch (key.optionName) {
					case "arrow up": {
						keyElement.classList.add(
							"key--arrow",
							"key--arrow-top"
						);
						keyElement.innerHTML = "&uarr;";
						break;
					}
					case "arrow left": {
						keyElement.classList.add(
							"key--arrow",
							"key--arrow-left"
						);
						keyElement.innerHTML = "&larr;";
						break;
					}
					case "arrow down": {
						keyElement.classList.add(
							"key--arrow",
							"key--arrow-bottom"
						);
						keyElement.innerHTML = "&darr;";
						break;
					}
					case "arrow right": {
						keyElement.classList.add(
							"key--arrow",
							"key--arrow-right"
						);
						keyElement.innerHTML = "&rarr;";
						break;
					}
				}
			} else if (!key.isOptionKey) {
				// add text (lang) to keys
				keyElement.append(key.value[this.properties.lang]);
				keyElement.setAttribute("data-ishotkey", "false");

				keyElement.addEventListener("click", () => {
					this.properties.value += keyElement.textContent;
					// this.properties.value += this.properties.isCapsLock ? key.toUpperCase() : key.toLowerCase();
					this._triggerEvents("onInput");
				});
			}

			keyElement.setAttribute("data-keycode", key.keyCode);

			// add to row in DOM
			if (key.keyRow === 0) {
				keysFragment.prepend(keyElement);
			} else if (key.isOptionKey && key.optionName.includes("arrow")) {
				if (!arrowsBlockElement) {
					arrowsBlockElement = createArrowsBlockHTML();
					keysFragment.children[key.keyRow - 1].append(
						arrowsBlockElement
					);
				}
				if (key.optionName === "arrow up") {
					arrowsBlockElement.children[0].append(keyElement);
				} else {
					arrowsBlockElement.children[1].append(keyElement);
				}
			} else {
				keysFragment.children[key.keyRow - 1].append(keyElement);
			}
		});

		// add fragment to DOM
		// this.elements.keysContainer.append(keysFragment);
		return keysFragment;
	}

	_triggerEvents(handlerName) {
		console.log("Event trigerred! Name - ", handlerName);
		if (typeof this.eventHandlers[handlerName] == "function") {
			console.log(this.properties.value);
			this.eventHandlers[handlerName](this.properties.value);
		}
	}

	_toggleCapsLock() {
		console.log("Caps Lock toggled!");
		this.properties.isCapsLock = !this.properties.isCapsLock;

		for (const keyItem of this.elements.keys) {
			if (
				keyItem.getAttribute("data-ishotkey") &&
				keyItem.getAttribute("data-ishotkey") == "false"
			) {
				keyItem.textContent = this.properties.isCapsLock
					? keyItem.textContent.toUpperCase()
					: keyItem.textContent.toLowerCase();
			}
		}
	}

	_pressShift(language, side) {
		console.log("Shift pressed!");
		this.properties.isShift = !this.properties.isShift;

		for (const keyItem of this.elements.keys) {
			if (
				keyItem.getAttribute("data-ishotkey") &&
				keyItem.getAttribute("data-ishotkey") == "false"
			) {
				const keyObj = this.keysLayout.find((item) => {
					return item.keyCode == keyItem.getAttribute("data-keycode");
				});

				if (this.properties.isShift) {
					if (!keyObj.altValue[language]) {
						keyItem.textContent = keyObj.value[language];
					} else {
						keyItem.textContent = keyObj.altValue[language];
					}
				} else {
					keyItem.textContent = keyObj.value[language];
				}
			}
			if (
				(keyItem.getAttribute("data-keycode") == "ShiftLeft" &&
					side == "left") ||
				(keyItem.getAttribute("data-keycode") == "ShiftRight" &&
					side == "right") ||
				(side === null &&
					(keyItem.getAttribute("data-keycode") == "ShiftLeft" ||
						keyItem.getAttribute("data-keycode") == "ShiftRight"))
			) {
				keyItem.classList.toggle("active", this.elements.isShift);
			}
		}
	}

	_switchLanguage() {
		console.log("switch lang");
		switch (this.properties.lang) {
			case "RU": {
				this.properties.lang = "ENG";
				break;
			}
			case "ENG": {
				this.properties.lang = "RU";
				break;
			}
		}

		for (const keyItem of this.elements.keys) {
			if (
				keyItem.getAttribute("data-ishotkey") &&
				keyItem.getAttribute("data-ishotkey") == "false"
			) {
				const keyObj = this.keysLayout.find((item) => {
					return item.keyCode == keyItem.getAttribute("data-keycode");
				});
				if (keyObj.value[this.properties.lang]) {
					keyItem.textContent = keyObj.value[this.properties.lang];
				}
			}
		}
	}

	printText(initValue, onInput) {
		this.properties.value = initValue || "";
		this.eventHandlers.onInput = onInput;
		// this.eventHandlers.onClose = onClose;
	}

	close() {
		// save current lang to localStorage
	}
}

export default Keyboard;
